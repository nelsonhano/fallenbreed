import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

import logoGlbUrl from '../assets/Logo FB.glb?url'
useGLTF.preload(logoGlbUrl)

// ─── Inner Three.js model ─────────────────────────────────────────────────────
function LogoModel({ scrollProgress, wrapperRef }) {
  const { scene }  = useGLTF(logoGlbUrl)
  const groupRef   = useRef()
  const fillRef    = useRef(null)
  const targetDRef = useRef(null)
  const targetMRef = useRef(null)

  useFrame(({ camera, size }) => {
    if (!groupRef.current) return

    // ── One-time bounding-box measurement ──────────────────────────────────
    if (fillRef.current === null) {
      const box = new Box3().setFromObject(groupRef.current)
      if (box.isEmpty()) return  // geometry not ready — retry next frame

      const modelSize = box.getSize(new Vector3())
      const vFov = (camera.fov * Math.PI) / 180
      const visH = 2 * Math.tan(vFov / 2) * Math.abs(camera.position.z)
      const visW = visH * (size.width / size.height)

      fillRef.current    = visW / modelSize.x
      targetDRef.current = fillRef.current * (260 / size.width)  // ~260 px desktop
      targetMRef.current = fillRef.current * 0.50                // ~50 vw mobile
      // Do NOT reveal the canvas here — visibility is controlled by scroll progress
    }

    const fill = fillRef.current
    if (fill === null) return   // still waiting for geometry

    const isMobile   = size.width < 768
    const target     = isMobile ? targetMRef.current : targetDRef.current
    const targetPosY = isMobile ? 1.2 : 1.15
    const t          = scrollProgress.current  // 0 → 1

    // ── Visibility gate ────────────────────────────────────────────────────
    // The wrapper stays hidden (CSS visibility:hidden) while Scene1 is on screen.
    // Only reveal once Scene1 has fully faded (t ≥ 0.55). This is the single
    // source of truth — no z-index race, no opacity fade on the 3D canvas.
    if (wrapperRef.current) {
      wrapperRef.current.style.visibility = t >= 0.55 ? 'visible' : 'hidden'
    }

    // On mobile cap at 82 % of fill so the logo fits within viewport height.
    const effectiveFill = isMobile ? fill * 0.82 : fill

    // ── Scale ──────────────────────────────────────────────────────────────
    //   t 0.55 → 0.60  hold at effectiveFill  (revealed at full size)
    //   t 0.60 → 1.00  ease DOWN to target    (lands onto Scene2)
    let currentScale

    if (t < 0.60) {
      currentScale = effectiveFill
    } else {
      const sp = Math.min((t - 0.60) / 0.40, 1)
      const k  = sp < 0.5
        ? 2 * sp * sp
        : 1 - Math.pow(-2 * sp + 2, 2) / 2
      currentScale = effectiveFill + (target - effectiveFill) * k
    }

    groupRef.current.scale.setScalar(currentScale)

    // Vertical drift: rises slightly while scaling down
    let posProgress = 0
    if (t > 0.60) {
      posProgress = Math.min((t - 0.60) / 0.40, 1)
    }
    const posK = posProgress < 0.5
      ? 2 * posProgress * posProgress
      : 1 - Math.pow(-2 * posProgress + 2, 2) / 2
    groupRef.current.position.y = targetPosY * posK
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

// ─── Fixed canvas overlay ─────────────────────────────────────────────────────
export default function Logo3D({ spacerRef }) {
  const wrapperRef     = useRef()
  const scrollProgress = useRef(0)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const spacer  = spacerRef?.current
    if (!wrapper || !spacer) return

    scrollProgress.current = 0

    const ctx = gsap.context(() => {
      const proxy = { progress: 0 }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#logo-spacer',
          start: 'top top',
          end:   'bottom top',
          scrub: 1.2,
        },
      })

      tl.to(proxy, {
        progress: 1,
        ease: 'none',
        duration: 1,
        onUpdate() { scrollProgress.current = proxy.progress },
      }, 0)
    })

    return () => ctx.revert()
  }, [spacerRef])

  return (
    <div
      ref={wrapperRef}
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        20,
        opacity:       1,
        visibility:    'hidden',   // useFrame reveals this once t ≥ 0.55
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0) }}
        style={{ width: '100%', height: '100%', background: 'transparent', display: 'block' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[0, 4, 4]}   intensity={3.5} color="#ffffff" />
        <pointLight      position={[0, -1, -5]}  intensity={0.9} color="#8899ff" />
        <pointLight      position={[-4, 2, 2]}   intensity={0.5} color="#ffffff" />

        <Suspense fallback={null}>
          <LogoModel scrollProgress={scrollProgress} wrapperRef={wrapperRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}

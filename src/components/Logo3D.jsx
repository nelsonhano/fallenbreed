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
//
// scrollProgress.current goes 0 → 1 as the user scrolls through the spacer.
// The fill scale is computed on the FIRST frame from the model's real bounding
// box so it exactly fills the viewport regardless of the GLB's unit size.
//
function LogoModel({ scrollProgress }) {
  const { scene }   = useGLTF(logoGlbUrl)
  const groupRef    = useRef()
  const rotYRef     = useRef(0)
  const fillRef     = useRef(null)   // scale that fills 100% viewport width
  const targetDRef  = useRef(null)   // desktop target (~260 px wide)
  const targetMRef  = useRef(null)   // mobile target (70 vw)

  useFrame(({ camera, size }, delta) => {
    if (!groupRef.current) return

    // ── One-time: compute fill scale from real bounding box ────────────────
    if (fillRef.current === null) {
      const box = new Box3().setFromObject(groupRef.current)
      if (!box.isEmpty()) {
        const modelSize = box.getSize(new Vector3())

        // How many Three.js units are visible horizontally at the camera's Z?
        const vFov      = (camera.fov * Math.PI) / 180
        const visH      = 2 * Math.tan(vFov / 2) * Math.abs(camera.position.z)
        const visW      = visH * (size.width / size.height)

        // fillRef: model width === 100% of viewport width
        fillRef.current    = visW / modelSize.x

        // Desktop target: 260 px of the viewport pixel width
        targetDRef.current = fillRef.current * (260 / size.width)

        // Mobile target: 70 vw
        targetMRef.current = fillRef.current * 0.70
      }
    }

    const fill = fillRef.current
    if (fill === null) {
      groupRef.current.scale.setScalar(0.001) // invisible until computed
      return
    }

    const isMobile  = size.width < 768
    const target    = isMobile ? targetMRef.current : targetDRef.current
    // Drop targetPosY to bring the logo closer down to the text
    const targetPosY = isMobile ? 0.9 : 1.15

    const t = scrollProgress.current // 0 → 1
    
    // Hold maximum big size (fill) until 60% scroll, then scale down over 60%→100%
    let shrinkProgress = 0
    if (t > 0.6) {
      shrinkProgress = Math.min((t - 0.6) / 0.4, 1)
    }

    // Smooth easing for the scale-down transition
    const k = shrinkProgress < 0.5
      ? 2 * shrinkProgress * shrinkProgress
      : 1 - Math.pow(-2 * shrinkProgress + 2, 2) / 2

    groupRef.current.scale.setScalar(fill + (target - fill) * k)
    groupRef.current.position.y = targetPosY * k

    // The 3D model rotation has been removed as requested user.
    // groupRef.current.rotation.y = rotYRef.current
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
  const scrollProgress = useRef(0)   // written by GSAP, read by useFrame

  useEffect(() => {
    const wrapper = wrapperRef.current
    const spacer  = spacerRef?.current
    if (!wrapper || !spacer) return

    // Reset on every mount (handles Strict Mode double-fire & HMR)
    scrollProgress.current = 0
    wrapper.style.opacity  = '0'

    const ctx = gsap.context(() => {
      // Proxy object: GSAP scrubs its `progress` from 0 → 1 as the user
      // scrolls through the spacer.  useFrame reads scrollProgress.current
      // every animation frame — no React re-renders required.
      const proxy = { progress: 0 }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#logo-spacer',
          start: 'top top',       
          end: 'bottom top',      // lock animation exactly when Scene2 is fully inserted
          scrub: 1.2,
        },
      })

      // Map scroll → 0..1 progress value consumed by useFrame
      tl.to(proxy, {
        progress: 1,
        ease: 'none',
        duration: 1,
        onUpdate() { scrollProgress.current = proxy.progress },
      }, 0)

      // 40% - 60% mapping: the 3D logo fades in EXACTLY as Scene 1 fades out.
      tl.fromTo(
        wrapper,
        { opacity: 0 },
        { opacity: 1, ease: 'power1.inOut', duration: 0.2 },
        0.4
      )
    })

    return () => ctx.revert()
  }, [spacerRef])

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
        opacity: 0,            // GSAP drives this; starts hidden
        willChange: 'opacity',
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        onCreated={({ gl }) => {
          // Ensure WebGL clears to fully transparent (not black)
          gl.setClearColor(0x000000, 0)
        }}
        style={{ width: '100%', height: '100%', background: 'transparent', display: 'block' }}
      >
        {/* Ambient fill */}
        <ambientLight intensity={0.7} />
        {/* Key light — above-front, creates a spotlight feel */}
        <directionalLight position={[0, 4, 4]}  intensity={3.5} color="#ffffff" />
        {/* Rim / back light — cool depth accent */}
        <pointLight      position={[0, -1, -5]} intensity={0.9} color="#8899ff" />
        {/* Side fill */}
        <pointLight      position={[-4, 2, 2]}  intensity={0.5} color="#ffffff" />

        <Suspense fallback={null}>
          <LogoModel scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  )
}


import { useRef, useState, useEffect } from 'react'
import Scene1 from './components/Scene1.jsx'
import Logo3D from './components/Logo3D.jsx'
import Scene2 from './components/Scene2.jsx'
import { useScrollAnimation } from './hooks/useScrollAnimation.js'

import { useSmoothScroll } from './hooks/useSmoothScroll.js'

import comingSoon from './assets/Coming soon.jpg'
import person2 from './assets/Person2.png'
import logoSvg from './assets/Logo.svg'

export default function App() {
    const [assetsLoaded, setAssetsLoaded] = useState(false)

    const scene1Ref = useRef(null)
    const spacerRef = useRef(null)   // transparent scroll-spacer for logo animation
    const headlineRef = useRef(null)
    const subRef = useRef(null)
    const formRef = useRef(null)

    // Preload images before revealing page
    useEffect(() => {
        const urls = [comingSoon, person2, logoSvg]
        let loaded = 0
        urls.forEach((url) => {
            const img = new Image()
            img.onload = img.onerror = () => { if (++loaded >= urls.length) setAssetsLoaded(true) }
            img.src = url
        })
    }, [])

    useSmoothScroll() // Initialize smooth scrolling globally
    useScrollAnimation({ scene1Ref, headlineRef, subRef, formRef, enabled: assetsLoaded })

    if (!assetsLoaded) {
        return <div className="loading-screen"><span>Loading&hellip;</span></div>
    }

    return (
        <div id="page-wrapper">

            {/* Scene 1 — full hero */}
            <div
                ref={scene1Ref}
                id="scene1-wrapper"
                style={{
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    transformOrigin: 'center center'
                }}
            >
                <Scene1 />
            </div>

            {/*
        Transparent scroll spacer.
        Drives the 180vh scroll timeline. Starts at the very top of the document.
      */}
            <div ref={spacerRef} id="logo-spacer" style={{ height: '180vh', position: 'relative' }} />

            {/* Scene 2 — comes right after the spacer in normal flow */}
            <div id="scene2-wrapper" style={{ position: 'relative', zIndex: 15 }}>
                <Scene2 headlineRef={headlineRef} subRef={subRef} formRef={formRef} />
            </div>

            {/*
        Logo3D lives OUTSIDE the spacer and uses position:fixed.
        It sits above everything as a transparent canvas overlay.
        GSAP controls when it appears / disappears via the spacerRef trigger.
      */}
            <Logo3D spacerRef={spacerRef} />

        </div>
    )
}

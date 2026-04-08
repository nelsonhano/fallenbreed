import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    lenis.on('scroll', ScrollTrigger.update)

    // Sync Lenis with GSAP's ticker
    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(updateLenis)
    }
  }, [])
}

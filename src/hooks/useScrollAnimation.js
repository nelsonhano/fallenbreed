import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollAnimation
 *
 * Sets up GSAP ScrollTrigger animations scoped with gsap.context() so cleanup
 * only kills animations created here — never Logo3D's ScrollTrigger.
 *
 * Animations:
 *   1. Scene 1 exit  — subtle zoom-in + fade as it scrolls off viewport
 *   2. Scene 2 entrance — headline, sub, form slide up from below
 */
export function useScrollAnimation({ scene1Ref, headlineRef, subRef, formRef, enabled = true }) {
  useEffect(() => {
    if (!enabled) return

    // gsap.context() tracks every tween/ST created inside its callback.
    // ctx.revert() on cleanup tears down ONLY those — nothing else.
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
        },
        (context) => {
          const { isDesktop } = context.conditions

          // We use the 180vh #logo-spacer to drive the transition timeline.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: '#logo-spacer',
              start: 'top top',
              end: 'bottom top', // Finishes exactly when Scene 2 arrives at the top
              scrub: 1.2,
            }
          })

          // ── 1. Scene 1 exit: precision dolly zoom & seamless transition ───────────────────────
          if (scene1Ref?.current) {
            // Phase 1: Background expands and then fades
            tl.fromTo('#scene1-bg', { scale: 1.00 }, { scale: 1.03, ease: 'none', duration: 0.6 }, 0)
            tl.to(scene1Ref.current, { autoAlpha: 0, ease: 'power1.inOut', duration: 0.2 }, 0.4) // Hides everything & removes pointer events

            // Phase 2: Person scale down (subtle motion instead of massive zoom)
            tl.fromTo('#scene1-person', { scale: 0.90, transformOrigin: 'bottom center' }, { scale: 0.86, ease: 'none', duration: 0.6 }, 0)

            // Optional subtle zoom out on 2D logo since it was part of the original zoom array
            tl.fromTo('#scene1-logo', { scale: 1.00 }, { scale: 0.95, ease: 'none', duration: 0.6 }, 0)
          }

          // ── 2. Scene 2 content entrance ──────────────────────────────────
          // Transition Scene 2 into view perfectly synchronized with the scroll timeline (0.64 to 1.00)
          tl.fromTo(
            '#scene2-wrapper',
            { opacity: 0, scale: 1.16 },
            { opacity: 1, scale: 1.00, ease: 'power2.out', duration: 0.36 },
            0.64
          )

        }
      )
    })

    return () => ctx.revert()
  }, [scene1Ref, headlineRef, subRef, formRef, enabled])
}

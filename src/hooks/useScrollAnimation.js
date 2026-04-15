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
            // Dark vignette transition
            tl.fromTo('#scene1-vignette', { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.4 }, 0)

            // Phase 1: Background expands and then fades
            tl.fromTo('#scene1-bg', { scale: 1.00 }, { scale: 1.03, ease: 'none', duration: 0.6 }, 0)
            tl.to(scene1Ref.current, { autoAlpha: 0, ease: 'power1.inOut', duration: 0.2 }, 0.4) // Hides everything & removes pointer events

            // Phase 2: Person scale down (subtle motion instead of massive zoom)
            tl.fromTo('#scene1-person', { scale: 0.90, transformOrigin: 'bottom center' }, { scale: 0.86, ease: 'none', duration: 0.6 }, 0)

            // Optional subtle zoom out on 2D logo since it was part of the original zoom array
            tl.fromTo('#scene1-logo', { scale: 1.00 }, { scale: 0.95, ease: 'none', duration: 0.6 }, 0)
          }

          // ── 2. Scene 2 content entrance ──────────────────────────────────
          // Fade scene2 in quickly at 58-65% — NO scale so the email form
          // remains completely static while the 3D logo scales down above it.
          tl.fromTo(
            '#scene2-wrapper',
            { opacity: 0 },
            { opacity: 1, ease: 'power2.out', duration: 0.10 },
            0.58
          )

          // Headline slides up subtly
          if (headlineRef?.current) {
            tl.fromTo(
              headlineRef.current,
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, ease: 'power2.out', duration: 0.18 },
              0.62
            )
          }

          // Sub-heading slides up subtly
          if (subRef?.current) {
            tl.fromTo(
              subRef.current,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, ease: 'power2.out', duration: 0.16 },
              0.68
            )
          }

        }
      )
    })

    return () => ctx.revert()
  }, [scene1Ref, headlineRef, subRef, formRef, enabled])
}

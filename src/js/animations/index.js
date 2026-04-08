import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

export function initScrollAnimations(wrapper, content) {
  // Initialize ScrollSmoother
  ScrollSmoother.create({
    wrapper: wrapper || '#smooth-wrapper',
    content: content || '#smooth-content',
    smooth: 1.5,
    effects: true,
  })

  // Animate each panel as it enters the viewport
  const panels = gsap.utils.toArray('.js-panel')

  panels.forEach((panel) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
      },
    })

    tl.from(panel, {
      opacity: 0,
      y: 80,
      duration: 1,
    }).from(
      panel.querySelector('h2'),
      {
        opacity: 0,
        x: -40,
        duration: 0.8,
      },
      '-=0.4'
    )
  })

  // Pinned hero section
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: '+=400',
    pin: true,
    scrub: true,
  })
}

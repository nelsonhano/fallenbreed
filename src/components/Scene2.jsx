import { useRef, useState } from 'react'
import gsap from 'gsap'
import logoSvg from '../assets/Logo.svg'

export default function Scene2({ headlineRef, subRef, formRef }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const buttonRef = useRef(null)

  // Hover glow on the CTA button via GSAP
  function handleMouseEnter() {
    if (!buttonRef.current) return
    gsap.to(buttonRef.current, {
      boxShadow: '0 0 0 2px rgba(255,255,255,0.8), 0 0 28px 6px rgba(255,255,255,0.35)',
      scale: 1.02,
      duration: 0.28,
      ease: 'power2.out',
    })
  }

  function handleMouseLeave() {
    if (!buttonRef.current) return
    gsap.to(buttonRef.current, {
      boxShadow: '0 0 0 0px rgba(255,255,255,0)',
      scale: 1,
      duration: 0.28,
      ease: 'power2.in',
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '7vh',
        paddingBottom: '10vh',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      {/* Spotlight — radial cone from top center, mix-blend-mode screen */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(900px, 140vw)',
          height: '75vh',
          background:
            'radial-gradient(ellipse 55% 80% at 50% 0%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 2D Logo mark — sits at top of scene2 */}
      <div
        style={{
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 2,
          visibility: 'hidden',
        }}
      >
        <img
          src={logoSvg}
          alt="Fallen Breed"
          style={{
            width: 'clamp(160px, 22vw, 300px)',
            display: 'block',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.15))',
          }}
        />
      </div>

      {/* Headline */}
      <h1
        ref={headlineRef}
        style={{
          position: 'relative',
          zIndex: 2,
          fontSize: 'clamp(2.2rem, 7vw, 6rem)',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1.05,
          textAlign: 'center',
          background:
            'linear-gradient(90deg, #a9a9a9 0%, #ffffff 50%, #a9a9a9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.75rem',
        }}
      >
        The Fallen Has Risen
      </h1>

      {/* Sub-heading */}
      <p
        ref={subRef}
        style={{
          position: 'relative',
          zIndex: 2,
          fontSize: 'clamp(0.85rem, 2.4vw, 1.3rem)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          textAlign: 'center',
          background:
            'linear-gradient(90deg, #a9a9a9 0%, #ffffff 50%, #a9a9a9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '3rem',
        }}
      >
        Coming Soon — May 2026
      </p>

      {/* Email form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 'var(--max-form-width)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {submitted ? (
          <p
            style={{
              textAlign: 'center',
              letterSpacing: '0.18em',
              fontSize: '0.8rem',
              color: '#ccc',
              textTransform: 'uppercase',
              padding: '1rem 0',
            }}
          >
            You're on the list.
          </p>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '2px',
                padding: '0.85rem 1.1rem',
                color: '#fff',
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                outline: 'none',
                caretColor: '#fff',
              }}
            />

            <button
              ref={buttonRef}
              type="submit"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #d8d8d8 0%, #ffffff 50%, #d0d0d0 100%)',
                border: 'none',
                borderRadius: '2px',
                padding: '0.9rem 1rem',
                color: '#111',
                fontSize: '0.78rem',
                fontWeight: 900,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                willChange: 'transform, box-shadow',
              }}
            >
              Join the Waitlist
            </button>
          </>
        )}
      </form>
    </section>
  )
}

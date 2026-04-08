import comingSoon from '../assets/Coming soon.jpg'
import logoSvg from '../assets/Logo.svg'
import person2 from '../assets/Person2.png'

export default function Scene1() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      {/* Background image — covers full viewport */}
      <div
        id="scene1-bg"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${comingSoon})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          zIndex: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* Logo — centered, upper half, with soft glow halo */}
      <div
        id="scene1-logo"
        style={{
          position: 'absolute',
          top: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        {/* Glow blob behind logo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            paddingBottom: '60%',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(255,235,160,0.22) 0%, rgba(220,180,80,0.08) 50%, transparent 72%)',
            filter: 'blur(28px)',
            zIndex: -1,
          }}
        />
        <img
          src={logoSvg}
          alt="Fallen Breed"
          style={{
            display: 'block',
            width: 'clamp(220px, 38vw, 520px)',
            filter:
              'drop-shadow(0 0 24px rgba(255,240,180,0.55)) drop-shadow(0 0 56px rgba(200,170,80,0.25))',
          }}
        />
      </div>

      {/* Person — centered, 80vh tall, anchored to bottom */}
      <div
        id="scene1-person"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: '80vh',
          zIndex: 3,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          transformOrigin: 'bottom center',
          willChange: 'transform, opacity',
        }}
      >
        <img
          src={person2}
          alt=""
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            display: 'block',
          }}
        />
      </div>

      {/* Vignette overlay — dark edges on all sides */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%)
          `,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />
      {/* Extra gradient — stronger bottom and top fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(to bottom,
              rgba(0,0,0,0.35) 0%,
              transparent 15%,
              transparent 65%,
              rgba(0,0,0,0.65) 100%
            )
          `,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

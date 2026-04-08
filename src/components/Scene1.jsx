import comingSoon from '../assets/Coming soon.jpg'
import logoSvg from '../assets/Logo.svg'
import person2 from '../assets/Person2.png'
import downArrow from '../assets/Down arrow.svg'

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
          top: 'clamp(12%, 24vh - 6vw, 22%)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          textAlign: 'center',
          willChange: 'transform, opacity',
        }}
      >
        {/* Vignette glow removed */}
        <img
          src={logoSvg}
          alt="Fallen Breed"
          style={{
            display: 'block',
            width: 'clamp(270px, 38vw, 520px)',
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

      {/* Static Vignette removed */}

      {/* Down Arrows - Bouncing */}
      <div
        className="bounce-group"
        style={{
          position: 'absolute',
          bottom: '4vh',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1px',
        }}
      >
        <img
          src={downArrow}
          alt="Scroll Down"
          style={{
            width: 'clamp(24px, 4vw, 36px)',
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.4))',
            display: 'block',
          }}
        />
        <img
          src={downArrow}
          alt=""
          style={{
            width: 'clamp(24px, 4vw, 36px)',
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.4))',
            display: 'block',
          }}
        />
      </div>

      {/* Dark vignette transition overlay */}
      <div
        id="scene1-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,1) 90%)',
          zIndex: 7,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Extra gradient fade removed */}
    </div>
  )
}

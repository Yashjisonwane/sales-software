import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const words = ['Job', 'Worker', 'Lead', 'Contract'];

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentWord(prev => (prev + 1) % words.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 80,
      }}
    >
      {/* Real Map Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14724.205058627349!2d75.8650035!3d22.68913545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1773642840506!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(0.1) brightness(0.95)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        {/* Enhanced overlay for better legibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(1.7px)',
          WebkitBackdropFilter: 'blur(1.7px)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Decorative Purple Pins */}
      {[
        { top: '12%', left: '8%', size: 30 },
        { top: '18%', right: '6%', size: 26 },
        { top: '48%', left: '6%', size: 24 },
        { top: '55%', right: '3%', size: 28 },
        { top: '72%', left: '3%', size: 22 },
      ].map((pin, i) => (
        <svg
          key={i}
          width={pin.size}
          height={pin.size * 1.4}
          viewBox="0 0 24 34"
          fill="none"
          style={{
            position: 'absolute',
            top: pin.top,
            left: pin.left,
            right: pin.right,
            zIndex: 2,
            animation: `float ${5 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
            filter: 'drop-shadow(0 2px 4px rgba(124,58,237,0.3))',
          }}
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22s12-13 12-22C24 5.37 18.63 0 12 0z" fill="#7C3AED" />
          <circle cx="12" cy="11" r="4.5" fill="#a78bfa" />
        </svg>
      ))}

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        padding: '0 24px',
      }}>
        {/* Large Green Pin */}
        <img
          src="/pin.png"
          alt="Location Pin"
          style={{ height: 74, width: 'auto', marginBottom: 4 }}
        />

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(26px, 5vw, 42px)',
          fontWeight: 700,
          color: '#1a1a1a',
          lineHeight: 1.25,
          maxWidth: 800,
          margin: 0,
        }}>
          One Platform to Control Every{' '}
          <span
            style={{
              color: '#7C3AED',
              transition: 'opacity 0.4s ease',
              opacity: fade ? 1 : 0,
              display: 'inline-block',
              minWidth: 140,
              textAlign: 'left',
            }}
          >
            {words[currentWord]}
          </span>
        </h1>

        {/* CTA Button */}
        <Link
          to="/request-service"
          className="btn-black"
          style={{
            padding: '14px 44px',
            fontSize: 16,
            borderRadius: 12,
            marginTop: 4,
          }}
        >
          Request Service
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;

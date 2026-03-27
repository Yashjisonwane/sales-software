const VideoSection = () => {
  return (
    <section id="app-tutorial" style={{
      padding: '80px 24px',
      background: 'white',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Heading */}
        <h2 style={{
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.35,
          marginBottom: 64,
          color: '#1a1a1a',
        }}>
          See how service work gets smarter{' '}
          from request to completion
        </h2>

        {/* Desktop: Side-by-side, Mobile: Stacked */}
        <div className="video-content" style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
          
          {/* Text Left */}
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: 700,
              marginBottom: 16,
              color: '#1a1a1a',
            }}>
              Why We Built This Platform
            </h3>

            <p style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: '#6B7280',
              marginBottom: 16,
            }}>
              Managing service work shouldn't be chaotic. Leads get lost, jobs are
              delayed, and payments create confusion between admins, workers,
              and homeowners.
            </p>

            <p style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: '#6B7280',
              marginBottom: 24,
            }}>
              We built this platform to bring clarity, control, and transparency
              to every step—so jobs move faster, workers get paid fairly, and
              businesses scale with confidence.
            </p>

            <p style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#1a1a1a',
            }}>
              -Built for Service Businesses Worldwide
            </p>
          </div>

          {/* Video Thumbnail Right */}
          <div style={{
            flex: 1,
            position: 'relative',
            borderRadius: 12,
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop"
              alt="How service work gets smarter"
              style={{
                width: '100%',
                display: 'block',
                aspectRatio: '16/9',
                objectFit: 'cover',
              }}
            />
            {/* Play Button */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 56,
              height: 40,
              background: '#FF0000',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 1023px) {
          .video-content { flex-direction: column-reverse !important; }
        }
      `}</style>
    </section>
  );
};

export default VideoSection;

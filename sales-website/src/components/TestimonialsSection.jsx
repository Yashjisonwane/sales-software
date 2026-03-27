const testimonials = [
  {
    id: 1,
    title: 'From Lead to Job—Fast',
    subtitle: 'An urgent homeowner request matched and assigned in minutes.',
    description: 'A last-minute repair came in. The admin reviewed details, assigned the job instantly, and work started the same day.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Clear Contracts, Zero Confusion',
    subtitle: 'Rates, roles, and payments agreed before work begins.',
    description: 'By setting contracts upfront, everyone knew expectations—no disputes, no delays, just smooth execution.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'On-Time Work. On-Time Pay.',
    subtitle: 'Track progress, get notified, and get paid without follow-ups.',
    description: 'Workers stayed updated, admins stayed informed, and payments were released right on schedule.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" style={{
      padding: '80px 24px',
      background: '#F8F9FA', // Light gray background to make white cards pop
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Heading */}
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 60,
          color: '#1a1a1a',
        }}>
          Real Work. Real Results.
        </h2>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: 32,
        }}>
          {testimonials.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
              }}
            >
              {/* Image with inset padding effect */}
              <div style={{ height: 260, width: '100%', marginBottom: 28, borderRadius: 12, overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
              </div>

              {/* Content */}
              <div>
                <h3 style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#1a1a1a',
                  marginBottom: 12,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: 17,
                  color: '#374151',
                  marginBottom: 16,
                  lineHeight: 1.5,
                }}>
                  {item.subtitle}
                </p>
                <p style={{
                  fontSize: 15,
                  color: '#6B7280',
                  lineHeight: 1.6,
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

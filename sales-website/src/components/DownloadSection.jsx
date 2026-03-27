const DownloadSection = () => {
  return (
    <section style={{
      padding: '60px 24px 80px',
      background: '#FFFFFF',
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        {/* Heading */}
        <h2 style={{
          fontSize: 'clamp(24px, 4vw, 34px)',
          fontWeight: 700,
          marginBottom: 16,
          color: '#1a1a1a',
        }}>
          Download the App
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: 15,
          color: '#6B7280',
          lineHeight: 1.6,
          marginBottom: 32,
          maxWidth: 460,
          margin: '0 auto 32px',
        }}>
          Manage leads, assign jobs, track progress, and get
          paid—right from your pocket.
        </p>

        {/* App Store Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          {/* Google Play */}
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#1a1a1a',
              color: 'white',
              padding: '12px 28px',
              borderRadius: 10,
              textDecoration: 'none',
              transition: 'transform 0.3s, box-shadow 0.3s',
              minWidth: 160,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3.609 1.814L13.793 12 3.61 22.186a1.003 1.003 0 01-.387-.392L.447 13.16a2 2 0 010-2.32l2.775-8.634c.094-.16.227-.294.387-.392z" fill="#4285F4"/>
              <path d="M20.065 10.236l-3.757-2.14L13.793 12l2.515 3.904 3.757-2.14a2 2 0 000-3.528z" fill="#FBBC04"/>
              <path d="M3.609 1.814a.99.99 0 01.755.019l11.944 6.075-2.515 4.092L3.609 1.814z" fill="#34A853"/>
              <path d="M16.308 15.904L4.364 22.167a.99.99 0 01-.755.019L13.793 12l2.515 3.904z" fill="#EA4335"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 9, opacity: 0.8, fontWeight: 400 }}>GET IT ON</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: -2 }}>Google Play</div>
            </div>
          </a>

          {/* App Store */}
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#1a1a1a',
              color: 'white',
              padding: '12px 28px',
              borderRadius: 10,
              textDecoration: 'none',
              transition: 'transform 0.3s, box-shadow 0.3s',
              minWidth: 160,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="20" height="24" viewBox="0 0 20 24" fill="white">
              <path d="M16.52 12.65c-.03-3.08 2.52-4.56 2.63-4.63-1.43-2.09-3.66-2.38-4.46-2.41-1.9-.19-3.7 1.12-4.66 1.12-.96 0-2.44-1.09-4.01-1.06-2.07.03-3.97 1.2-5.03 3.05-2.14 3.72-.55 9.23 1.54 12.24 1.02 1.48 2.24 3.14 3.84 3.08 1.54-.06 2.12-1 3.98-1 1.86 0 2.38 1 4 .97 1.66-.03 2.7-1.5 3.72-2.99 1.17-1.72 1.65-3.38 1.68-3.47-.04-.01-3.23-1.24-3.26-4.9z"/>
              <path d="M13.56 3.37c.85-1.03 1.42-2.46 1.27-3.87-1.22.05-2.7.81-3.58 1.84-.78.91-1.47 2.37-1.28 3.77 1.36.11 2.75-.69 3.59-1.74z"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 9, opacity: 0.8, fontWeight: 400 }}>Download on the</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: -2 }}>App Store</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileEdit, 
  FileText, 
  Calendar, 
  ClipboardList, 
  ChevronRight, 
  CheckCircle,
  X 
} from 'lucide-react';
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user", err);
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#FFFFFF',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
          transition: 'all 0.3s ease',
          padding: scrolled ? '12px 24px' : '18px 24px',
        }}
      >
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src="/logo.png" 
              alt="HINESQ Logo" 
              style={{ height: 45, width: 'auto', objectFit: 'contain' }} 
            />
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <div className="desktop-menu" style={{ 
            display: 'none', 
            gap: 32,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#111827', fontSize: 14, fontWeight: 700 }}>Home</Link>
            <Link to="/about-us" style={{ textDecoration: 'none', color: '#111827', fontSize: 14, fontWeight: 700 }}>About Us</Link>
            <Link to="/privacy-policy" style={{ textDecoration: 'none', color: '#111827', fontSize: 14, fontWeight: 700 }}>Privacy Policy</Link>
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Language Selector */}
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              border: '1px solid #D1D5DB',
              borderRadius: 12,
              background: '#FFFFFF',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: '#374151',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/us.svg" 
                  alt="US Flag" 
                  style={{ width: 18, height: 13.5, borderRadius: 2 }} 
                />
              </span>
              <span>English</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginTop: 1 }}>
                <path d="M3 5L6 8L9 5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Hamburger Button */}
            <button 
              onClick={() => setMenuOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                padding: '8px 0 8px 8px'
              }}
            >
              <span style={{ width: 22, height: 2, background: '#111827', borderRadius: 2 }}></span>
              <span style={{ width: 22, height: 2, background: '#111827', borderRadius: 2 }}></span>
              <span style={{ width: 22, height: 2, background: '#111827', borderRadius: 2 }}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {menuOpen && (
        <div 
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            animation: 'fadeIn 0.3s ease'
          }}
        />
      )}

      {/* Sidebar Content */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '85%',
          maxWidth: 360,
          background: 'white',
          zIndex: 2100,
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 }}>Menu</h2>
          <button onClick={() => setMenuOpen(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link 
            to="/request-service" 
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '24px',
              background: '#F9FAFB',
              borderRadius: 20,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transition: 'background 0.2s'
            }}
          >
            <div style={{ width: 48, height: 48, background: '#7C3AED', color: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Request Service</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Get connected with top services</div>
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (min-width: 1024px) {
          .desktop-menu {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;

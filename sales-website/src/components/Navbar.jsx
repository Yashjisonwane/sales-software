import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileEdit, 
  FileText, 
  Calendar, 
  ClipboardList, 
  ChevronRight, 
  CheckCircle,
  CreditCard,
  Briefcase,
  X 
} from 'lucide-react';
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const langRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user", err);
      }
    }

    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
            <a href="/#pricing" onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }
            }} style={{ textDecoration: 'none', color: '#111827', fontSize: 14, fontWeight: 700 }}>Pricing</a>
            <Link to="/privacy-policy" style={{ textDecoration: 'none', color: '#111827', fontSize: 14, fontWeight: 700 }}>Privacy Policy</Link>
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Join as Professional Button (Desktop) */}
            {/* Join as Professional Button (Desktop) */}
            {/* <div className="desktop-menu" style={{ display: 'none' }}>
              <Link to="/become-professional" className="nav-cta-button" style={{
                textDecoration: 'none',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                color: 'white',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Briefcase size={16} />
                Join as a Professional
              </Link>
            </div> */}

            {/* Language Selector */}
            <div style={{ position: 'relative' }} ref={langRef}>
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                style={{
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
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/us.svg" 
                    alt="US Flag" 
                    style={{ width: 18, height: 13.5, borderRadius: 2 }} 
                  />
                </span>
                <span>English</span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ 
                  marginTop: 1,
                  transform: langMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}>
                  <path d="M3 5L6 8L9 5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {langMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '160px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '8px',
                  zIndex: 2200,
                  border: '1px solid #E5E7EB',
                  animation: 'slideIn 0.2s ease'
                }}>
                  <div 
                    onClick={() => setLangMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: '#F9FAFB',
                      color: '#111827',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    <img 
                      src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/us.svg" 
                      alt="US Flag" 
                      style={{ width: 18, height: 13.5, borderRadius: 2 }} 
                    />
                    English
                  </div>
                </div>
              )}
            </div>

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

          <a 
            href="/#pricing" 
            onClick={(e) => {
              setMenuOpen(false);
              if (window.location.pathname === '/') {
                e.preventDefault();
                setTimeout(() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              }
            }}
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
            <div style={{ width: 48, height: 48, background: '#111827', color: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Our Pricing</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Choose a plan that fits you</div>
            </div>
          </a>

          {/* <Link 
            to="/become-professional" 
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
              <Briefcase size={24} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#7C3AED' }}>Join as Professional</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Grow your business with us</div>
            </div>
          </Link> */}

          {/* Mobile Language Selector */}
          <div style={{
            padding: '24px',
            background: '#F9FAFB',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background 0.2s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/us.svg" 
                  alt="US Flag" 
                  style={{ width: 24, height: 18, borderRadius: 2 }} 
                />
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>English</div>
            </div>
            <div style={{ color: '#6B7280', fontSize: 13, fontWeight: 600 }}>Active</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (min-width: 1024px) {
          .desktop-menu {
            display: flex !important;
          }
        }
        .nav-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
          filter: brightness(1.1);
        }
        .nav-cta-button:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  );
};

export default Navbar;

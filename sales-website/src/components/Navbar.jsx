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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const toolItems = [
    {
      id: 1,
      name: 'Schedule Job',
      title: "Schedule Job",
      description: "Schedule jobs to your calendar in seconds.",
      icon: <Calendar size={24} strokeWidth={1.5} />,
    },
    {
      id: 2,
      name: 'Documentation',
      title: "Documentation",
      description: "Capture and document every job with ease.",
      icon: <FileText size={24} strokeWidth={1.5} />,
    },
    {
      id: 3,
      name: 'Inspection',
      title: "Inspection",
      description: "Create and complete inspection reports.",
      icon: <ClipboardList size={24} strokeWidth={1.5} />,
    },
    {
      id: 4,
      name: 'Estimate',
      title: "Estimate",
      description: "Create and send professional estimates.",
      icon: <FileEdit size={24} strokeWidth={1.5} />,
    },
    {
      id: 5,
      name: 'Invoice',
      title: "Invoice",
      description: "Send, track and collect invoices.",
      icon: <FileText size={24} strokeWidth={1.5} />,
    },
    {
      id: 6,
      name: 'Done',
      title: "Done",
      description: "Finalize and complete the job request.",
      icon: <CheckCircle size={24} strokeWidth={1.5} />,
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src="/logo.png" 
              alt="HINESQ Logo" 
              style={{ height: 45, width: 'auto', objectFit: 'contain' }} 
            />
          </Link>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Language Selector */}
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: 6,
              background: '#FFFFFF',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
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

            {/* Try Now Button - desktop only */}
            <a href="#" style={{
              padding: '8px 20px',
              fontSize: 14,
              fontWeight: 600,
              display: 'none',
              background: '#18181B',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 6,
              transition: 'background 0.2s',
            }}
            id="navbar-try-now"
            onMouseEnter={e => e.target.style.background = '#27272A'}
            onMouseLeave={e => e.target.style.background = '#18181B'}
            >
              Try Now
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0 4px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
              aria-label="Open menu"
            >
              <span style={{ display: 'block', width: 22, height: 2, background: '#1a1a1a', borderRadius: 2 }}></span>
              <span style={{ display: 'block', width: 22, height: 2, background: '#1a1a1a', borderRadius: 2 }}></span>
              <span style={{ display: 'block', width: 22, height: 2, background: '#1a1a1a', borderRadius: 2 }}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            backgroundColor: 'rgba(0,0,0,0.4)',
            transition: 'opacity 0.3s',
          }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-in Menu (Job Tools) */}
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '90%',
          maxWidth: 400,
          backgroundColor: '#F9FAFB',
          zIndex: 2100,
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: menuOpen ? '-10px 0 40px rgba(0,0,0,0.15)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 20px',
          backgroundColor: 'white',
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Job Tools</h2>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: '#F3F4F6',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1a1a1a',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'}
            onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '12px 20px 40px' 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: 16, 
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            {toolItems.map((item, index) => (
              <Link
                key={index}
                to={`/job-details?step=${item.id}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '24px 20px',
                  textDecoration: 'none',
                  borderBottom: index === toolItems.length - 1 ? 'none' : '1px solid #F3F4F6',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                {/* Left Icon */}
                <div style={{
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111827',
                  marginRight: 16,
                }}>
                  {item.icon}
                </div>

                {/* Middle Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: 17, 
                    fontWeight: 600, 
                    color: '#111827', 
                    marginBottom: 4,
                    lineHeight: 1.2
                  }}>
                    {item.title}
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    color: '#6B7280', 
                    lineHeight: 1.4,
                    fontWeight: 400
                  }}>
                    {item.description}
                  </div>
                </div>

                {/* Right Arrow */}
                <div style={{ marginLeft: 12, color: '#9CA3AF' }}>
                  <ChevronRight size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Try Now button visibility (CSS) */}
      <style>{`
        @media (min-width: 768px) {
          #navbar-try-now {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;

import { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer style={{
      background: '#F8F9FA',
      padding: '80px 24px 40px',
      borderTop: '1px solid #E5E7EB',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Main Footer Content */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 60,
          justifyContent: 'space-between',
        }}>
          
          {/* Left Side: Logo and Links */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: 48 }}>
            
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo.png" 
                alt="HINESQ Logo" 
                style={{ height: 40, width: 'auto', objectFit: 'contain' }} 
              />
            </div>

            {/* Links Columns */}
            <div style={{
              display: 'flex',
              gap: 60,
              flexWrap: 'wrap',
            }}>
              {/* Company */}
              <div style={{ minWidth: 120 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 20 }}>
                  Company
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {['About', 'Careers'].map((item, i) => (
                    <a key={i} href="#" style={{ fontSize: 14, color: '#4B5563', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#1a1a1a'}
                      onMouseLeave={e => e.target.style.color = '#4B5563'}
                    >
                      {item}
                    </a>
                  ))}
                  <Link to="/become-professional" style={{ fontSize: 14, color: '#7C3AED', fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.target.style.opacity = '0.7'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    Join as Professional
                  </Link>
                </div>
              </div>

              {/* Legal */}
              <div style={{ minWidth: 120 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 20 }}>
                  Legal
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {['Terms & Conditions', 'Privacy Policy'].map((item, i) => (
                    <a key={i} href="#" style={{ fontSize: 14, color: '#4B5563', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#1a1a1a'}
                      onMouseLeave={e => e.target.style.color = '#4B5563'}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div style={{ minWidth: 120 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 20 }}>
                  Support
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {['Help Center', 'Contact Us'].map((item, i) => (
                    <a key={i} href="#" style={{ fontSize: 14, color: '#4B5563', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#1a1a1a'}
                      onMouseLeave={e => e.target.style.color = '#4B5563'}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Newsletter */}
          <div style={{ flex: '1 1 350px', maxWidth: 450 }}>
            <h3 style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#1a1a1a',
              marginBottom: 16,
            }}>
              Subscribe to Our News
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: 30,
                  border: '1px solid transparent',
                  background: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  fontSize: 14,
                  color: '#374151',
                  outline: 'none',
                  transition: 'all 0.3s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'transparent';
                  e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              />
              <button
                style={{
                  alignSelf: 'flex-start',
                  padding: '14px 32px',
                  borderRadius: 30,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'white',
                  background: '#0e5ef5',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.target.style.background = '#0a49c4'}
                onMouseLeave={e => e.target.style.background = '#0e5ef5'}
              >
                Subscribe Now
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div style={{
          marginTop: 80,
          borderTop: 'none',
          fontSize: 12,
          color: '#8A94A6',
        }}>
          Copyright 2025, All Rights Reserved by HINESQ
        </div>
      </div>
    </footer>
  );
};

export default Footer;

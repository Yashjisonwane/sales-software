import { useState, useEffect, useCallback } from 'react';
import { Navigation, Phone, Bookmark, Share2, ChevronRight } from 'lucide-react';

/* ─── SVG City Map Background ─── */
const MapBackground = () => (
  <svg viewBox="0 0 320 480" xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
    {/* Base */}
    <rect width="320" height="480" fill="#f0f4f8" />

    {/* City Blocks */}
    <rect x="0" y="0" width="70" height="60" fill="#e2e8f0" rx="2" />
    <rect x="75" y="0" width="55" height="45" fill="#e2e8f0" rx="2" />
    <rect x="135" y="0" width="80" height="55" fill="#e2e8f0" rx="2" />
    <rect x="220" y="0" width="100" height="50" fill="#e2e8f0" rx="2" />
    <rect x="0" y="65" width="50" height="75" fill="#e2e8f0" rx="2" />
    <rect x="55" y="50" width="75" height="90" fill="#e2e8f0" rx="2" />
    <rect x="135" y="60" width="55" height="70" fill="#e2e8f0" rx="2" />
    <rect x="195" y="55" width="125" height="80" fill="#e2e8f0" rx="2" />
    <rect x="0" y="145" width="90" height="65" fill="#e2e8f0" rx="2" />
    <rect x="95" y="145" width="60" height="65" fill="#e2e8f0" rx="2" />
    <rect x="160" y="140" width="75" height="75" fill="#e2e8f0" rx="2" />
    <rect x="240" y="140" width="80" height="70" fill="#e2e8f0" rx="2" />
    <rect x="0" y="215" width="65" height="80" fill="#e2e8f0" rx="2" />
    <rect x="70" y="215" width="85" height="85" fill="#e2e8f0" rx="2" />
    <rect x="160" y="220" width="70" height="75" fill="#e2e8f0" rx="2" />
    <rect x="235" y="215" width="85" height="90" fill="#e2e8f0" rx="2" />
    <rect x="0" y="300" width="80" height="70" fill="#e2e8f0" rx="2" />
    <rect x="85" y="305" width="65" height="65" fill="#e2e8f0" rx="2" />
    <rect x="155" y="300" width="80" height="70" fill="#e2e8f0" rx="2" />
    <rect x="240" y="310" width="80" height="55" fill="#e2e8f0" rx="2" />
    <rect x="0" y="375" width="100" height="105" fill="#e2e8f0" rx="2" />
    <rect x="105" y="380" width="70" height="100" fill="#e2e8f0" rx="2" />
    <rect x="180" y="375" width="140" height="105" fill="#e2e8f0" rx="2" />

    {/* Park / Green Area */}
    <rect x="55" y="50" width="75" height="90" fill="#dcfce7" rx="3" opacity="0.8" />

    {/* Water */}
    <ellipse cx="280" cy="390" rx="45" ry="28" fill="#dbeafe" opacity="0.8" />

    {/* Yellow road highlight */}
    <line x1="130" y1="480" x2="320" y2="240" stroke="#fef08a" strokeWidth="6" opacity="0.6" />
    <line x1="0" y1="120" x2="130" y2="0" stroke="#fef08a" strokeWidth="7" opacity="0.6" />
  </svg>
);

const slides = [
  {
    id: 1,
    heading: 'Turn Nearby Requests into\nReal Opportunities',
    featureTitle: 'Smart Job Discovery',
    featureDescription: 'View verified service requests on an interactive map and\nlist, filtered by location, category, and urgency.',
    bullets: [
      'Available Jobs Nearby',
      'Rich Job Details',
      'One-Tap Action'
    ],
    professionalImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80', // Professional worker
    mockupType: 'map',
  },
  {
    id: 2,
    heading: 'Create quotes, sell leads, or assign\njobs your business, your rules.',
    featureTitle: 'Smart Quote Creation',
    featureDescription: 'Build accurate quotes and turn leads into confirmed\njobs.',
    bullets: [
      'Guided Measurements & Scope',
      'Transparent Pricing Breakdown',
      'Instant Approval & Signature'
    ],
    professionalImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80', // Professional meeting
    mockupType: 'scope',
  },
  {
    id: 3,
    heading: 'Manage Execution from Start to\nFinish',
    featureTitle: 'Contract Overview',
    featureDescription: 'Review terms, payment splits, conditions and\naccept to move forward ..',
    bullets: [
      'Task Assignment & Tracking',
      'Proof of Work & Compliance',
      'Seamless Job Closure'
    ],
    professionalImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80', // Handshake
    mockupType: 'contract',
  },
  {
    id: 4,
    heading: 'Assign Job , Notifications & Payments\nTrack Jobs from Start to Finish',
    featureTitle: 'Smart Job Assignment',
    featureDescription: 'Automated and manual job assignments with\nreal-time notifications',
    bullets: [
      'Real-Time Job Status',
      'Instant Notifications',
      'Easy Rescheduling'
    ],
    professionalImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', // Working on laptop / tools
    mockupType: 'assign',
  },
];

/* ─── Phone Mockup Component ─── */
const PhoneMockup = ({ type, size = 'large' }) => {
  const w = size === 'large' ? 280 : 220;

  const mockups = {
    map: (
      <div style={{ background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Status bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', fontSize: 12, fontWeight: 600 }}>
          <span>9:42</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="4" width="3" height="8" rx="1" fill="#1a1a1a" /><rect x="4" y="2" width="3" height="10" rx="1" fill="#1a1a1a" /><rect x="8" y="0" width="3" height="12" rx="1" fill="#1a1a1a" /><rect x="12" y="3" width="3" height="9" rx="1" fill="#d1d5db" /></svg>
            <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2C5.5 2 3.3 3 1.8 4.6L0 2.8C2 0.8 4.8 0 8 0s6 .8 8 2.8l-1.8 1.8C12.7 3 10.5 2 8 2z" fill="#1a1a1a" /><path d="M8 6C6.5 6 5.2 6.5 4.2 7.4L2.4 5.6C3.9 4.2 5.8 3.4 8 3.4s4.1.8 5.6 2.2l-1.8 1.8C10.8 6.5 9.5 6 8 6z" fill="#1a1a1a" /><circle cx="8" cy="10" r="2" fill="#1a1a1a" /></svg>
            <svg width="22" height="12" viewBox="0 0 22 12"><rect x="0" y="1" width="18" height="10" rx="2" stroke="#1a1a1a" strokeWidth="1.5" fill="none" /><rect x="2" y="3" width="14" height="6" rx="1" fill="#1a1a1a" /><rect x="19" y="4" width="3" height="4" rx="1" fill="#1a1a1a" /></svg>
          </div>
        </div>
        {/* Search bar */}
        <div style={{ margin: '4px 12px 10px', display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 24, padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px #f3f4f6' }}>
          <span style={{ fontSize: 16 }}>📍</span>
          <span style={{ color: '#9ca3af', fontSize: 13, flex: 1 }}>Search here</span>
          <span style={{ fontSize: 14 }}>🎤</span>
          <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="user" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        {/* Map area */}
        <div style={{ flex: 1, position: 'relative', background: '#f0f4f8', overflow: 'hidden' }}>
          <MapBackground />

          {/* Temperature badge */}
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'white', borderRadius: 12, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: 12 }}>☁️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 10 }}>30°C</div>
              <div style={{ color: '#9ca3af', fontSize: 7 }}>CA, USA</div>
            </div>
          </div>

          {/* Map pins */}
          <div style={{ position: 'absolute', top: '30%', left: '40%', fontSize: 20 }}>📍</div>
          <div style={{ position: 'absolute', top: '50%', left: '60%', fontSize: 20 }}>📍</div>
          <div style={{ position: 'absolute', top: '40%', left: '20%', fontSize: 20 }}>📍</div>
          <div style={{ position: 'absolute', top: '70%', left: '70%', fontSize: 20 }}>📍</div>
          <div style={{ position: 'absolute', top: '80%', left: '30%', fontSize: 20 }}>📍</div>

          {/* Circular icon buttons right side */}
          <div style={{ position: 'absolute', bottom: 60, right: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <span style={{ color: '#2563EB', fontSize: 14 }}>➤</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0F766E', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ width: 12, height: 12, background: 'white', transform: 'rotate(45deg)' }}></div>
            </div>
          </div>

          {/* Status pills floating on map */}
          <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            <span style={{ background: '#F59E0B', color: 'white', fontSize: 9, padding: '4px 8px', borderRadius: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>In Progress</span>
            <span style={{ background: '#7C3AED', color: 'white', fontSize: 9, padding: '4px 8px', borderRadius: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>Upcomming</span>
            <span style={{ background: '#10B981', color: 'white', fontSize: 9, padding: '4px 8px', borderRadius: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>Completed</span>
            <span style={{ background: '#EF4444', color: 'white', fontSize: 9, padding: '4px 8px', borderRadius: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>Can...</span>
          </div>
        </div>

        {/* Bottom sheet area */}
        <div style={{ background: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, marginTop: -16, zIndex: 10, position: 'relative', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ width: 36, height: 4, background: '#E5E7EB', borderRadius: 2, margin: '8px auto' }} />

          {/* Tab bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px 8px' }}>
            {['Overview', 'Jobs', 'Schedule', 'Invoice', 'Quote'].map((tab, i) => (
              <span key={i} style={{ fontSize: 9, color: i === 0 ? '#2563EB' : '#6B7280', fontWeight: i === 0 ? 600 : 500, borderBottom: i === 0 ? '2px solid #2563EB' : 'none', paddingBottom: 4 }}>{tab}</span>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, padding: '4px 16px 12px' }}>
            {['All', 'Weekly', 'Monthly', 'Yearly'].map((f, i) => (
              <div key={i} style={{ padding: '4px 12px', borderRadius: 12, fontSize: 9, fontWeight: i === 0 ? 600 : 500, background: i === 0 ? '#1a1a1a' : 'white', color: i === 0 ? 'white' : '#6B7280', border: i === 0 ? '1px solid #1a1a1a' : '1px solid #E5E7EB' }}>
                {f}
              </div>
            ))}
          </div>

          {/* Bottom Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '1px solid #F3F4F6' }}>
            {[
              { icon: '📍', label: 'Explore', active: true },
              { icon: '💬', label: 'Inbox', active: false },
              { icon: '👤', label: 'Account', active: false },
            ].map((tab, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: tab.active ? '#EFF6FF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                  {tab.icon}
                </div>
                <span style={{ fontSize: 9, color: tab.active ? '#2563EB' : '#9CA3AF', fontWeight: tab.active ? 600 : 500 }}>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    scope: (
      <div style={{ background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Status bar (Still fixed at top) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', fontSize: 12, fontWeight: 600, background: '#fff', zIndex: 20 }}>
          <span>9:42</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <span style={{ fontSize: 10 }}>📶 📡 🔋</span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }}>
          {/* Profile Header */}
          <div style={{ padding: '4px 16px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>Alistair Hughes</h3>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>$43 <span style={{ fontSize: 9, fontWeight: 400, color: '#6B7280' }}>per hour</span></div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#6B7280', marginBottom: 4 }}>123 E Market St Boulder, CO 80304,USA</div>
            <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 500 }}>4.5 mi  •  12 m</div>
          </div>

          {/* Actions Row */}
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px' }}>
            <button style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#2563EB', color: 'white', border: 'none', borderRadius: 20, padding: '8px 4px', fontSize: 10, fontWeight: 600 }}>
              <Navigation size={12} fill="white" /> Directions
            </button>
            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: 20, padding: '8px 4px', fontSize: 10, fontWeight: 600 }}>
              <Phone size={12} fill="#2563EB" /> Call
            </button>
            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: 'white', border: '1px solid #E5E7EB', color: '#6B7280', borderRadius: 20, padding: '8px 4px', fontSize: 10, fontWeight: 600 }}>
              <Bookmark size={12} /> Save
            </button>
            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: 'white', border: '1px solid #E5E7EB', color: '#6B7280', borderRadius: 20, padding: '8px 4px', fontSize: 10, fontWeight: 600 }}>
              <Share2 size={12} /> Share
            </button>
          </div>

          {/* Photos Grid */}
          <div style={{ padding: '0 16px 16px', display: 'flex', gap: 4, height: 200 }}>
            <div style={{ flex: 2, position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=400&q=80" alt="flooring" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 8, padding: '2px 6px', borderRadius: 4 }}>2 days ago</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ flex: 1, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=200&q=80" alt="work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 7, padding: '2px 4px', borderRadius: 3 }}>2 days ago</span>
              </div>
              <div style={{ flex: 1, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&q=80" alt="construction" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 7, padding: '2px 4px', borderRadius: 3 }}>2 days ago</span>
              </div>
            </div>
          </div>

          {/* Details Content Overlay (Mimicking the list) */}
          <div style={{ background: '#fff', borderTop: '1px solid #F3F4F6', padding: '12px 16px 0' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', marginBottom: 12, paddingBottom: 4 }}>
              {['Job Details', 'Description', 'Photos', 'Updates'].map((tab, i) => (
                <span key={i} style={{ fontSize: 10, color: i === 0 ? '#2563EB' : '#6B7280', fontWeight: i === 0 ? 700 : 500, borderBottom: i === 0 ? '2px solid #2563EB' : 'none', paddingBottom: 4 }}>{tab}</span>
              ))}
            </div>

            {/* Table-like List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Quote', value: '$1,850.00' },
                { label: 'Contract', value: 'Signed, 2 Milestones' },
                { label: 'Payment', value: 'Deposit Paid ($300)' },
                { label: 'Work Time', value: '2 hrs 15 min' },
                { label: 'Notes', value: '5 Recent Notes' },
                { label: 'Progress Photos', value: '8/12 Uploaded' },
                { label: 'Urgency', value: 'High' },
                { label: 'Category', value: 'Flooring' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                  <span style={{ color: '#6B7280' }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 16px 36px',
          background: 'linear-gradient(to top, white 85%, transparent)',
          zIndex: 30
        }}>
          <button style={{ width: '100%', background: '#2563EB', color: 'white', border: 'none', borderRadius: 24, padding: '14px', fontSize: 12, fontWeight: 700, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)' }}>
            Create Quote
          </button>
        </div>
      </div>
    ),

    contract: (
      <div style={{ background: '#f8fafc', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', fontSize: 12, fontWeight: 600, background: '#fff' }}>
          <span>9:42</span>
          <span style={{ fontSize: 10 }}>📶 📡 🔋</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
          <span style={{ fontSize: 16 }}>&lt;</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Review Contract Details</span>
        </div>

        <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          {/* Title */}
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>E-Contract Setup</div>
          <div style={{ fontSize: 10, color: '#6B7280', marginBottom: 16 }}>Review terms and set up the payment split.</div>

          {/* Final Price section */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>Final Price</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>$1,896.15</span>
          </div>

          {/* Payment Schedule */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>Payment Schedule</div>

            {[
              { label: 'Deposit Due (15%)', value: '$284.42' },
              { label: 'Milestone 1 (50%)', value: '$948.08' },
              { label: 'Final Payment (35%)', value: '$663.65' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: i < 2 ? 12 : 0, marginBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? '1px solid #F3F4F6' : 'none', fontSize: 10 }}>
                <span style={{ color: '#6B7280' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Contract Preview */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 12, border: '1px solid #E5E7EB', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>Contract Preview</div>
            <p style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.5, marginBottom: 8 }}>
              [Mock Legal Text] All work is subject to standard terms and conditions. The customer agrees to the payment schedule outlined above. Signature...
            </p>
            <span style={{ fontSize: 9, color: '#7C3AED', fontWeight: 600 }}>View Full PDF</span>
          </div>

          {/* Checkbox */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: '#2563EB' }} />
            <span style={{ fontSize: 9, color: '#4B5563', lineHeight: 1.4 }}>
              By continuing, you accept our Terms & Conditions and Privacy Policy.
            </span>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div style={{ background: '#fff', padding: '16px', display: 'flex', gap: 12, borderTop: '1px solid #E5E7EB' }}>
          <button style={{ flex: 1, padding: '12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: 24, fontSize: 11, fontWeight: 600 }}>
            ✕ Decline
          </button>
          <button style={{ flex: 1, padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: 24, fontSize: 11, fontWeight: 600 }}>
            ✓ Accept
          </button>
        </div>
      </div>
    ),

    assign: (
      <div style={{ background: '#f8fafc', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', fontSize: 12, fontWeight: 600, background: '#fff' }}>
          <span>9:42</span>
          <span style={{ fontSize: 10 }}>📶 📡 🔋</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
          <span style={{ fontSize: 16 }}>&lt;</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Assign Job</span>
        </div>

        <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>

          {/* Assignment Method */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Assignment Method</div>
            <div style={{ fontSize: 9, color: '#6B7280', marginBottom: 16 }}>Choose how you want to assign this job to a worker.</div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #D1D5DB', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>Automatic Assign</div>
                  <div style={{ fontSize: 9, color: '#6B7280', marginTop: 4, lineHeight: 1.4 }}>
                    The system will assign this job to the best available worker based on location, availability, and skill match.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '4px solid #2563EB', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>Manual Assign</div>
                  <div style={{ fontSize: 9, color: '#6B7280', marginTop: 4, lineHeight: 1.4 }}>
                    Select a specific worker from the list based on your preference.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expiration Timer Box */}
          <div style={{ background: '#fff', padding: '16px', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>Enable Job Expiration Timer</div>
              {/* Toggle Switch */}
              <div style={{ width: 32, height: 18, background: '#2563EB', borderRadius: 9, position: 'relative' }}>
                <div style={{ width: 14, height: 14, background: 'white', borderRadius: '50%', position: 'absolute', right: 2, top: 2 }} />
              </div>
            </div>
            <div style={{ fontSize: 9, color: '#6B7280', marginBottom: 16 }}>Job expires if worker doesn't respond in time</div>

            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', marginBottom: 12 }}>Set Expiration Time</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {['1 hour', '3 hours', '6 hours', '9 hours', '12 hours', '24 hours'].map((t, i) => (
                <div key={i} style={{ padding: '6px 14px', borderRadius: 16, fontSize: 9, fontWeight: i === 0 ? 600 : 500, background: i === 0 ? '#EFF6FF' : '#F9FAFB', color: i === 0 ? '#2563EB' : '#6B7280', border: i !== 0 ? '1px solid #E5E7EB' : '1px solid transparent' }}>
                  {t}
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', marginBottom: 8, marginTop: 16 }}>Choose Specific Time</div>
            <div style={{ padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 10, color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
              <span>Select Time</span>
              <span style={{ color: '#1a1a1a' }}>🕒</span>
            </div>

            <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: 8, marginTop: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#2563EB', fontSize: 12 }}>ℹ️</span>
              <span style={{ fontSize: 8, color: '#1D4ED8', lineHeight: 1.4 }}>If the job expires, it will automatically move to the next available worker or return to unassigned.</span>
            </div>
          </div>

        </div>

        {/* Bottom Button */}
        <div style={{ background: '#fff', padding: '16px', borderTop: '1px solid #E5E7EB' }}>
          <button style={{ width: '100%', background: '#2563EB', color: 'white', border: 'none', borderRadius: 24, padding: '12px', fontSize: 11, fontWeight: 600 }}>
            Assign Job
          </button>
        </div>
      </div>
    ),
  };

  return (
    <div style={{
      width: w,
      background: 'white',
      borderRadius: 32,
      boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
      border: '6px solid #e5e7eb',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 80,
        height: 24,
        background: '#1a1a1a',
        borderRadius: '0 0 16px 16px',
        zIndex: 5,
      }} />
      <div style={{ height: size === 'large' ? 560 : 440, overflow: 'hidden', position: 'relative' }}>
        {mockups[type]}
      </div>
      {/* Home indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0', background: '#fff' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: '#d1d5db' }} />
      </div>
    </div>
  );
};

/* ─── Feature Carousel ─── */
const FeatureCarousel = () => {
  return (
    <section id="features" style={{ padding: '0 0 40px', overflow: 'hidden' }}>

      {/* ─── DESKTOP LAYOUT (Stacked Vertically, Alternating Text/Image sides) ─── */}
      <div className="feature-desktop" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px', display: 'flex', flexDirection: 'column', gap: 160 }}>
        {slides.map((slide, index) => {
          const isImageLeft = index % 2 !== 0;

          return (
            <div key={slide.id} style={{ display: 'flex', flexDirection: isImageLeft ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', gap: 100 }}>

              {/* Text Frame */}
              <div style={{ flex: 1, maxWidth: 450 }}>
                <h2 style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.3, color: '#1a1a1a', marginBottom: 40, whiteSpace: 'pre-line' }}>
                  {slide.heading}
                </h2>

                {/* Desktop View: Only show bullets, hide Title/Desc */}
                {slide.bullets && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {slide.bullets.map((bullet, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 18, fontWeight: 600, color: '#374151' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D1D5DB' }} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Image + Mockup Area */}
              {/* The phone mockup is absolutely positioned overlapping the edge closest to the text */}
              <div style={{ position: 'relative', width: 550, height: 500, display: 'flex', alignItems: 'center', justifyContent: isImageLeft ? 'flex-start' : 'flex-end' }}>

                <div style={{ position: 'absolute', [isImageLeft ? 'right' : 'left']: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                  <PhoneMockup type={slide.mockupType} size="large" />
                </div>

                <div style={{ width: 400, height: 460, overflow: 'hidden' }}>
                  <img src={slide.professionalImage} alt={slide.featureTitle || 'Feature Image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* ─── MOBILE LAYOUT (Stacked Vertically "ek ke niche ek") ─── */}
      <div className="feature-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        {slides.map((slide, index) => (
          <div key={slide.id} className="feature-item-mobile" style={{ width: '100%' }}>

            {/* Top professional image */}
            <div style={{ width: '100%', overflow: 'hidden', height: 260, position: 'relative' }}>
              <img
                src={slide.professionalImage}
                alt={slide.featureTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Subtle gradient overlay to match Figma's soft look */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(255,255,255,0.8) 0%, transparent 100%)' }} />
            </div>

            {/* Phone Mockup - overlapping the image */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: -90, position: 'relative', zIndex: 10 }}>
              <PhoneMockup type={slide.mockupType} size="large" />
            </div>

            {/* Text Content Area */}
            <div style={{ padding: '36px 24px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.35,
                marginBottom: 24,
                color: '#1a1a1a',
                whiteSpace: 'pre-line',
              }}>
                {slide.heading}
              </h2>

              {/* Mobile View: Show Title/Desc, hide bullets */}
              {slide.featureTitle && (
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#7C3AED',
                  marginBottom: 12,
                }}>
                  {slide.featureTitle}
                </h3>
              )}

              {slide.featureDescription && (
                <p style={{
                  fontSize: 14,
                  color: '#6B7280',
                  lineHeight: 1.5,
                  marginBottom: 32,
                  whiteSpace: 'pre-line',
                  maxWidth: 300,
                }}>
                  {slide.featureDescription}
                </p>
              )}

              {/* Static Carousel Dots under each section as shown in Figma screenshot */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                {slides.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: i === index ? '#7C3AED' : '#e5e7eb',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .feature-mobile { display: none !important; }
          .feature-desktop { display: flex !important; margin-top: 40px; }
        }
        @media (max-width: 1023px) {
          .feature-mobile { display: flex !important; }
          .feature-desktop { display: none !important; }
        }
      `}</style>
    </section>
  );
};

export default FeatureCarousel;

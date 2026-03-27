import React from 'react';
import { MapPin, Search, Mic, User, Navigation, Inbox, Compass, ChevronDown, Cloud } from 'lucide-react';

/* ─── SVG City Map ─── */
const MapBackground = () => (
  <svg viewBox="0 0 320 480" xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
    {/* Base */}
    <rect width="320" height="480" fill="#e8e0d8" />

    {/* City Blocks */}
    <rect x="0"   y="0"   width="70"  height="60"  fill="#ddd8d0" rx="1" />
    <rect x="75"  y="0"   width="55"  height="45"  fill="#e0dbd3" rx="1" />
    <rect x="135" y="0"   width="80"  height="55"  fill="#d8d3cb" rx="1" />
    <rect x="220" y="0"   width="100" height="50"  fill="#ddd9d1" rx="1" />
    <rect x="0"   y="65"  width="50"  height="75"  fill="#e2ddd5" rx="1" />
    <rect x="55"  y="50"  width="75"  height="90"  fill="#d5d0c8" rx="1" />
    <rect x="135" y="60"  width="55"  height="70"  fill="#deddd5" rx="1" />
    <rect x="195" y="55"  width="125" height="80"  fill="#d8d4cc" rx="1" />
    <rect x="0"   y="145" width="90"  height="65"  fill="#ddd9d1" rx="1" />
    <rect x="95"  y="145" width="60"  height="65"  fill="#d5d1c9" rx="1" />
    <rect x="160" y="140" width="75"  height="75"  fill="#e0dbd3" rx="1" />
    <rect x="240" y="140" width="80"  height="70"  fill="#d8d4cc" rx="1" />
    <rect x="0"   y="215" width="65"  height="80"  fill="#dbd7cf" rx="1" />
    <rect x="70"  y="215" width="85"  height="85"  fill="#d8d3cb" rx="1" />
    <rect x="160" y="220" width="70"  height="75"  fill="#ddd8d0" rx="1" />
    <rect x="235" y="215" width="85"  height="90"  fill="#d5d1c9" rx="1" />
    <rect x="0"   y="300" width="80"  height="70"  fill="#e2ddd5" rx="1" />
    <rect x="85"  y="305" width="65"  height="65"  fill="#ddd9d1" rx="1" />
    <rect x="155" y="300" width="80"  height="70"  fill="#d8d4cc" rx="1" />
    <rect x="240" y="310" width="80"  height="55"  fill="#d5d0c8" rx="1" />
    <rect x="0"   y="375" width="100" height="105" fill="#dbd7cf" rx="1" />
    <rect x="105" y="380" width="70"  height="100" fill="#d8d3cb" rx="1" />
    <rect x="180" y="375" width="140" height="105" fill="#ddd8d0" rx="1" />

    {/* Park / Green Area */}
    <rect x="55"  y="50"  width="75"  height="90"  fill="#c8ddb5" rx="3" opacity="0.75" />
    <rect x="57"  y="52"  width="71"  height="86"  fill="none" stroke="#b5cc9e" strokeWidth="1.5" rx="2" />

    {/* Water */}
    <ellipse cx="280" cy="390" rx="45" ry="28" fill="#b8d0e8" opacity="0.7" />
    <ellipse cx="285" cy="388" rx="38" ry="22" fill="#c5d8ea" opacity="0.5" />

    {/* Yellow/beige road highlights */}
    <rect x="127" y="0"   width="8"   height="480" fill="#e8d898" opacity="0.35" />
    <rect x="0"   y="208" width="320" height="7"   fill="#e8d898" opacity="0.35" />

    {/* Main roads - Horizontal */}
    <rect x="0"   y="42"  width="320" height="8"  fill="#f5f2ed" />
    <rect x="0"   y="130" width="320" height="9"  fill="#f5f2ed" />
    <rect x="0"   y="205" width="320" height="9"  fill="#f5f2ed" />
    <rect x="0"   y="295" width="320" height="8"  fill="#f5f2ed" />
    <rect x="0"   y="370" width="320" height="8"  fill="#f5f2ed" />

    {/* Main roads - Vertical */}
    <rect x="45"  y="0" width="8"  height="480" fill="#f5f2ed" />
    <rect x="125" y="0" width="9"  height="480" fill="#f5f2ed" />
    <rect x="155" y="0" width="8"  height="480" fill="#f5f2ed" />
    <rect x="230" y="0" width="8"  height="480" fill="#f5f2ed" />

    {/* Diagonal roads */}
    <line x1="0" y1="120" x2="130" y2="0"   stroke="#f5f2ed" strokeWidth="7" />
    <line x1="130" y1="480" x2="320" y2="240" stroke="#f5f2ed" strokeWidth="6" />
    <line x1="0" y1="300" x2="160" y2="480"  stroke="#f5f2ed" strokeWidth="5" />

    {/* Road center dashes */}
    <line x1="0" y1="46"  x2="320" y2="46"  stroke="#e0dbd0" strokeWidth="1" strokeDasharray="10,7" />
    <line x1="0" y1="134" x2="320" y2="134" stroke="#e0dbd0" strokeWidth="1" strokeDasharray="10,7" />
    <line x1="0" y1="209" x2="320" y2="209" stroke="#e0dbd0" strokeWidth="1" strokeDasharray="10,7" />
    <line x1="0" y1="299" x2="320" y2="299" stroke="#e0dbd0" strokeWidth="1" strokeDasharray="10,7" />
    <line x1="49"  y1="0" x2="49"  y2="480" stroke="#e0dbd0" strokeWidth="1" strokeDasharray="10,7" />
    <line x1="129" y1="0" x2="129" y2="480" stroke="#e0dbd0" strokeWidth="1" strokeDasharray="10,7" />
    <line x1="234" y1="0" x2="234" y2="480" stroke="#e0dbd0" strokeWidth="1" strokeDasharray="10,7" />

    {/* Street labels */}
    <text x="158" y="126" fontSize="6" fill="#988c80" fontFamily="sans-serif" transform="rotate(-90, 158, 126)">Pali Hwy</text>
    <text x="50"  y="200" fontSize="6" fill="#988c80" fontFamily="sans-serif">S Beretania</text>
    <text x="155" y="290" fontSize="6" fill="#988c80" fontFamily="sans-serif">Bishop St</text>
    <text x="5"   y="360" fontSize="6" fill="#988c80" fontFamily="sans-serif">S King St</text>
    <text x="100" y="360" fontSize="6" fill="#988c80" fontFamily="sans-serif">Richards St</text>
    <text x="5"   y="415" fontSize="6" fill="#988c80" fontFamily="sans-serif">Merchant St</text>

    {/* Small buildings */}
    <rect x="5"   y="5"   width="35" height="28" fill="#ccc8c0" rx="1" />
    <rect x="80"  y="5"   width="40" height="22" fill="#ccc8c0" rx="1" />
    <rect x="140" y="5"   width="45" height="28" fill="#c8c4bc" rx="1" />
    <rect x="225" y="5"   width="40" height="24" fill="#ccc8c0" rx="1" />
    <rect x="5"   y="70"  width="30" height="40" fill="#c8c4bc" rx="1" />
    <rect x="160" y="68"  width="35" height="30" fill="#ccc8c0" rx="1" />
    <rect x="200" y="65"  width="25" height="35" fill="#c8c4bc" rx="1" />
    <rect x="5"   y="140" width="75" height="40" fill="#ccc8c0" rx="1" />
    <rect x="96"  y="148" width="52" height="45" fill="#c8c4bc" rx="1" />
    <rect x="162" y="145" width="60" height="45" fill="#ccc8c0" rx="1" />
    <rect x="5"   y="218" width="55" height="50" fill="#c8c4bc" rx="1" />
    <rect x="72"  y="218" width="75" height="55" fill="#ccc8c0" rx="1" />
    <rect x="162" y="225" width="60" height="48" fill="#c8c4bc" rx="1" />
    <rect x="237" y="222" width="78" height="55" fill="#ccc8c0" rx="1" />
    <rect x="5"   y="303" width="70" height="45" fill="#c8c4bc" rx="1" />
    <rect x="87"  y="308" width="55" height="42" fill="#ccc8c0" rx="1" />
    <rect x="157" y="303" width="65" height="45" fill="#c8c4bc" rx="1" />
    <rect x="242" y="313" width="73" height="38" fill="#ccc8c0" rx="1" />
    <rect x="5"   y="378" width="90" height="55" fill="#c8c4bc" rx="1" />
    <rect x="107" y="383" width="65" height="50" fill="#ccc8c0" rx="1" />
    <rect x="182" y="378" width="45" height="55" fill="#c8c4bc" rx="1" />
  </svg>
);

/* ─── Map Pin Component ─── */
const Pin = ({ color, label, top, left, right, bottom }) => (
  <div className="absolute flex flex-col items-center" style={{ top, left, right, bottom }}>
    <div className={`w-6 h-6 ${color} rounded-full border-2 border-white shadow-xl flex items-center justify-center`}>
      <MapPin className="w-3 h-3 text-white fill-white/40" />
    </div>
    <div className={`absolute -top-0.5 -bottom-8 flex items-end`}>
      <div
        className="w-0 h-0"
        style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `8px solid ${color.includes('purple') ? '#7C3AED' : color.includes('green') ? '#16a34a' : color.includes('orange') ? '#f59e0b' : '#ef4444'}` }}
      />
    </div>
    {label && (
      <div className="mt-2 bg-white px-1.5 py-0.5 rounded shadow-md border border-gray-100 whitespace-nowrap">
        <span className="text-[7px] font-black text-gray-800">{label}</span>
      </div>
    )}
  </div>
);

const MapPreview = () => {
  return (
    <div className="w-full h-full bg-[#e8e0d8] relative overflow-hidden font-sans select-none flex flex-col">

      {/* ── Top Search Bar ── */}
      <div className="absolute top-6 left-0 right-0 px-3 z-30">
        <div className="bg-white rounded-2xl px-3 py-2 shadow-xl flex items-center justify-between border border-gray-100">
          <div className="flex items-center flex-1">
            <MapPin className="w-4 h-4 text-[#7C3AED] mr-2 shrink-0" />
            <span className="text-gray-500 text-[10px] font-bold">Search here</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mic className="w-4 h-4 text-gray-400" />
            <div className="w-5 h-5 bg-[#7C3AED] rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Weather Widget ── */}
      <div className="absolute top-[62px] right-3 z-30">
        <div className="bg-white rounded-xl px-2 py-1.5 shadow-lg border border-gray-100 flex items-center space-x-1.5">
          <span className="text-base">⛅</span>
          <div>
            <div className="text-[9px] font-black text-gray-800 leading-none">30°C</div>
            <div className="text-[7px] font-bold text-gray-400 leading-none mt-0.5">CA, USA</div>
          </div>
        </div>
      </div>

      {/* ── Map ── */}
      <div className="flex-1 relative">
        <MapBackground />

        {/* Map Pins */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* User location - blue pulsing */}
          <div className="absolute" style={{ top: '44%', left: '38%' }}>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 bg-blue-500/25 rounded-full animate-ping" />
              <div className="w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
            </div>
          </div>

          {/* Purple pins */}
          <div className="absolute" style={{ top: '12%', left: '38%' }}>
            <div className="w-6 h-6 bg-[#7C3AED] rounded-full border-2 border-white shadow-xl flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white fill-white/40" />
            </div>
          </div>
          <div className="absolute" style={{ top: '25%', left: '22%' }}>
            <div className="w-6 h-6 bg-[#7C3AED] rounded-full border-2 border-white shadow-xl flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white fill-white/40" />
            </div>
          </div>
          <div className="absolute" style={{ top: '32%', left: '58%' }}>
            <div className="w-6 h-6 bg-[#7C3AED] rounded-full border-2 border-white shadow-xl flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white fill-white/40" />
            </div>
          </div>
          <div className="absolute" style={{ top: '56%', left: '48%' }}>
            <div className="w-6 h-6 bg-[#7C3AED] rounded-full border-2 border-white shadow-xl flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white fill-white/40" />
            </div>
          </div>
          <div className="absolute" style={{ top: '62%', left: '18%' }}>
            <div className="w-6 h-6 bg-[#7C3AED] rounded-full border-2 border-white shadow-xl flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white fill-white/40" />
            </div>
          </div>

          {/* Green pins */}
          <div className="absolute" style={{ top: '38%', left: '40%' }}>
            <div className="w-7 h-7 bg-[#16a34a] rounded-full border-2 border-white shadow-xl flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white fill-white/40" />
            </div>
          </div>
          <div className="absolute" style={{ top: '55%', right: '15%' }}>
            <div className="w-6 h-6 bg-[#16a34a] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white fill-white/40" />
            </div>
          </div>

          {/* Orange / Amber pins */}
          <div className="absolute" style={{ top: '46%', left: '12%' }}>
            <div className="w-6 h-6 bg-[#f59e0b] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white fill-white/40" />
            </div>
          </div>
          <div className="absolute" style={{ top: '68%', left: '36%' }}>
            <div className="w-6 h-6 bg-[#f59e0b] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white fill-white/40" />
            </div>
          </div>

          {/* Red pin */}
          <div className="absolute" style={{ top: '23%', right: '12%' }}>
            <div className="w-6 h-6 bg-[#ef4444] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white fill-white/40" />
            </div>
          </div>
          <div className="absolute" style={{ top: '51%', left: '2%' }}>
            <div className="w-6 h-6 bg-[#ef4444] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white fill-white/40" />
            </div>
          </div>
        </div>

        {/* Navigate FAB */}
        <div className="absolute bottom-4 right-3 z-20">
          <button className="w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center border border-gray-100">
            <Navigation className="w-4 h-4 text-blue-500 fill-blue-100" />
          </button>
        </div>

        {/* Direction FAB (teal) */}
        <div className="absolute bottom-4 right-14 z-20">
          <button className="w-8 h-8 bg-[#0f766e] rounded-xl shadow-xl flex items-center justify-center">
            <Navigation className="w-4 h-4 text-white rotate-45" />
          </button>
        </div>

        {/* Status Filter Pills */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-2 px-2">
          <div className="flex space-x-1.5 overflow-x-auto justify-start scrollbar-hide pb-1">
            {[
              { label: 'In Progress', bg: 'bg-[#f59e0b]', text: 'text-white' },
              { label: 'Upcoming', bg: 'bg-[#7C3AED]', text: 'text-white' },
              { label: 'Completed', bg: 'bg-[#16a34a]', text: 'text-white' },
              { label: 'Cancelled', bg: 'bg-[#ef4444]', text: 'text-white' },
            ].map((pill, i) => (
              <div key={i} className={`${pill.bg} px-3 py-1.5 rounded-full flex-shrink-0 shadow-lg`}>
                <span className={`text-[8px] font-black ${pill.text} whitespace-nowrap`}>{pill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Tab Sheet ── */}
      <div className="bg-white z-30 shrink-0">
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-8 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-around px-2 border-b border-gray-100">
          {['Overview', 'Jobs', 'Schedule', 'Invoice', 'Quote'].map((tab, i) => (
            <button key={i} className={`text-[8px] font-black pb-1.5 border-b-2 ${i === 0 ? 'text-[#7C3AED] border-[#7C3AED]' : 'text-gray-400 border-transparent'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Period Pills */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5">
          {['All', 'Weekly', 'Monthly', 'Yearly'].map((p, i) => (
            <div key={i} className={`px-2.5 py-1 rounded-full ${i === 0 ? 'bg-[#1a1a1a] text-white' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
              <span className="text-[7px] font-black whitespace-nowrap">{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <div className="bg-white border-t border-gray-100 flex justify-around items-center py-2 px-4 z-30 shrink-0">
        <div className="flex flex-col items-center">
          <Compass className="w-4 h-4 text-[#7C3AED]" />
          <span className="text-[7px] font-black text-[#7C3AED] mt-0.5">Explore</span>
        </div>
        <div className="flex flex-col items-center opacity-50 relative">
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          <Inbox className="w-4 h-4 text-gray-500" />
          <span className="text-[7px] font-bold text-gray-500 mt-0.5">Inbox</span>
        </div>
        <div className="flex flex-col items-center opacity-50">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-[7px] font-bold text-gray-500 mt-0.5">Account</span>
        </div>
      </div>
    </div>
  );
};

export default MapPreview;

import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, Navigation, Map as MapIcon, Filter, User, MoreVertical, Star, MapPin } from 'lucide-react';

const NearbyProfessionals = () => {
    const { professionals } = useMarketplace();
    const [radius, setRadius] = useState(5);
    const [locationInput, setLocationInput] = useState('19.0760, 72.8777'); // Mumbai
    
    // Logic to filter nearby would go here. For demo, we just show a few.
    const nearbyPros = professionals.slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 overflow-x-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Nearby Professionals</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Geo-Spatial Discovery Engine</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2">
                        <Navigation size={14} /> Global Search
                    </button>
                    <button className="px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: Discovery Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
                        {/* Target Location */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Target Coordinates</label>
                            <div className="relative group/input flex items-center">
                                <MapPin className="absolute left-6 text-blue-600" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent group-focus-within/input:border-blue-600/20 group-focus-within/input:bg-white rounded-3xl font-black text-gray-900 focus:outline-none transition-all"
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    placeholder="Lat, Long"
                                />
                                <button className="absolute right-6 p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                                    <MapIcon size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Search Radius */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center ml-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Search Radius</label>
                                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-black">{radius} KM</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="50" 
                                step="1"
                                className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                                value={radius}
                                onChange={(e) => setRadius(e.target.value)}
                            />
                            <div className="flex justify-between text-[10px] font-black text-gray-400 tracking-tighter uppercase">
                                <span>1KM</span>
                                <span>10KM</span>
                                <span>25KM</span>
                                <span>50KM</span>
                            </div>
                        </div>

                        {/* Discovery Filter Presets */}
                        <div className="grid grid-cols-3 gap-3">
                            {[5, 10, 20].map(r => (
                                <button 
                                    key={r}
                                    onClick={() => setRadius(r)}
                                    className={`py-3 rounded-2xl text-[10px] font-black border transition-all ${
                                        radius === Number(r) ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    {r} KM
                                </button>
                            ))}
                        </div>

                        <div className="h-px bg-gray-100 w-full"></div>

                        <button className="w-full py-5 bg-blue-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:translate-y-[-2px] hover:shadow-blue-200 active:translate-y-0 transition-all">
                            Initialize Scan
                        </button>
                    </div>
                </div>

                {/* Right: Results Map & List */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Visual Radius Representation */}
                    <div className="h-[300px] md:h-[400px] bg-white rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                        {/* Mock Map with Circle */}
                        <div className="absolute inset-0 bg-[#f8f9fa] bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=19.0760,72.8777&zoom=11&size=1000x400&sensor=false')] bg-cover opacity-60"></div>
                        
                        {/* Discovery Circle Simulation */}
                        <div 
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[3px] border-blue-600/40 bg-blue-600/5 rounded-full backdrop-blur-[1px] transition-all duration-700 ease-out"
                            style={{ width: `${radius * 12}px`, height: `${radius * 12}px`, maxWidth: '90%', maxHeight: '90%' }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="px-5 py-2.5 bg-slate-900/90 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-2xl">
                                    Scanning Area: {radius}KM Radius
                                </div>
                            </div>
                        </div>

                        {/* Center Pin */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className="h-4 w-4 bg-blue-600 rounded-full border-4 border-white shadow-xl animate-pulse"></div>
                        </div>

                        {/* Pro Pins */}
                        {nearbyPros.map((pro, i) => (
                            <div 
                                key={pro.id}
                                className="absolute z-20 transition-transform hover:scale-125"
                                style={{ 
                                    left: `${50 + (i+1) * 8}%`, 
                                    top: `${50 + (i-1) * 12}%` 
                                }}
                            >
                                <div className="h-5 w-5 bg-slate-900 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white scale-125">
                                    <User size={10} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filtered List */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-4">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Identified Fleet <span className="text-blue-600 text-sm ml-2">({nearbyPros.length})</span></h2>
                            <button className="hidden sm:block text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline transition-all">Export Fleet Logs</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                            {nearbyPros.map(pro => (
                                <div key={pro.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-xl transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                                {pro.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-lg font-black text-gray-900 leading-none mb-1">{pro.name}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pro.category}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex flex-col justify-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Distance</p>
                                            <p className="text-sm font-black text-gray-800">1.8 KM</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex flex-col justify-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Feedback</p>
                                            <div className="flex items-center gap-1">
                                                <Star className="text-yellow-400 fill-current" size={12} />
                                                <p className="text-sm font-black text-gray-800">{pro.rating}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                                        Assign Discovery Task
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NearbyProfessionals;

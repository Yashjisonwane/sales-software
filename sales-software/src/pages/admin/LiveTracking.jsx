import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, Activity, Clock, User, Filter, MoreVertical, Navigation } from 'lucide-react';

const LiveTracking = () => {
    const { professionals, locationLogs } = useMarketplace();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPro, setSelectedPro] = useState(null);

    const trackedPros = professionals.filter(p => p.trackingEnabled);
    
    const filteredPros = trackedPros.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
            {/* Left Side: Professional List */}
            <div className="w-full md:w-80 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="text-blue-600" size={20} />
                        Live Fleet
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Find professional..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {filteredPros.map(pro => (
                        <button 
                            key={pro.id}
                            onClick={() => setSelectedPro(pro)}
                            className={`w-full text-left p-3 rounded-2xl border transition-all ${
                                selectedPro?.id === pro.id 
                                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                    : 'border-transparent hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs">
                                            {pro.name.charAt(0)}
                                        </div>
                                        <span className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                                            pro.onlineStatus === 'Online' ? 'bg-green-500' : 'bg-gray-400'
                                        }`}></span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-900 truncate">{pro.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium truncate">{pro.category}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    pro.onlineStatus === 'Online' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'
                                }`}>
                                    {pro.onlineStatus || 'Offline'}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-[9px] text-gray-400 font-bold">
                                <div className="flex items-center gap-1">
                                    <Clock size={10} />
                                    <span>{pro.lastUpdate ? new Date(pro.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Navigation size={10} />
                                    <span>{pro.lastLocation ? `${pro.lastLocation.lat.toFixed(3)}, ${pro.lastLocation.lng.toFixed(3)}` : 'Wait...'}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                    {filteredPros.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No active units</p>
                        </div>
                    )}
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <span>Total Tracked</span>
                        <span className="text-blue-600">{trackedPros.length} Agents</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Map Interace */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative group">
                {/* Google Map Iframe */}
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29447.82891851613!2d75.86119679999999!3d22.69184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1775022608974!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 z-0"
                ></iframe>

                {/* UI Overlays */}
                <div className="absolute top-6 left-6 flex gap-2">
                    <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-700">
                            {selectedPro?.city || trackedPros[0]?.city || 'Indore'} Live Cluster
                        </span>
                    </div>
                </div>

                {/* Selected Professional Card (Bottom Left) */}
                {selectedPro && (
                    <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 animate-in slide-in-from-bottom-5 duration-300 z-30">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                                    {selectedPro.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 leading-tight">{selectedPro.name}</h3>
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{selectedPro.category}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedPro(null)}
                                className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"
                            >
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${selectedPro.onlineStatus === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                    <span className="text-sm font-black text-gray-800">{selectedPro.onlineStatus || 'Offline'}</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Sync</p>
                                <div className="flex items-center gap-2">
                                    <Clock className="text-blue-500" size={14} />
                                    <span className="text-sm font-black text-gray-800">
                                        {selectedPro.lastUpdate ? new Date(selectedPro.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all">
                                View Full Profile
                            </button>
                            <button 
                                onClick={() => window.location.href=`/admin/location-history?id=${selectedPro.id}`}
                                className="px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors"
                            >
                                <Clock size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Map Controls */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <button className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                        <Filter size={18} />
                    </button>
                    <button className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-blue-600 hover:bg-gray-50 transition-colors">
                        <Navigation size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveTracking;

import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Clock, MapPin, ChevronLeft, Calendar, User, ArrowRight } from 'lucide-react';

const LocationHistory = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { professionals, locationLogs } = useMarketplace();
    
    const proId = searchParams.get('id');
    const pro = professionals.find(p => p.id === proId);
    
    // Reverse logs for timeline (newest first)
    const proLogs = locationLogs.filter(log => log.proId === proId);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="h-14 w-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all shadow-sm group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Fleet Location Logs</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1 flex items-center gap-2">
                            <Clock size={12} className="text-blue-600" />
                            Chronological Data Stream
                        </p>
                    </div>
                </div>

                {pro && (
                    <div className="px-6 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center gap-4 border-l-4 border-l-blue-600">
                        <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-black">
                            {pro.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 leading-none mb-1">{pro.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pro.category}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timeline Visualization */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
                            <Calendar className="text-blue-600" size={20} />
                            Today's Logs
                        </h3>

                        {proLogs.length === 0 ? (
                            <div className="py-20 text-center space-y-4">
                                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                    <Clock size={32} className="text-gray-200" />
                                </div>
                                <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No signals received</p>
                            </div>
                        ) : (
                            <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:to-transparent">
                                {proLogs.map((log, idx) => (
                                    <div key={log.id} className="relative pl-12 group">
                                        {/* Dot */}
                                        <div className={`absolute left-2.5 top-1 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ring-4 ring-blue-50 transition-all group-hover:scale-125 z-10 ${
                                            idx === 0 ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}></div>

                                        <div className={`p-5 rounded-2xl border transition-all ${
                                            idx === 0 ? 'bg-blue-50/50 border-blue-100 shadow-sm' : 'bg-gray-50 border-transparent hover:border-gray-200'
                                        }`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${idx === 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                                {idx === 0 && <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Live</span>}
                                            </div>
                                            <p className="text-sm font-black text-gray-800 flex items-center gap-2">
                                                <MapPin size={12} className="text-blue-500" />
                                                {log.lat.toFixed(4)}, {log.lng.toFixed(4)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Context Placeholder */}
                <div className="lg:col-span-2">
                    <div className="h-full min-h-[500px] bg-white rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden flex flex-col items-center justify-center p-12 text-center group">
                         {/* Mock Map Background */}
                        <div className="absolute inset-0 bg-[#f8f9fa] bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=19.0760,72.8777&zoom=13&size=1000x800&path=color:0x0000ff|weight:5|19.076,72.877|19.080,72.880|19.085,72.875&sensor=false')] bg-cover opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        
                        <div className="relative z-10 space-y-6 max-w-sm">
                            <div className="h-24 w-24 bg-white rounded-3xl shadow-2xl border border-gray-50 flex items-center justify-center mx-auto text-blue-600 animate-bounce">
                                <MapPin size={40} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Path Visualization</h3>
                                <p className="text-sm font-bold text-gray-500 mt-2 leading-relaxed italic">"Trace is active. Currently displaying the trajectory of {pro?.name || 'the unit'} across the Mumbai cluster."</p>
                            </div>
                            <div className="flex justify-center gap-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                                ))}
                            </div>
                        </div>

                        {/* Stats Overlay */}
                        <div className="absolute bottom-10 inset-x-10 grid grid-cols-3 gap-6">
                            {[
                                { label: 'Distance Today', val: '4.2 KM' },
                                { label: 'Active Duration', val: '6h 12m' },
                                { label: 'Signal Strength', val: '100%' },
                            ].map((s, idx) => (
                                <div key={idx} className="bg-white/90 backdrop-blur rounded-[2rem] p-6 border border-white shadow-xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                                    <p className="text-xl font-black text-gray-900">{s.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationHistory;

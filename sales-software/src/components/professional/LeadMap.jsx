import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    X, 
    User, 
    Navigation, 
    ExternalLink, 
    CheckCircle,
    UserCircle,
    Layers,
    LocateFixed,
    Maximize,
    Info,
    Phone,
    Mail,
    MapPin,
    Zap,
    History
} from 'lucide-react';

// Fix Leaflet marker icons missing in build
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Map Contoller Component
const MapController = ({ center }) => {
    const map = useMap();
    
    // Function to recenter map
    const handleRecenter = () => {
        map.flyTo(center, 14, {
            duration: 1.5,
            easeLinearity: 0.25
        });
    };

    return (
        <div className="absolute right-4 top-4 md:right-6 md:top-6 z-[1000] flex flex-col gap-2">
            <button 
                onClick={handleRecenter}
                className="w-10 h-10 md:w-12 md:h-12 bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/40 shadow-xl flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto group"
                title="Recenter Map"
            >
                <LocateFixed size={18} className="md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
            </button>
        </div>
    );
};

const LeadMap = ({ leads, onAction, className = '' }) => {
    const [selectedLead, setSelectedLead] = useState(null);
    const [mapMode, setMapMode] = useState('streets'); // Changed default from 'hybrid' to 'streets'
    const [showLegend, setShowLegend] = useState(false); // Toggle for mobile legend

    // Center on Mumbai, India (as requested by the user)
    const center = useMemo(() => [19.0760, 72.8777], []);

    // Add styles for markers and overlays
    const animationStyles = `
        .custom-popup-box .leaflet-popup-content-wrapper {
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border: 1px solid rgba(0,0,0,0.05);
            padding: 0;
            overflow: hidden;
        }
        .custom-tooltip {
            background: white;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            font-size: 10px;
            font-weight: 800;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 4px 8px;
        }
    `;

    // High-Fidelity Static Markers (Violet Pins)
    const createCustomIcon = (lead) => {
        const iconColor = '#8b5cf6'; // Violet
        const shadowColor = 'rgba(139, 92, 246, 0.3)';

        const svgHtml = `
            <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; inset: 4px; background: ${shadowColor}; border-radius: 50%; filter: blur(8px); opacity: 0.6;"></div>
                <div style="position: relative;">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C16.5 18 21 13.5 21 8.5C21 3.52944 16.9706 0.5 12 0.5C7.02944 0.5 3 3.52944 3 8.5C3 13.5 7.5 18 12 22Z" fill="${iconColor}" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="8.5" r="3.5" fill="white" />
                    </svg>
                </div>
            </div>
        `;

        return L.divIcon({
            html: svgHtml,
            className: 'custom-leaflet-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 34],
            popupAnchor: [0, -30]
        });
    };

    return (
        <div className={`group relative flex flex-col h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden border border-slate-200/50 shadow-2xl bg-slate-50 ${className}`}>
            <style>{animationStyles}</style>
            
            <MapContainer 
                center={center} 
                zoom={15} 
                zoomControl={false}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                className="z-0 transition-opacity duration-1000"
            >
                <ZoomControl position="bottomright" />
                <MapController center={center} />
                
                {/* High Fidelity Voyager Layer (Natural Colors) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                {/* Satellite Hybrid Layer - Only visible in hybrid mode */}
                {mapMode === 'hybrid' && (
                    <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        opacity={0.7}
                    />
                )}
                
                {leads && leads.map((lead) => (
                    <Marker 
                        key={lead.id} 
                        position={[lead.latitude || 22.7, lead.longitude || 75.8]}
                        icon={createCustomIcon(lead)}
                        eventHandlers={{
                            click: () => setSelectedLead(lead),
                        }}
                    >
                        <Tooltip permanent direction="right" offset={[15, -20]} className="custom-tooltip">
                            {lead.serviceCategory}
                        </Tooltip>
                        
                        <Popup className="custom-popup-box">
                            <div className="p-4 min-w-[220px]">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-2 h-2 rounded-full ${['accepted'].includes(lead.status?.toLowerCase()) ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : (['sent', 'new', 'viewed', 'open'].includes(lead.status?.toLowerCase()) ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-gray-400 shadow-[0_0_8px_#94a3b8]')}`}></div>
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.1em]">{lead.status}</span>
                                </div>
                                <h4 className="font-bold text-gray-900 leading-tight mb-1">{lead.serviceCategory}</h4>
                                <p className="text-[11px] text-gray-400 font-medium mb-4 flex items-center gap-1">
                                    <MapPin size={10} /> 
                                    {lead.location}
                                </p>
                                
                                <button 
                                    onClick={() => onAction('view', lead)}
                                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Quick Inspect
                                    <Maximize size={12} />
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Top Navigation & Info Glassy Panel */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-[1000] flex flex-col md:gap-3 pointer-events-none">
                {/* Unified Control Bar for Mobile, Stacked for Desktop */}
                <div className="bg-slate-900/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none rounded-2xl md:rounded-none flex md:flex-col items-center md:items-start gap-1 p-1 md:p-0 pointer-events-auto">
                    
                    {/* Status Legend - Integrated into the bar on mobile */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/50 shadow-2xl flex items-center h-8 md:h-auto overflow-hidden">
                        {/* Legend Toggle Button */}
                        <button 
                            onClick={() => setShowLegend(!showLegend)}
                            className="flex md:hidden items-center justify-center w-8 h-8 text-slate-500 hover:bg-slate-50 transition-colors border-r border-slate-100"
                        >
                            <Info size={14} className={showLegend ? 'text-blue-500' : ''} />
                        </button>

                        <div className={`px-2 md:px-5 py-2 md:py-3 flex items-center gap-2 md:gap-5 ${!showLegend ? 'hidden md:flex' : 'flex'} transition-all duration-300`}>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse"></span>
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 whitespace-nowrap">Open</span>
                            </div>
                            <div className="w-[1px] h-3 md:h-4 bg-slate-200"></div>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 whitespace-nowrap">Secured</span>
                            </div>
                        </div>
                    </div>

                    {/* Layer Control - Row on mobile, row on desktop too but separated */}
                    <div className="bg-transparent md:bg-slate-900/90 md:backdrop-blur-md md:p-1 md:rounded-2xl md:border md:border-white/10 md:shadow-2xl flex items-center gap-1 ml-1 md:ml-0 md:mt-3">
                        <button 
                            onClick={() => setMapMode('streets')}
                            className={`px-2 md:px-3 py-1.5 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${mapMode === 'streets' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 md:bg-transparent text-slate-400 md:text-slate-400 hover:text-white'}`}
                        >
                            <span className="hidden md:inline">Blueprints</span>
                            <span className="md:hidden">BP</span>
                        </button>
                        <button 
                            onClick={() => setMapMode('hybrid')}
                            className={`px-2 md:px-3 py-1.5 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${mapMode === 'hybrid' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 md:bg-transparent text-slate-400 md:text-slate-400 hover:text-white'}`}
                        >
                            <span className="hidden md:inline">Intelligence</span>
                            <span className="md:hidden">INT</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Info Bar - Hidden on mobile to keep map clear */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none w-full px-6 hidden sm:block">
                <div className="flex items-center justify-between w-full">
                    {/* Live Status indicator */}
                    <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl flex items-center gap-3 pointer-events-auto">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute"></div>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Live Geo-Stream</span>
                        <div className="w-px h-3 bg-white/20"></div>
                        <span className="text-[9px] font-bold text-white/70 tracking-tight">{leads?.length || 0} Entities Detected</span>
                    </div>
                </div>
            </div>


            {/* Modern Selection Card Overlay */}
            {selectedLead && (
                <div className="absolute inset-x-6 bottom-6 md:inset-x-auto md:right-8 md:bottom-8 md:w-[400px] z-[2000] animate-in slide-in-from-bottom-12 fade-in duration-700 pointer-events-auto">
                    <div className="bg-white/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 shadow-[0_32px_80px_rgba(0,0,0,0.3)] overflow-hidden">
                        {/* Header Image/Pattern */}
                        <div className={`h-2 text-center ${['accepted'].includes(selectedLead.status?.toLowerCase()) ? 'bg-green-500' : (['sent', 'new', 'viewed', 'open'].includes(selectedLead.status?.toLowerCase()) ? 'bg-red-500' : 'bg-slate-400')}`}></div>
                        
                        <div className="p-2 flex justify-end absolute top-1 right-2">
                            <button 
                                onClick={() => setSelectedLead(null)}
                                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                            >
                                <X size={18} strokeWidth={3} />
                            </button>
                        </div>
                        
                        <div className="px-10 pb-10 pt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-lg ${['accepted'].includes(selectedLead.status?.toLowerCase()) ? 'bg-green-500 shadow-green-200' : (['sent', 'new', 'viewed', 'open'].includes(selectedLead.status?.toLowerCase()) ? 'bg-red-500 shadow-red-200' : 'bg-slate-400 shadow-slate-200')}`}>
                                    {selectedLead.status}
                                </div>
                                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">LID-{selectedLead.id}</span>
                            </div>

                            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
                                {selectedLead.serviceCategory}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                                    <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3">
                                        <UserCircle size={16} className="text-slate-400" />
                                    </div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Persona</p>
                                    <p className={`text-sm font-bold truncate ${['sent', 'new', 'viewed', 'open'].includes(selectedLead.status?.toLowerCase()) ? 'text-slate-400' : 'text-slate-900'}`}>
                                        {['sent', 'new', 'viewed', 'open'].includes(selectedLead.status?.toLowerCase()) ? `Private Client` : selectedLead.customerName}
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                                    <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3">
                                        <Navigation size={16} className="text-slate-400" />
                                    </div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Coordinates</p>
                                    <p className={`text-lg font-bold truncate ${['sent', 'new', 'viewed', 'open'].includes(selectedLead.status?.toLowerCase()) ? 'text-slate-300 italic' : 'text-slate-600'}`}>
                                        {['sent', 'new', 'viewed', 'open'].includes(selectedLead.status?.toLowerCase()) ? "Encrypted Loc." : selectedLead.location}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {(['sent', 'new', 'viewed', 'open'].includes(selectedLead.status?.toLowerCase())) ? (
                                    <button
                                        onClick={() => onAction && onAction('accept', selectedLead)}
                                        className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black uppercase tracking-[0.1em] rounded-2xl transition-all shadow-[0_12px_24px_rgba(37,99,235,0.3)] active:scale-[0.98]"
                                    >
                                        <Zap size={18} fill="currentColor" />
                                        Initialize Acquisition
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onAction && onAction('view', selectedLead)}
                                        className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-black uppercase tracking-[0.1em] rounded-2xl transition-all shadow-[0_12px_24px_rgba(0,0,0,0.15)] active:scale-[0.98]"
                                    >
                                        <Info size={18} />
                                        Detailed Intelligence
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="w-full py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-600 transition-colors"
                                >
                                    Dismiss Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadMap;


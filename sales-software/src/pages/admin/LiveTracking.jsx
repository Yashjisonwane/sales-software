import React, { useEffect, useMemo, useRef, useState } from 'react';
import io from 'socket.io-client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, Activity, Clock, Navigation, MoreVertical, Route } from 'lucide-react';
import { getSocketOrigin } from '../../services/apiClient';

const LiveTracking = () => {
    const {
        currentUser,
        professionalLocations,
        refreshProfessionalLocations,
        patchProfessionalLocationRealtime
    } = useMarketplace();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPro, setSelectedPro] = useState(null);
    const [mapError, setMapError] = useState('');
    const [tokenInput, setTokenInput] = useState('');
    const [routeInfo, setRouteInfo] = useState(null);
    const [activeMapToken, setActiveMapToken] = useState(() => {
        const fromEnv = import.meta.env.VITE_MAPBOX_TOKEN;
        const fromLocal = localStorage.getItem('VITE_MAPBOX_TOKEN');
        return fromEnv || fromLocal || '';
    });
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const proMarkersRef = useRef({});
    const customerMarkerRef = useRef(null);
    const routeFetchTimerRef = useRef(null);

    const trackedPros = useMemo(
        () => (professionalLocations || []).filter((p) => p.trackingEnabled && p.lat && p.lng),
        [professionalLocations]
    );

    const filteredPros = trackedPros.filter(p =>
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (!selectedPro?.id) return;
        const fresh = trackedPros.find((p) => p.id === selectedPro.id);
        if (fresh) setSelectedPro(fresh);
    }, [trackedPros, selectedPro?.id]);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'ADMIN') return;
        refreshProfessionalLocations();
    }, [currentUser?.id, currentUser?.role, refreshProfessionalLocations]);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'ADMIN') return undefined;
        const token = localStorage.getItem('userToken');
        if (!token) return undefined;

        const socket = io(getSocketOrigin(), {
            auth: { token },
            transports: ['websocket', 'polling']
        });
        socket.on('update_on_map', patchProfessionalLocationRealtime);
        return () => {
            socket.off('update_on_map', patchProfessionalLocationRealtime);
            socket.disconnect();
        };
    }, [currentUser?.id, currentUser?.role, patchProfessionalLocationRealtime]);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;
        const token = activeMapToken;
        if (!token) {
            setMapError('VITE_MAPBOX_TOKEN missing. Please add it in your environment to enable map.');
            return;
        }

        mapboxgl.accessToken = token;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [77.1025, 28.7041],
            zoom: 4.5
        });
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [activeMapToken]);

    const applyToken = () => {
        const t = tokenInput.trim();
        if (!t) return;
        localStorage.setItem('VITE_MAPBOX_TOKEN', t);
        setActiveMapToken(t);
        setMapError('');
    };

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // Remove stale markers
        Object.keys(proMarkersRef.current).forEach((id) => {
            if (!trackedPros.some((p) => p.id === id)) {
                proMarkersRef.current[id].remove();
                delete proMarkersRef.current[id];
            }
        });

        trackedPros.forEach((pro) => {
            const lngLat = [pro.lng, pro.lat];
            const marker = proMarkersRef.current[pro.id];
            if (marker) {
                marker.setLngLat(lngLat);
            } else {
                const el = document.createElement('div');
                el.className = 'h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow';
                const mk = new mapboxgl.Marker({ element: el })
                    .setLngLat(lngLat)
                    .setPopup(
                        new mapboxgl.Popup({ offset: 12 }).setHTML(
                            `<div style="font-size:12px"><b>${pro.name}</b><br/>${pro.category || 'General'}</div>`
                        )
                    )
                    .addTo(map);
                el.addEventListener('click', () => setSelectedPro(pro));
                proMarkersRef.current[pro.id] = mk;
            }
        });
    }, [trackedPros]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !selectedPro?.currentJob) {
            if (customerMarkerRef.current) {
                customerMarkerRef.current.remove();
                customerMarkerRef.current = null;
            }
            if (map?.getLayer('pro-route-line')) map.removeLayer('pro-route-line');
            if (map?.getSource('pro-route-line')) map.removeSource('pro-route-line');
            setRouteInfo(null);
            return;
        }

        const cLat = selectedPro.currentJob.customerLat;
        const cLng = selectedPro.currentJob.customerLng;
        if (typeof cLat !== 'number' || typeof cLng !== 'number') return;

        if (customerMarkerRef.current) customerMarkerRef.current.remove();
        const el = document.createElement('div');
        el.className = 'h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow';
        customerMarkerRef.current = new mapboxgl.Marker({ element: el })
            .setLngLat([cLng, cLat])
            .setPopup(
                new mapboxgl.Popup({ offset: 12 }).setHTML(
                    `<div style="font-size:12px"><b>Customer</b><br/>${selectedPro.currentJob.customerName || ''}</div>`
                )
            )
            .addTo(map);
    }, [selectedPro?.id, selectedPro?.currentJob]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !activeMapToken) return;
        if (!selectedPro?.currentJob) return;
        if (typeof selectedPro.lat !== 'number' || typeof selectedPro.lng !== 'number') return;

        const cLat = selectedPro.currentJob.customerLat;
        const cLng = selectedPro.currentJob.customerLng;
        if (typeof cLat !== 'number' || typeof cLng !== 'number') return;

        const drawRoute = async () => {
            try {
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${selectedPro.lng},${selectedPro.lat};${cLng},${cLat}?geometries=geojson&overview=full&access_token=${activeMapToken}`;
                const res = await fetch(url);
                const data = await res.json();
                const route = data?.routes?.[0];
                if (!route?.geometry) return;

                const geojson = {
                    type: 'Feature',
                    geometry: route.geometry
                };

                if (map.getSource('pro-route-line')) {
                    map.getSource('pro-route-line').setData(geojson);
                } else {
                    map.addSource('pro-route-line', { type: 'geojson', data: geojson });
                    map.addLayer({
                        id: 'pro-route-line',
                        type: 'line',
                        source: 'pro-route-line',
                        layout: { 'line-join': 'round', 'line-cap': 'round' },
                        paint: {
                            'line-color': '#2563eb',
                            'line-width': 4,
                            'line-opacity': 0.85
                        }
                    });
                }

                const mins = Math.max(1, Math.round((route.duration || 0) / 60));
                const kms = ((route.distance || 0) / 1000).toFixed(1);
                setRouteInfo({ etaMins: mins, distanceKm: kms });
            } catch (err) {
                console.warn('Route fetch failed:', err.message);
            }
        };

        drawRoute();
        if (routeFetchTimerRef.current) clearInterval(routeFetchTimerRef.current);
        routeFetchTimerRef.current = setInterval(drawRoute, 15000);

        return () => {
            if (routeFetchTimerRef.current) {
                clearInterval(routeFetchTimerRef.current);
                routeFetchTimerRef.current = null;
            }
        };
    }, [selectedPro?.id, selectedPro?.lat, selectedPro?.lng, selectedPro?.currentJob, activeMapToken]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || trackedPros.length === 0) return;
        const bounds = new mapboxgl.LngLatBounds();
        trackedPros.forEach((p) => bounds.extend([p.lng, p.lat]));
        map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 800 });
    }, [trackedPros.length]);

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
                                    <span>{typeof pro.lat === 'number' ? `${pro.lat.toFixed(3)}, ${pro.lng.toFixed(3)}` : 'Wait...'}</span>
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

            {/* Right Side: Map Interface */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative group">
                <div ref={mapContainerRef} className="absolute inset-0 z-0" />
                {mapError && (
                    <div className="absolute inset-0 z-20 bg-white/90 flex items-center justify-center p-6 text-center">
                        <div className="max-w-md w-full space-y-3">
                            <p className="text-sm font-bold text-rose-600">{mapError}</p>
                            <p className="text-xs text-gray-500 font-medium">
                                Mapbox token paste karo (starts with <span className="font-black">pk.</span>)
                            </p>
                            <input
                                type="text"
                                value={tokenInput}
                                onChange={(e) => setTokenInput(e.target.value)}
                                placeholder="Paste Mapbox public token here..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                onClick={applyToken}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                            >
                                Apply Token
                            </button>
                        </div>
                    </div>
                )}

                {/* UI Overlays */}
                <div className="absolute top-6 left-6 flex gap-2">
                    <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-700">
                            {selectedPro?.city || 'Live Tracking Cluster'}
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
                                        {selectedPro.updatedAt ? new Date(selectedPro.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {routeInfo && (
                            <div className="mb-6 bg-blue-50 rounded-2xl border border-blue-100 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Route size={14} className="text-blue-600" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Live Route</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-900">{routeInfo.distanceKm} km</p>
                                    <p className="text-[10px] font-bold text-gray-500">ETA ~ {routeInfo.etaMins} min</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all">
                                View Full Profile
                            </button>
                            <button
                                onClick={() => window.location.href = `/admin/location-history?id=${selectedPro.id}`}
                                className="px-6 py-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors"
                            >
                                <Clock size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {selectedPro?.currentJob && (
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-4 py-3 rounded-2xl shadow-lg border border-gray-100 max-w-xs z-20">
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Assigned Customer</p>
                        <p className="text-xs font-bold text-gray-900">{selectedPro.currentJob.customerName}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{selectedPro.currentJob.location || 'Location unavailable'}</p>
                        {routeInfo && (
                            <p className="text-[10px] font-bold text-blue-600 mt-1">ETA {routeInfo.etaMins} min · {routeInfo.distanceKm} km</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveTracking;

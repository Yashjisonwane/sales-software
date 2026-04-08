import React, { useEffect, useMemo, useRef, useState } from 'react';
import io from 'socket.io-client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, Activity, Clock, Navigation, MoreVertical } from 'lucide-react';
import { getSocketOrigin } from '../../services/apiClient';

const DEFAULT_CENTER = [77.4126, 23.2599];
const MAP_STYLE = {
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
        }
    },
    layers: [
        {
            id: 'osm-base',
            type: 'raster',
            source: 'osm'
        }
    ]
};
const POLLING_INTERVAL_MS = 5000;
const MOVE_ANIMATION_MS = 900;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const createMarkerElement = (pro) => {
    const el = document.createElement('div');
    const isOnline = String(pro.onlineStatus || '').toLowerCase() === 'online';
    const accent = isOnline ? '#2563eb' : '#64748b';
    const icon = isOnline ? '🧑‍🔧' : '📍';
    el.innerHTML = `
        <div style="
            width:36px;
            height:36px;
            border-radius:9999px;
            background:${accent};
            border:2px solid #ffffff;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 6px 16px rgba(0,0,0,0.22);
            font-size:16px;
            line-height:1;
            user-select:none;
        ">${icon}</div>
    `;
    return el;
};

const animateMarkerTo = (marker, from, to, duration = MOVE_ANIMATION_MS) => {
    const [fromLng, fromLat] = from;
    const [toLng, toLat] = to;
    if (!Number.isFinite(fromLng) || !Number.isFinite(fromLat) || !Number.isFinite(toLng) || !Number.isFinite(toLat)) {
        marker.setLngLat([toLng, toLat]);
        return;
    }
    const start = performance.now();
    const step = (now) => {
        const raw = Math.min((now - start) / duration, 1);
        const t = easeOutCubic(raw);
        marker.setLngLat([fromLng + (toLng - fromLng) * t, fromLat + (toLat - fromLat) * t]);
        if (raw < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};

const LiveTracking = () => {
    const {
        currentUser,
        professionalLocations,
        refreshProfessionalLocations,
        patchProfessionalLocationRealtime
    } = useMarketplace();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPro, setSelectedPro] = useState(null);
    const [isAutoFollowEnabled, setIsAutoFollowEnabled] = useState(true);
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const proMarkersRef = useRef({});
    const customerMarkerRef = useRef(null);
    const manualMoveRef = useRef(false);
    const pollingRef = useRef(null);
    const popupRef = useRef(null);

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
        refreshProfessionalLocations();
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = setInterval(() => {
            refreshProfessionalLocations();
        }, POLLING_INTERVAL_MS);
        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
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
        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: MAP_STYLE,
            center: DEFAULT_CENTER,
            zoom: 4.5,
            attributionControl: true
        });
        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.on('dragstart', () => {
            manualMoveRef.current = true;
            setIsAutoFollowEnabled(false);
        });
        mapRef.current = map;
        popupRef.current = new maplibregl.Popup({ offset: 12 });

        return () => {
            if (popupRef.current) {
                popupRef.current.remove();
                popupRef.current = null;
            }
            Object.values(proMarkersRef.current).forEach((m) => m?.remove());
            proMarkersRef.current = {};
            if (customerMarkerRef.current) {
                customerMarkerRef.current.remove();
                customerMarkerRef.current = null;
            }
            map.remove();
            mapRef.current = null;
        };
    }, []);

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
                const current = marker.getLngLat();
                animateMarkerTo(marker, [current.lng, current.lat], lngLat);
                const popup = marker.getPopup();
                if (popup) {
                    popup.setHTML(
                        `<div style="font-size:12px"><b>${pro.name}</b><br/>${pro.category || 'General'}<br/>${pro.lat.toFixed(5)}, ${pro.lng.toFixed(5)}</div>`
                    );
                }
            } else {
                const el = createMarkerElement(pro);
                const mk = new maplibregl.Marker({ element: el })
                    .setLngLat(lngLat)
                    .setPopup(
                        new maplibregl.Popup({ offset: 12 }).setHTML(
                            `<div style="font-size:12px"><b>${pro.name}</b><br/>${pro.category || 'General'}<br/>${pro.lat.toFixed(5)}, ${pro.lng.toFixed(5)}</div>`
                        )
                    )
                    .addTo(map);
                el.addEventListener('click', () => {
                    setSelectedPro(pro);
                    if (isAutoFollowEnabled) {
                        map.flyTo({ center: lngLat, zoom: 14, duration: 700 });
                    }
                });
                proMarkersRef.current[pro.id] = mk;
            }
        });
    }, [trackedPros, isAutoFollowEnabled]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !selectedPro?.currentJob) {
            if (customerMarkerRef.current) {
                customerMarkerRef.current.remove();
                customerMarkerRef.current = null;
            }
            return;
        }

        const cLat = selectedPro.currentJob.customerLat;
        const cLng = selectedPro.currentJob.customerLng;
        if (typeof cLat !== 'number' || typeof cLng !== 'number') return;

        if (!customerMarkerRef.current) {
            const el = document.createElement('div');
            el.innerHTML = `
                <div style="
                    width:32px;
                    height:32px;
                    border-radius:9999px;
                    background:#10b981;
                    border:2px solid #ffffff;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    box-shadow:0 6px 16px rgba(0,0,0,0.18);
                    font-size:14px;
                ">🏠</div>
            `;
            customerMarkerRef.current = new maplibregl.Marker({ element: el }).addTo(map);
        }
        customerMarkerRef.current
            .setLngLat([cLng, cLat])
            .setPopup(
                new maplibregl.Popup({ offset: 12 }).setHTML(
                    `<div style="font-size:12px"><b>Customer</b><br/>${selectedPro.currentJob.customerName || ''}<br/>${cLat.toFixed(5)}, ${cLng.toFixed(5)}</div>`
                )
            );
    }, [selectedPro?.id, selectedPro?.currentJob]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !selectedPro?.id || !isAutoFollowEnabled) return;
        const marker = proMarkersRef.current[selectedPro.id];
        if (!marker) return;
        const { lng, lat } = marker.getLngLat();
        map.easeTo({ center: [lng, lat], duration: 700, zoom: Math.max(map.getZoom(), 12.5) });
    }, [selectedPro?.id, selectedPro?.lat, selectedPro?.lng, isAutoFollowEnabled]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || trackedPros.length === 0 || manualMoveRef.current) return;
        if (selectedPro?.id && isAutoFollowEnabled) return;
        const bounds = new maplibregl.LngLatBounds();
        trackedPros.forEach((p) => bounds.extend([p.lng, p.lat]));
        map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 800 });
    }, [trackedPros, selectedPro?.id, isAutoFollowEnabled]);

    const recenterToSelection = () => {
        const map = mapRef.current;
        if (!map) return;
        setIsAutoFollowEnabled(true);
        manualMoveRef.current = false;
        if (selectedPro?.lng && selectedPro?.lat) {
            map.flyTo({ center: [selectedPro.lng, selectedPro.lat], zoom: 13.5, duration: 850 });
            return;
        }
        if (trackedPros.length > 0) {
            const bounds = new maplibregl.LngLatBounds();
            trackedPros.forEach((p) => bounds.extend([p.lng, p.lat]));
            map.fitBounds(bounds, { padding: 80, maxZoom: 13, duration: 850 });
        } else {
            map.flyTo({ center: DEFAULT_CENTER, zoom: 5, duration: 850 });
        }
    };

    const mockMoveSelected = () => {
        if (!selectedPro?.id || typeof selectedPro.lat !== 'number' || typeof selectedPro.lng !== 'number') return;
        const lat = selectedPro.lat + (Math.random() - 0.5) * 0.003;
        const lng = selectedPro.lng + (Math.random() - 0.5) * 0.003;
        patchProfessionalLocationRealtime({
            professionalId: selectedPro.id,
            lat,
            lng,
            updatedAt: new Date().toISOString(),
            trackingEnabled: true
        });
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
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
                    {filteredPros.map((pro) => (
                        <button
                            key={pro.id}
                            onClick={() => {
                                setSelectedPro(pro);
                                setIsAutoFollowEnabled(true);
                            }}
                            className={`w-full text-left p-3 rounded-2xl border transition-all ${
                                selectedPro?.id === pro.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-transparent hover:bg-gray-50'
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

            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative group">
                <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />

                <div className="absolute top-6 left-6 flex gap-2 z-20">
                    <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-700">
                            {selectedPro?.city || 'Live Tracking Cluster'}
                        </span>
                    </div>
                </div>

                <div className="absolute top-6 right-6 z-20 flex gap-2">
                    <button
                        onClick={recenterToSelection}
                        className="px-3 py-2 rounded-xl bg-white/95 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-blue-600 shadow"
                    >
                        {isAutoFollowEnabled ? 'Following' : 'Enable Follow'}
                    </button>
                    <button
                        onClick={mockMoveSelected}
                        className="px-3 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow"
                    >
                        Mock Move
                    </button>
                </div>

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
                    <div className="absolute top-20 right-6 bg-white/95 backdrop-blur px-4 py-3 rounded-2xl shadow-lg border border-gray-100 max-w-xs z-20">
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Assigned Customer</p>
                        <p className="text-xs font-bold text-gray-900">{selectedPro.currentJob.customerName}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{selectedPro.currentJob.location || 'Location unavailable'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveTracking;

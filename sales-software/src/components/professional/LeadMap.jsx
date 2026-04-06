import React, { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Clock, MapPin, Navigation, Route } from 'lucide-react';

const LeadMap = ({ leads = [], currentUser, onAction, className = '' }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const leadMarkersRef = useRef({});
    const routeTimerRef = useRef(null);
    const [selectedLead, setSelectedLead] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [mapError, setMapError] = useState('');
    const [tokenInput, setTokenInput] = useState('');
    const [activeMapToken, setActiveMapToken] = useState(() => {
        const fromEnv = import.meta.env.VITE_MAPBOX_TOKEN;
        const fromLocal = localStorage.getItem('VITE_MAPBOX_TOKEN');
        return fromEnv || fromLocal || '';
    });

    const mappedLeads = useMemo(
        () =>
            (leads || [])
                .filter((l) => typeof l.latitude === 'number' && typeof l.longitude === 'number')
                .map((l) => ({
                    ...l,
                    customerName: l.customerName || l.guestName || 'Customer',
                    serviceCategory: l.serviceCategory || l.category?.name || 'Service',
                })),
        [leads]
    );

    const nextJobs = useMemo(
        () =>
            [...mappedLeads]
                .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
                .slice(0, 5),
        [mappedLeads]
    );

    useEffect(() => {
        if (!selectedLead?.id) return;
        const fresh = mappedLeads.find((l) => l.id === selectedLead.id);
        if (fresh) setSelectedLead(fresh);
    }, [mappedLeads, selectedLead?.id]);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;
        const token = activeMapToken;
        if (!token) {
            setMapError('VITE_MAPBOX_TOKEN missing. Add token to enable live job map.');
            return;
        }

        mapboxgl.accessToken = token;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [77.1025, 28.7041],
            zoom: 5
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

        Object.keys(leadMarkersRef.current).forEach((id) => {
            if (!mappedLeads.some((l) => l.id === id)) {
                leadMarkersRef.current[id].remove();
                delete leadMarkersRef.current[id];
            }
        });

        mappedLeads.forEach((lead) => {
            const marker = leadMarkersRef.current[lead.id];
            const lngLat = [lead.longitude, lead.latitude];
            if (marker) {
                marker.setLngLat(lngLat);
            } else {
                const el = document.createElement('div');
                const isActive = ['accepted', 'in progress', 'active', 'scheduled'].includes(
                    String(lead.status || '').toLowerCase()
                );
                el.className = `h-4 w-4 rounded-full border-2 border-white shadow ${
                    isActive ? 'bg-blue-600' : 'bg-slate-400'
                }`;

                const mk = new mapboxgl.Marker({ element: el })
                    .setLngLat(lngLat)
                    .setPopup(
                        new mapboxgl.Popup({ offset: 12 }).setHTML(
                            `<div style="font-size:12px"><b>${lead.customerName}</b><br/>${lead.serviceCategory}</div>`
                        )
                    )
                    .addTo(map);
                el.addEventListener('click', () => {
                    setSelectedLead(lead);
                    map.flyTo({ center: lngLat, zoom: 13, duration: 800 });
                });
                leadMarkersRef.current[lead.id] = mk;
            }
        });
    }, [mappedLeads]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || mappedLeads.length === 0) return;
        const bounds = new mapboxgl.LngLatBounds();
        mappedLeads.forEach((l) => bounds.extend([l.longitude, l.latitude]));
        map.fitBounds(bounds, { padding: 70, maxZoom: 13, duration: 900 });
    }, [mappedLeads.length]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !activeMapToken || !selectedLead) {
            if (map?.getLayer('pro-job-route')) map.removeLayer('pro-job-route');
            if (map?.getSource('pro-job-route')) map.removeSource('pro-job-route');
            setRouteInfo(null);
            return;
        }
        if (typeof currentUser?.lng !== 'number' || typeof currentUser?.lat !== 'number') {
            setRouteInfo(null);
            return;
        }

        const drawRoute = async () => {
            try {
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${currentUser.lng},${currentUser.lat};${selectedLead.longitude},${selectedLead.latitude}?geometries=geojson&overview=full&access_token=${activeMapToken}`;
                const res = await fetch(url);
                const data = await res.json();
                const route = data?.routes?.[0];
                if (!route?.geometry) return;

                const geojson = {
                    type: 'Feature',
                    geometry: route.geometry
                };

                if (map.getSource('pro-job-route')) {
                    map.getSource('pro-job-route').setData(geojson);
                } else {
                    map.addSource('pro-job-route', { type: 'geojson', data: geojson });
                    map.addLayer({
                        id: 'pro-job-route',
                        type: 'line',
                        source: 'pro-job-route',
                        layout: { 'line-join': 'round', 'line-cap': 'round' },
                        paint: {
                            'line-color': '#2563eb',
                            'line-width': 4,
                            'line-opacity': 0.9
                        }
                    });
                }

                const etaMins = Math.max(1, Math.round((route.duration || 0) / 60));
                const distanceKm = ((route.distance || 0) / 1000).toFixed(1);
                setRouteInfo({ etaMins, distanceKm });
            } catch (err) {
                console.warn('Professional route fetch failed:', err.message);
            }
        };

        drawRoute();
        if (routeTimerRef.current) clearInterval(routeTimerRef.current);
        routeTimerRef.current = setInterval(drawRoute, 20000);

        return () => {
            if (routeTimerRef.current) {
                clearInterval(routeTimerRef.current);
                routeTimerRef.current = null;
            }
        };
    }, [selectedLead?.id, selectedLead?.latitude, selectedLead?.longitude, currentUser?.lat, currentUser?.lng, activeMapToken]);

    return (
        <div className={`relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 ${className}`}>
            <div ref={mapContainerRef} className="absolute inset-0" />
            {mapError && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4 z-20">
                    <div className="max-w-md w-full space-y-3 text-center">
                        <p className="text-sm font-bold text-rose-600">{mapError}</p>
                        <input
                            type="text"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            placeholder="Paste Mapbox token (pk...)"
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

            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white/50 flex items-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Assigned Job Locations</span>
            </div>

            {nextJobs.length > 0 && (
                <div className="absolute top-4 right-4 w-72 max-h-[260px] overflow-y-auto bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-gray-100 p-3 z-10">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Next Jobs</p>
                    <div className="space-y-2">
                        {nextJobs.map((job) => (
                            <button
                                key={job.id}
                                onClick={() => {
                                    setSelectedLead(job);
                                    const map = mapRef.current;
                                    if (map) map.flyTo({ center: [job.longitude, job.latitude], zoom: 13, duration: 700 });
                                }}
                                className={`w-full text-left p-2.5 rounded-xl border transition ${
                                    selectedLead?.id === job.id ? 'bg-blue-50 border-blue-200' : 'border-gray-100 hover:bg-gray-50'
                                }`}
                            >
                                <p className="text-xs font-bold text-gray-900 truncate">{job.customerName}</p>
                                <p className="text-[10px] text-gray-500 truncate">{job.serviceCategory}</p>
                                <p className="text-[10px] text-gray-400 truncate">{job.location}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedLead && (
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[360px] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-10">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                            <p className="text-sm font-black text-gray-900">{selectedLead.customerName}</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{selectedLead.serviceCategory}</p>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase">{selectedLead.status}</span>
                    </div>

                    <div className="space-y-1 mb-3">
                        <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                            <MapPin size={12} className="text-gray-400" />
                            <span className="truncate">{selectedLead.location || 'Location unavailable'}</span>
                        </p>
                        {routeInfo && (
                            <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1.5">
                                <Route size={12} />
                                <span>{routeInfo.distanceKm} km · ETA {routeInfo.etaMins} min</span>
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onAction?.('view', selectedLead)}
                            className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                        >
                            View
                        </button>
                        <button
                            onClick={() => onAction?.('contact', selectedLead)}
                            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100"
                            title="Contact"
                        >
                            <Navigation size={14} />
                        </button>
                        <button
                            onClick={() => onAction?.('start', selectedLead)}
                            className="px-3 py-2 bg-green-50 text-green-600 rounded-xl border border-green-100"
                            title="Start"
                        >
                            <Clock size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadMap;

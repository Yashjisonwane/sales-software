import React, { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Clock, MapPin, Navigation } from 'lucide-react';

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
const DEFAULT_CENTER = [77.4126, 23.2599];
const MOVE_ANIMATION_MS = 850;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

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

const LeadMap = ({ leads = [], onAction, className = '' }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const leadMarkersRef = useRef({});
    const [selectedLead, setSelectedLead] = useState(null);
    const [isAutoFollowEnabled, setIsAutoFollowEnabled] = useState(true);

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
        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: MAP_STYLE,
            center: DEFAULT_CENTER,
            zoom: 5
        });
        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.on('dragstart', () => setIsAutoFollowEnabled(false));
        mapRef.current = map;

        return () => {
            Object.values(leadMarkersRef.current).forEach((m) => m?.remove());
            leadMarkersRef.current = {};
            map.remove();
            mapRef.current = null;
        };
    }, []);

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
                const current = marker.getLngLat();
                animateMarkerTo(marker, [current.lng, current.lat], lngLat);
            } else {
                const el = document.createElement('div');
                const isActive = ['accepted', 'in progress', 'active', 'scheduled'].includes(
                    String(lead.status || '').toLowerCase()
                );
                el.className = `h-4 w-4 rounded-full border-2 border-white shadow ${
                    isActive ? 'bg-blue-600' : 'bg-slate-400'
                }`;

                const mk = new maplibregl.Marker({ element: el })
                    .setLngLat(lngLat)
                    .setPopup(
                        new maplibregl.Popup({ offset: 12 }).setHTML(
                            `<div style="font-size:12px"><b>${lead.customerName}</b><br/>${lead.serviceCategory}<br/>${lead.latitude.toFixed(5)}, ${lead.longitude.toFixed(5)}</div>`
                        )
                    )
                    .addTo(map);
                el.addEventListener('click', () => {
                    setSelectedLead(lead);
                    if (isAutoFollowEnabled) map.flyTo({ center: lngLat, zoom: 13, duration: 800 });
                });
                leadMarkersRef.current[lead.id] = mk;
            }
        });
    }, [mappedLeads, isAutoFollowEnabled]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || mappedLeads.length === 0) return;
        const bounds = new maplibregl.LngLatBounds();
        mappedLeads.forEach((l) => bounds.extend([l.longitude, l.latitude]));
        map.fitBounds(bounds, { padding: 70, maxZoom: 13, duration: 900 });
    }, [mappedLeads]);

    return (
        <div className={`relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 ${className}`}>
            <div ref={mapContainerRef} className="absolute inset-0" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white/50 flex items-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Assigned Job Locations</span>
            </div>
            <button
                onClick={() => setIsAutoFollowEnabled((v) => !v)}
                className="absolute top-4 right-4 px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-100 bg-white/95 text-blue-600 z-10"
            >
                {isAutoFollowEnabled ? 'Following' : 'Follow Off'}
            </button>

            {nextJobs.length > 0 && (
                <div className="absolute top-16 right-4 w-72 max-h-[260px] overflow-y-auto bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-gray-100 p-3 z-10">
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

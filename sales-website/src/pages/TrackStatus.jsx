import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  CheckCircle2, Clock, MapPin, Phone, MessageSquare, 
  ChevronRight, Star, Send, ShieldCheck, Zap, X, User,
  ArrowLeft, Search, Loader2
} from 'lucide-react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../apiConfig';

const socketUrl = API_BASE_URL.replace('/api/v1', '');
const TRACK_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const RASTER_FALLBACK_STYLE = {
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors'
        }
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
};
const POLL_INTERVAL_MS = 7000;
const MARKER_MOVE_MS = 900;
const ROUTE_REFRESH_MS = 8000;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const toNum = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const parsed = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(parsed) ? parsed : null;
};

const animateMarker = (marker, from, to) => {
    const [fromLng, fromLat] = from;
    const [toLng, toLat] = to;
    if (![fromLng, fromLat, toLng, toLat].every(Number.isFinite)) {
        marker.setLngLat([toLng, toLat]);
        return;
    }
    const start = performance.now();
    const step = (now) => {
        const raw = Math.min((now - start) / MARKER_MOVE_MS, 1);
        const t = easeOutCubic(raw);
        marker.setLngLat([fromLng + (toLng - fromLng) * t, fromLat + (toLat - fromLat) * t]);
        if (raw < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};

const haversineKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const TrackStatus = () => {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);
    const [isReviewed, setIsReviewed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const socketRef = useRef();
    const messagesEndRef = useRef();
    const trackSocketRef = useRef();
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const popupRef = useRef(null);
    const lastMoveAtRef = useRef(0);
    const [liveLocation, setLiveLocation] = useState(null);
    const [customerLocation, setCustomerLocation] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [isArrived, setIsArrived] = useState(false);
    const [mapLoadError, setMapLoadError] = useState('');

    useEffect(() => {
        if (data?.isReviewed) setIsReviewed(true);
    }, [data?.isReviewed]);

    const handleReviewSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsReviewing(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/guest/review`, {
                sessionToken: token,
                rating: reviewRating,
                comment: reviewComment
            });
            if (res.data.success) {
                setIsReviewed(true);
            }
        } catch (err) {
            console.error("Review error", err);
            alert("Could not submit review. Please try again.");
        } finally {
            setIsReviewing(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/guest/track/${token}`);
                setData(res.data.data);
                const nextLat = toNum(res.data?.data?.worker?.liveLat);
                const nextLng = toNum(res.data?.data?.worker?.liveLng);
                if (Number.isFinite(nextLat) && Number.isFinite(nextLng)) {
                    setLiveLocation((prev) => {
                        if (prev && prev.lat === nextLat && prev.lng === nextLng) return prev;
                        return { lat: nextLat, lng: nextLng };
                    });
                }
                const customerLat = toNum(res.data?.data?.customerLat);
                const customerLng = toNum(res.data?.data?.customerLng);
                if (Number.isFinite(customerLat) && Number.isFinite(customerLng)) {
                    setCustomerLocation((prev) => {
                        if (prev && prev.lat === customerLat && prev.lng === customerLng) return prev;
                        return { lat: customerLat, lng: customerLng };
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error("Track Error:", err);
                setError('Could not find request. Link might be expired.');
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        if (!token) return undefined;
        trackSocketRef.current = io(socketUrl, { query: { sessionToken: token } });
        trackSocketRef.current.on('connect', () => {
            if (data?.jobId) {
                trackSocketRef.current.emit('join_room', data.jobId);
            }
        });
        const onLiveLocation = (payload) => {
            const p = payload?.professional || payload;
            const lat = toNum(p?.liveLat);
            const lng = toNum(p?.liveLng);
            const workerId = p?.id || p?.professionalId;
            const activeWorkerId = data?.worker?.id;
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
            if (activeWorkerId && workerId && String(activeWorkerId) !== String(workerId)) return;
            setLiveLocation((prev) => {
                if (prev && prev.lat === lat && prev.lng === lng) return prev;
                return { lat, lng };
            });
        };
        const onArrived = () => {
            setIsArrived(true);
        };
        trackSocketRef.current.on('update_on_map', onLiveLocation);
        trackSocketRef.current.on('professional_location_update', onLiveLocation);
        trackSocketRef.current.on('professional_arrived', onArrived);
        return () => {
            if (trackSocketRef.current) {
                trackSocketRef.current.off('update_on_map', onLiveLocation);
                trackSocketRef.current.off('professional_location_update', onLiveLocation);
                trackSocketRef.current.off('professional_arrived', onArrived);
                trackSocketRef.current.disconnect();
                trackSocketRef.current = null;
            }
        };
    }, [token, data?.worker?.id, data?.jobId]);

    useEffect(() => {
        if (trackSocketRef.current && data?.jobId) {
            trackSocketRef.current.emit('join_room', data.jobId);
        }
    }, [data?.jobId]);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current || !liveLocation) return;
        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: TRACK_STYLE_URL,
            center: [liveLocation.lng, liveLocation.lat],
            zoom: 14
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        map.on('error', () => {
            if (!mapLoadError) {
                setMapLoadError('Primary map style unavailable, using fallback map.');
                map.setStyle(RASTER_FALLBACK_STYLE);
            }
        });
        mapRef.current = map;

        const el = document.createElement('div');
        el.innerHTML = `
            <div style="
                width:30px;height:30px;border-radius:9999px;background:#7C3AED;border:2px solid #fff;
                display:flex;align-items:center;justify-content:center;color:#fff;
                box-shadow:0 6px 14px rgba(0,0,0,0.25);
                overflow:hidden;
            ">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8" r="3.25" fill="#ffffff"></circle>
                    <path d="M6.5 19c0-3 2.35-5 5.5-5s5.5 2 5.5 5" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></path>
                </svg>
            </div>
        `;
        markerRef.current = new maplibregl.Marker({ element: el })
            .setLngLat([liveLocation.lng, liveLocation.lat])
            .addTo(map);
        popupRef.current = new maplibregl.Popup({ offset: 12 });

        return () => {
            markerRef.current?.remove();
            markerRef.current = null;
            popupRef.current?.remove();
            popupRef.current = null;
            map.remove();
            mapRef.current = null;
        };
    }, [liveLocation]);

    useEffect(() => {
        const map = mapRef.current;
        const marker = markerRef.current;
        if (!map || !marker || !liveLocation) return;
        const current = marker.getLngLat();
        const next = [liveLocation.lng, liveLocation.lat];
        animateMarker(marker, [current.lng, current.lat], next);
        const now = Date.now();
        if (now - lastMoveAtRef.current > POLL_INTERVAL_MS) {
            map.easeTo({ center: next, duration: 800, essential: true });
            lastMoveAtRef.current = now;
        }
        const workerName = data?.worker?.name || 'Professional';
        marker.setPopup(
            popupRef.current.setHTML(
                `<div style="font-size:12px"><b>${workerName}</b><br/>${liveLocation.lat.toFixed(5)}, ${liveLocation.lng.toFixed(5)}</div>`
            )
        );
    }, [liveLocation, data?.worker?.name]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !liveLocation || !customerLocation) return;
        let cancelled = false;

        const drawRoute = async () => {
            try {
                const routeRes = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${liveLocation.lng},${liveLocation.lat};${customerLocation.lng},${customerLocation.lat}?overview=full&geometries=geojson`
                );
                const routeJson = await routeRes.json();
                const route = routeJson?.routes?.[0];
                if (!route || cancelled) return;

                const geojson = {
                    type: 'Feature',
                    geometry: route.geometry
                };
                if (map.getSource('pro-to-customer-route')) {
                    map.getSource('pro-to-customer-route').setData(geojson);
                } else {
                    map.addSource('pro-to-customer-route', { type: 'geojson', data: geojson });
                    map.addLayer({
                        id: 'pro-to-customer-route',
                        type: 'line',
                        source: 'pro-to-customer-route',
                        layout: { 'line-join': 'round', 'line-cap': 'round' },
                        paint: {
                            'line-color': '#7C3AED',
                            'line-width': 4,
                            'line-opacity': 0.85
                        }
                    });
                }

                const distanceKm = (route.distance || 0) / 1000;
                const etaMins = Math.max(1, Math.round((route.duration || 0) / 60));
                setRouteInfo({
                    distanceKm: distanceKm.toFixed(2),
                    etaMins
                });

                if (haversineKm(liveLocation.lat, liveLocation.lng, customerLocation.lat, customerLocation.lng) <= 0.1) {
                    setIsArrived(true);
                }
            } catch {
                const fallbackKm = haversineKm(liveLocation.lat, liveLocation.lng, customerLocation.lat, customerLocation.lng);
                setRouteInfo({
                    distanceKm: fallbackKm.toFixed(2),
                    etaMins: Math.max(1, Math.round((fallbackKm / 25) * 60))
                });
                if (fallbackKm <= 0.1) setIsArrived(true);
            }
        };

        drawRoute();
        const routeTimer = setInterval(drawRoute, ROUTE_REFRESH_MS);
        return () => {
            cancelled = true;
            clearInterval(routeTimer);
        };
    }, [liveLocation, customerLocation]);

    useEffect(() => {
        if (data?.chatId && isChatOpen) {
            socketRef.current = io(socketUrl, {
                query: { sessionToken: token }
            });

            socketRef.current.on('connect', () => {
                socketRef.current.emit("join_chat", data.jobId);
                socketRef.current.emit("join_room", data.jobId);
            });

            const appendMsg = (msg) => {
                if (!msg?.id) return;
                setMessages((prev) => (prev.some((p) => p.id === msg.id) ? prev : [...prev, msg]));
            };

            socketRef.current.on("new_message", appendMsg);
            socketRef.current.on("receive_message", appendMsg);

            // Fetch history - Backend updated to allow sessionToken bypass
            axios.get(`${API_BASE_URL}/chats/${data.chatId}/messages`, {
                params: { sessionToken: token }
            }).then(res => {
                if (res.data.success) setMessages(res.data.data);
            }).catch(e => console.error("History error", e));

            return () => {
                if (socketRef.current) socketRef.current.disconnect();
            };
        }
    }, [data?.chatId, isChatOpen, token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !socketRef.current) return;
        
        socketRef.current.emit("send_message", {
            requestId: data.jobId,
            jobId: data.jobId,
            chatId: data.chatId,
            text: newMessage
        });
        setNewMessage('');
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#7C3AED] animate-spin mb-4" />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C3AED]">Synchronizing Data...</div>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mb-6">
                <X size={40} />
            </div>
            <h1 className="text-2xl font-black text-[#111827] mb-2">Request Not Found</h1>
            <p className="text-gray-500 max-w-xs mb-8">{error || 'The link you followed seems to be invalid.'}</p>
            <Link to="/request" className="bg-[#111827] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">New Request</Link>
        </div>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-500';
            case 'ASSIGNED':
            case 'SCHEDULED': return 'bg-[#7C3AED]';
            case 'STARTED':
            case 'IN_PROGRESS': return 'bg-orange-500';
            case 'COMPLETED': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-[#FCFCFD] min-h-screen pt-24 pb-20">
            <div className="max-w-xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/" className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </Link>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Request #{data.displayId}</div>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                {/* Status Card */}
                <div className="bg-[#111827] rounded-[2.5rem] p-8 mb-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-all duration-700">
                        <Zap size={120} className="text-white" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor(data.status)}`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Live Status</span>
                        </div>
                        
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
                            {data.status === 'OPEN' ? 'Finding a Pro...' : 
                             data.status === 'COMPLETED' ? 'Work Completed!' : 
                             'Service Scheduled'}
                        </h2>
                        
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            {data.status === 'OPEN' && "We've notified 12+ verified professionals in your area. Hang tight!"}
                            {data.status === 'ASSIGNED' && `Your expert is confirmed. Track details below.`}
                            {data.status === 'COMPLETED' && "Expert has marked the work as finished. Hope you're happy!"}
                        </p>
                    </div>
                </div>

                {/* Tracking Details */}
                <div className="space-y-4 mb-8">
                    {/* Worker Info */}
                    {data.worker ? (
                        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-200">
                                    <User size={30} />
                                </div>
                                <div>
                                    <h4 className="font-black text-[#111827] text-lg leading-tight">{data.worker.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex text-orange-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} fill={i < Math.floor(data.worker.rating) ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{data.worker.rating.toFixed(1)} Rating</span>
                                    </div>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <a href={`tel:${data.worker.phone}`} className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-[#7C3AED] hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                                        <Phone size={20} />
                                    </a>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setIsChatOpen(true)}
                                className="w-full bg-[#7C3AED] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-purple-100 hover:bg-[#6D28D9] transition-all"
                            >
                                <MessageSquare size={18} />
                                Chat with {data.worker.name.split(' ')[0]}
                            </button>

                            {liveLocation && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin size={14} className="text-[#7C3AED]" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#111827]">Track Professional</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl px-3 py-2">
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Distance</p>
                                            <p className="text-xs font-black text-[#111827]">{routeInfo?.distanceKm || '--'} km</p>
                                        </div>
                                        <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl px-3 py-2">
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">ETA</p>
                                            <p className="text-xs font-black text-[#111827]">{routeInfo?.etaMins || '--'} min</p>
                                        </div>
                                    </div>
                                    {!customerLocation && (
                                        <div className="mb-3 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-amber-700">
                                            Customer coordinates unavailable for this request
                                        </div>
                                    )}
                                    {isArrived && (
                                        <div className="mb-3 rounded-xl bg-green-50 border border-green-100 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-green-700">
                                            Professional has arrived
                                        </div>
                                    )}
                                    {mapLoadError && (
                                        <div className="mb-3 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-blue-700">
                                            {mapLoadError}
                                        </div>
                                    )}
                                    <div className="w-full h-[200px] rounded-2xl overflow-hidden border border-gray-100">
                                        <div ref={mapContainerRef} className="w-full h-full" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#7C3AED] mx-auto mb-4 animate-pulse">
                                <Clock size={30} />
                            </div>
                            <h4 className="font-black text-[#111827] text-sm uppercase tracking-widest mb-1">Assigning Expert</h4>
                            <p className="text-gray-400 text-xs font-medium">Average matching time: 5-8 mins</p>
                        </div>
                    )}

                    {/* Progress Steps */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                         <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                            {[
                                { lab: 'Request Received', desc: 'System logged your lead successfully.', active: true },
                                { lab: 'Finding Professionals', desc: 'Transmitting lead to local experts.', active: data.status === 'OPEN' },
                                { lab: 'Expert Assigned', desc: 'Expert is assigned to your location.', active: ['ASSIGNED', 'SCHEDULED', 'STARTED', 'COMPLETED'].includes(data.status) },
                                { lab: 'Service Complete', desc: 'Work finished and verified.', active: data.status === 'COMPLETED' }
                            ].map((step, idx) => (
                                <div key={idx} className="flex gap-6 relative">
                                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 flex items-center justify-center ${step.active ? (data.status === 'COMPLETED' && idx===3 ? 'bg-green-500' : 'bg-[#7C3AED]') : 'bg-gray-200'}`}>
                                        {step.active && <CheckCircle2 size={10} className="text-white" />}
                                    </div>
                                    <div>
                                        <h5 className={`text-xs font-black uppercase tracking-widest mb-1 ${step.active ? 'text-[#111827]' : 'text-gray-300'}`}>{step.lab}</h5>
                                        <p className="text-gray-400 text-[10px] leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Review Section (Only when Completed) */}
                {data.status === 'COMPLETED' && !isReviewed && (
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl mb-6 animate-in slide-in-from-bottom-5">
                       <h4 className="font-black text-[#111827] text-lg mb-2">How was your experience?</h4>
                       <p className="text-gray-400 text-xs mb-6 font-medium">Your feedback helps us maintain professional standards.</p>
                       
                       <div className="flex gap-2 justify-center mb-8">
                           {[1, 2, 3, 4, 5].map(star => (
                               <button 
                                   key={star} 
                                   onClick={() => setReviewRating(star)}
                                   className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${reviewRating >= star ? 'bg-orange-50 text-orange-400' : 'bg-gray-50 text-gray-300'}`}
                               >
                                   <Star size={24} fill={reviewRating >= star ? 'currentColor' : 'none'} strokeWidth={2.5} />
                               </button>
                           ))}
                       </div>

                       <textarea 
                           placeholder="Tell us more about the service..."
                           value={reviewComment}
                           onChange={(e) => setReviewComment(e.target.value)}
                           className="w-full bg-[#F9FAFB] border border-[#F3F4F6] rounded-2xl p-4 text-sm font-medium outline-none focus:bg-white focus:border-[#7C3AED] transition-all resize-none min-h-[100px] mb-6"
                       />

                       <button 
                           disabled={isReviewing}
                           onClick={handleReviewSubmit}
                           className="w-full bg-[#111827] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50"
                       >
                           {isReviewing ? 'Submitting...' : 'Post Review'}
                       </button>
                    </div>
                )}

                {isReviewed && data.status === 'COMPLETED' && (
                    <div className="bg-green-50 rounded-[2rem] p-8 border border-green-100 shadow-sm mb-6 text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-4 shadow-sm">
                            <CheckCircle2 size={30} />
                        </div>
                        <h4 className="font-black text-green-800 text-sm uppercase tracking-widest mb-1">Review Shared!</h4>
                        <p className="text-green-600/70 text-[10px] font-bold">Thank you for your valuable feedback.</p>
                    </div>
                )}

                {/* Safety Badge */}
                <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-3xl p-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-green-600">Secure Service</div>
                        <p className="text-[10px] font-bold text-gray-500 leading-tight">All professionals are background checked & verified by our safety team.</p>
                    </div>
                </div>
            </div>

            {/* Chat Drawer / Overlay */}
            {isChatOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg h-[90vh] sm:h-[80vh] sm:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
                        {/* Chat Header */}
                        <div className="bg-[#111827] p-6 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-widest">{data.worker?.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Box */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#7C3AED] mb-4 shadow-sm">
                                        <MessageSquare size={30} />
                                    </div>
                                    <h4 className="font-black text-[#111827] text-sm uppercase tracking-widest mb-2">Private Secure Chat</h4>
                                    <p className="text-gray-400 text-[10px] leading-relaxed">
                                        You are now connected with your expert. Feel free to ask about their ETA or service details.
                                    </p>
                                </div>
                            ) : (
                                messages.map((m, i) => (
                                    <div key={m.id || `m-${i}`} className={`flex ${m.isGuest ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] px-5 py-3.5 rounded-[1.5rem] shadow-sm text-sm font-medium ${
                                            m.isGuest 
                                                ? 'bg-[#7C3AED] text-white rounded-tr-none' 
                                                : 'bg-white text-[#111827] border border-gray-100 rounded-tl-none'
                                        }`}>
                                            {m.text}
                                            <div className={`text-[8px] font-black uppercase mt-1.5 opacity-50 ${m.isGuest ? 'text-right' : 'text-left'}`}>
                                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-6 bg-white border-t border-gray-100">
                            <form onSubmit={handleSend} className="flex gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-[#7C3AED] transition-all font-medium text-sm"
                                />
                                <button 
                                    type="submit"
                                    className="w-14 h-14 bg-[#7C3AED] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 active:scale-95 transition-all"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackStatus;

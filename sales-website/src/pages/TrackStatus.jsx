import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle2, Clock, MapPin, Phone, MessageSquare, 
  ChevronRight, Star, Send, ShieldCheck, Zap, X, User,
  ArrowLeft, Search, Loader2
} from 'lucide-react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../apiConfig';

const socketUrl = API_BASE_URL.replace('/api/v1', '');

const TrackStatus = () => {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const socketRef = useRef();
    const messagesEndRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/guest/track/${token}`);
                setData(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Track Error:", err);
                setError('Could not find request. Link might be expired.');
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 15000); 
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        if (data?.chatId && isChatOpen) {
            socketRef.current = io(socketUrl, {
                query: { sessionToken: token }
            });

            socketRef.current.on('connect', () => {
                socketRef.current.emit("join_chat", data.jobId);
            });

            socketRef.current.on("new_message", (msg) => {
                setMessages(prev => [...prev, msg]);
            });

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
                                    <div key={i} className={`flex ${m.isGuest ? 'justify-end' : 'justify-start'}`}>
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

import React from 'react';
import { X, MapPin, Calendar, Clock, User, Phone, Mail, FileText, Check, MessageSquare } from 'lucide-react';

const LeadDetailModal = ({ isOpen, onClose, lead, onAction }) => {
    if (!isOpen || !lead) return null;

    const status = lead.assignmentStatus || lead.status;

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'open':
            case 'new':
            case 'sent': return 'bg-blue-100 text-blue-800';
            case 'viewed': return 'bg-indigo-100 text-indigo-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="px-5 md:px-10 py-5 md:py-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-gray-50/50 to-white shrink-0">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-600 text-white rounded-2xl md:rounded-[1.5rem] flex items-center justify-center font-black text-xl md:text-3xl shadow-xl shadow-blue-200 shrink-0 border-2 md:border-4 border-white">
                            {lead.customerName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg md:text-2xl font-black text-gray-900 leading-none truncate mb-1.5 md:mb-2">{lead.customerName}</h2>
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(status)}`}>
                                    {status}
                                </span>
                                <span className="text-[10px] md:text-xs font-bold text-gray-400 font-mono tracking-tighter">#{lead.leadNo || lead.id}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 md:p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 shrink-0"
                    >
                        <X size={20} className="md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-5 md:px-10 py-6 md:py-10 space-y-8 md:space-y-10 overflow-y-auto custom-scrollbar flex-1">
                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Job Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Job Information</h3>
                            <div className="bg-gray-50/50 p-4 md:p-6 rounded-[2rem] border border-gray-100 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-white rounded-xl border border-gray-100 text-blue-600 shadow-sm shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Category</p>
                                        <p className="text-sm md:text-base font-bold text-gray-900 truncate">{lead.serviceCategory}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-white rounded-xl border border-gray-100 text-blue-600 shadow-sm shrink-0">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Location</p>
                                        <p className="text-sm md:text-base font-bold text-gray-900 leading-tight">{lead.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-white rounded-xl border border-gray-100 text-blue-600 shadow-sm shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Preferred Date</p>
                                        <p className="text-sm md:text-base font-bold text-gray-900">{lead.preferredDate || 'As soon as possible'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Contact Section */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Customer Contact</h3>
                            <div className="bg-gray-50/50 p-4 md:p-6 rounded-[2rem] border border-gray-100 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-white rounded-xl border border-gray-100 text-emerald-600 shadow-sm shrink-0">
                                        <Phone size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                                        <p className="text-sm md:text-base font-bold text-gray-900">{lead.phone || '987-654-3210'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-white rounded-xl border border-gray-100 text-purple-600 shadow-sm shrink-0">
                                        <Mail size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Email Address</p>
                                        <p className="text-sm md:text-base font-bold text-gray-900 truncate">{lead.customerEmail || 'customer@example.com'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Job Description</h3>
                        <div className="bg-gray-50/50 p-6 md:p-8 rounded-[2rem] border border-gray-100 relative group transition-colors hover:bg-gray-50">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600/10 rounded-l-[2rem]"></div>
                            <p className="text-sm md:text-lg text-gray-700 leading-relaxed font-medium italic">
                                "{lead.description}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 md:px-10 py-6 md:py-8 bg-gray-50/80 border-t border-gray-100 shrink-0 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="order-2 md:order-1 px-8 py-3.5 font-bold text-gray-500 hover:text-gray-900 transition-colors text-sm md:text-base rounded-2xl hover:bg-gray-100/50 text-center"
                    >
                        Close
                    </button>

                    <div className="order-1 md:order-2 flex flex-col sm:flex-row gap-3">
                        {/* New Status Actions */}
                        {['open', 'sent', 'viewed', 'new'].includes(status?.toLowerCase()) && (
                            <>
                                <button
                                    onClick={() => { onAction('reject', lead); onClose(); }}
                                    className="flex-1 sm:flex-none px-6 py-3.5 bg-white border-2 border-red-50 text-red-600 rounded-2xl font-black text-xs md:text-sm hover:bg-red-50 hover:border-red-100 transition-all active:scale-[0.98] text-center"
                                >
                                    Reject Lead
                                </button>
                                <button
                                    onClick={() => { onAction('accept', lead); onClose(); }}
                                    className="flex-1 sm:flex-none px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs md:text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Check size={18} strokeWidth={3} />
                                    Accept Lead
                                </button>
                            </>
                        )}

                        {/* Accepted Status Actions */}
                        {status?.toLowerCase() === 'accepted' && (
                            <>
                                <button
                                    onClick={() => { onAction('contact', lead); onClose(); }}
                                    className="flex-1 sm:flex-none px-8 py-3.5 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-black text-xs md:text-sm hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={18} />
                                    Message
                                </button>
                                <button
                                    onClick={() => { onAction('start', lead); onClose(); }}
                                    className="flex-1 sm:flex-none px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs md:text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Start Job
                                </button>
                            </>
                        )}

                        {/* In Progress Status Actions */}
                        {status?.toLowerCase() === 'in progress' && (
                            <button
                                onClick={() => { onAction('complete', lead); onClose(); }}
                                className="w-full px-12 py-3.5 bg-green-600 text-white rounded-2xl font-black text-xs md:text-sm hover:bg-green-700 transition-all shadow-xl shadow-green-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Check size={18} strokeWidth={3} />
                                Mark Completed
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailModal;

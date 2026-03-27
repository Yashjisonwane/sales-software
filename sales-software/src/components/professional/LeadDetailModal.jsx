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

            <div className="relative bg-white w-full max-w-2xl rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-4 md:px-8 py-4 md:py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-600 text-white rounded-lg md:rounded-2xl flex items-center justify-center font-bold text-base md:text-xl shadow-lg shrink-0">
                            {lead.customerName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base md:text-xl font-black text-gray-900 leading-tight truncate">{lead.customerName}</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider ${getStatusColor(status)}`}>
                                    {status}
                                </span>
                                <span className="text-[10px] md:text-xs font-bold text-gray-400 font-mono">ID: #{lead.id}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 md:p-2 hover:bg-white rounded-lg md:rounded-xl transition-colors text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 shrink-0"
                    >
                        <X size={18} className="md:w-5 md:h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-4 md:px-8 py-4 md:py-8 space-y-4 md:space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-3 md:space-y-4">
                            <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest px-1">Job Information</h3>
                            <div className="bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 space-y-3 md:space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 md:p-2 bg-white rounded-lg border border-gray-100 text-blue-600 shrink-0">
                                        <FileText size={14} className="md:w-4 md:h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Service Category</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900 truncate">{lead.serviceCategory}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 md:p-2 bg-white rounded-lg border border-gray-100 text-blue-600 shrink-0">
                                        <MapPin size={14} className="md:w-4 md:h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Location</p>
                                        <p className="text-base md:text-lg font-bold text-gray-900 line-clamp-2">{lead.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 md:p-2 bg-white rounded-lg border border-gray-100 text-blue-600 shrink-0">
                                        <Calendar size={14} className="md:w-4 md:h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Preferred Date</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900">{lead.preferredDate || 'As soon as possible'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest px-1">Customer Contact</h3>
                            <div className="bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 space-y-3 md:space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 md:p-2 bg-white rounded-lg border border-gray-100 text-blue-600 shrink-0">
                                        <Phone size={14} className="md:w-4 md:h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900">{lead.phone || '987-654-3210'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 md:p-2 bg-white rounded-lg border border-gray-100 text-blue-600 shrink-0">
                                        <Mail size={14} className="md:w-4 md:h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900 truncate">{lead.customerEmail || 'customer@example.com'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3 md:space-y-4">
                        <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest px-1">Job Description</h3>
                        <div className="bg-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100">
                            <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-medium italic">
                                "{lead.description}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-4 md:px-8 py-4 md:py-6 bg-gray-50/80 border-t border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-4">
                    <button
                        onClick={onClose}
                        className="order-2 md:order-1 px-6 py-2 md:py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors text-sm md:text-base text-center"
                    >
                        Close
                    </button>

                    <div className="order-1 md:order-2 flex flex-col sm:flex-row gap-2 md:gap-3">
                        {/* NEW / OPEN / SENT / VIEWED → Accept + Reject */}
                        {['open', 'sent', 'viewed', 'new'].includes(status?.toLowerCase()) && (
                            <>
                                <button
                                    onClick={() => { onAction('reject', lead); onClose(); }}
                                    className="px-4 md:px-6 py-2.5 md:py-3 bg-white border border-red-200 text-red-600 rounded-lg md:rounded-xl font-black text-[10px] md:text-sm hover:bg-red-50 transition-all shadow-sm active:scale-95 text-center"
                                >
                                    Reject Lead
                                </button>
                                <button
                                    onClick={() => { onAction('accept', lead); onClose(); }}
                                    className="px-6 md:px-10 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl font-black text-[10px] md:text-sm hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Check size={16} strokeWidth={3} />
                                    Accept Lead
                                </button>
                            </>
                        )}

                        {/* ACCEPTED → Message Customer + Start Job */}
                        {status?.toLowerCase() === 'accepted' && (
                            <>
                                <button
                                    onClick={() => { onAction('contact', lead); onClose(); }}
                                    className="px-6 py-2.5 md:py-3 bg-white border border-gray-200 text-gray-700 rounded-lg md:rounded-xl font-black text-xs md:text-sm hover:bg-gray-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={16} md:size={18} />
                                    Message
                                </button>
                                <button
                                    onClick={() => { onAction('start', lead); onClose(); }}
                                    className="px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg md:rounded-xl font-black text-xs md:text-sm hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Start Job
                                </button>
                            </>
                        )}

                        {/* IN PROGRESS → Mark Completed */}
                        {status?.toLowerCase() === 'in progress' && (
                            <button
                                onClick={() => { onAction('complete', lead); onClose(); }}
                                className="px-6 py-2.5 md:py-3 bg-green-600 text-white rounded-lg md:rounded-xl font-black text-xs md:text-sm hover:bg-green-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Check size={16} md:size={18} strokeWidth={3} />
                                Mark Completed
                            </button>
                        )}

                        {/* REJECTED / COMPLETED → no action buttons, close only */}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeadDetailModal;

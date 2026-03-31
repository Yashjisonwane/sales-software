import React from 'react';
import { X, MapPin, Calendar, Clock, User, Phone, Mail, FileText, Check, MessageSquare } from 'lucide-react';

const LeadDetailModal = ({ isOpen, onClose, lead, onAction }) => {
    if (!isOpen || !lead) return null;

    const status = (lead.assignmentStatus || lead.status || '').toLowerCase();

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'open':
            case 'new':
            case 'sent': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'viewed': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'in progress':
            case 'active':
            case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'completed':
            case 'closed': return 'bg-gray-50 text-gray-500 border-gray-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-inner" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-lg max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col border border-gray-100">
                {/* Header */}
                <div className="px-6 py-4 md:py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-lg md:text-xl shadow-lg shadow-blue-100 shrink-0 border-2 border-white">
                            {lead.customerName?.charAt(0) || 'C'}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm md:text-base font-black text-gray-900 leading-none truncate mb-1">{lead.customerName}</h2>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${getStatusColor(status)}`}>
                                    {status}
                                </span>
                                <span className="text-[9px] font-bold text-gray-300 font-mono tracking-tighter">#{lead.leadNo || lead.id}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100 shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5 md:py-6 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/20">
                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 gap-5">
                        {/* Job Information Section */}
                        <div className="space-y-3">
                            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Job Information</h3>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-blue-600 shrink-0">
                                        <FileText size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Category</p>
                                        <p className="text-[13px] font-bold text-gray-800 truncate">{lead.serviceCategory}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-blue-600 shrink-0">
                                        <MapPin size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Location</p>
                                        <p className="text-[13px] font-bold text-gray-800 leading-tight">{lead.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-blue-600 shrink-0">
                                        <Clock size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Preferred Date</p>
                                        <p className="text-[13px] font-bold text-gray-800">{lead.preferredDate || 'As soon as possible'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Contact Section */}
                        <div className="space-y-3">
                            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Customer Contact</h3>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-600 shrink-0">
                                        <Phone size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Phone Number</p>
                                        <a href={`tel:${lead.customerPhone || lead.phone}`} className="text-[13px] font-bold text-gray-800 hover:text-blue-600 transition-colors">
                                            {lead.customerPhone || lead.phone || 'Not Provided'}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 text-blue-600 shrink-0">
                                        <Mail size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 leading-none">Email Address</p>
                                        <p className="text-[13px] font-bold text-gray-800 truncate">{lead.customerEmail || 'Not Provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-3">
                        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Job Details</h3>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 relative shadow-sm">
                            <div className="space-y-3">
                                {lead.servicePlan && (
                                    <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-100 text-[8px] font-black uppercase tracking-widest">
                                        Plan: {lead.servicePlan}
                                    </div>
                                )}
                                <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium italic">
                                    "{lead.description || 'No specific description provided.'}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 md:py-5 bg-white border-t border-gray-100 shrink-0 flex items-center justify-between gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 font-black text-gray-400 hover:text-gray-900 transition-colors text-[11px] uppercase tracking-widest rounded-xl hover:bg-gray-50"
                    >
                        Close
                    </button>

                    <div className="flex items-center gap-2">
                        {/* New Status Actions */}
                        {['open', 'sent', 'viewed', 'new'].includes(status) && (
                            <>
                                <button
                                    onClick={() => { onAction('reject', lead); onClose(); }}
                                    className="px-4 py-3 bg-gray-50 text-rose-600 border border-rose-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => { onAction('accept', lead); onClose(); }}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Check size={14} strokeWidth={3} />
                                    Accept
                                </button>
                            </>
                        )}

                        {/* Accepted Status Actions */}
                        {status === 'accepted' && (
                            <>
                                <div className="flex gap-1.5 mr-2">
                                    <a
                                        href={`tel:${lead.customerPhone || lead.phone}`}
                                        className="h-11 w-11 flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl active:scale-90 transition-all shadow-sm"
                                        title="Call"
                                    >
                                        <Phone size={18} />
                                    </a>
                                    <button
                                        onClick={() => { onAction('contact', lead); onClose(); }}
                                        className="h-11 w-11 flex items-center justify-center bg-blue-50 text-blue-700 border border-blue-100 rounded-xl active:scale-90 transition-all shadow-sm"
                                        title="Message"
                                    >
                                        <MessageSquare size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => { onAction('start', lead); onClose(); }}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                                >
                                    Start Job
                                </button>
                            </>
                        )}

                        {/* In Progress Status Actions */}
                        {['in progress', 'active', 'in_progress'].includes(status) && (
                            <>
                                <div className="flex gap-1.5 mr-2">
                                    <a
                                        href={`tel:${lead.customerPhone || lead.phone}`}
                                        className="h-11 w-11 flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl active:scale-90 transition-all shadow-sm"
                                        title="Call"
                                    >
                                        <Phone size={18} />
                                    </a>
                                    <button
                                        onClick={() => { onAction('contact', lead); onClose(); }}
                                        className="h-11 w-11 flex items-center justify-center bg-blue-50 text-blue-700 border border-blue-100 rounded-xl active:scale-90 transition-all shadow-sm"
                                        title="Message"
                                    >
                                        <MessageSquare size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => { onAction('complete', lead); onClose(); }}
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Check size={16} strokeWidth={3} />
                                    Complete Work
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailModal;

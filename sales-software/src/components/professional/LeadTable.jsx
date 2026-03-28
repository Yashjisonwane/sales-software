import React from 'react';
import { Eye, Check, X, MessageSquare } from 'lucide-react';

const LeadTable = ({ leads, onAction }) => {
    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'sent':
            case 'new':
            case 'open':
            case 'viewed': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'closed':
            case 'completed': return 'bg-gray-50 text-gray-500 border-gray-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="bg-transparent md:bg-white md:rounded-[2rem] md:shadow-sm md:border md:border-gray-100 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="min-w-[900px] w-full divide-y divide-gray-100">
                    <thead className="bg-gray-100/30">
                        <tr>
                            <th className="px-4 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lead ID</th>
                            <th className="px-4 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Service</th>
                            <th className="hidden xl:table-cell px-4 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</th>
                            <th className="hidden lg:table-cell px-4 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">View</th>
                            <th className="px-4 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {leads.map((lead) => {
                            const statusVal = lead.assignmentStatus || lead.status || '';
                            const status = statusVal.toLowerCase();
                            const isNew = ['new', 'open', 'sent', 'viewed'].includes(status);
                            const isAccepted = status === 'accepted';

                            const displayName = lead.customerName || 'Customer';
                            const displayLocation = lead.location || 'Not Specified';

                            return (
                                <tr key={lead.id} className="hover:bg-blue-50/20 transition-all duration-200 group">
                                    <td className="px-4 py-5 whitespace-nowrap text-sm font-bold text-gray-900">#{lead.leadNo || lead.id}</td>
                                    <td className="px-4 py-5 whitespace-nowrap text-sm font-semibold text-gray-700">
                                        <div className="max-w-[150px] truncate">{displayName}</div>
                                    </td>
                                    <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">{lead.serviceCategory}</td>
                                    <td className="hidden xl:table-cell px-4 py-5 whitespace-nowrap text-sm font-medium text-gray-500">
                                        <div className="max-w-[180px] truncate">{displayLocation}</div>
                                    </td>
                                    <td className="hidden lg:table-cell px-4 py-5 whitespace-nowrap text-xs text-gray-400 font-bold">{new Date(lead.dateRequested).toLocaleDateString()}</td>
                                    <td className="px-4 py-5 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(statusVal)}`}>
                                            {isNew ? 'New' : (status === 'completed' || status === 'closed' ? 'Closed' : statusVal)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 whitespace-nowrap text-center">
                                        {isAccepted && (
                                            <button
                                                onClick={() => onAction('view', lead)}
                                                className="inline-flex items-center justify-center h-9 w-9 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all active:scale-95 shadow-sm"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-5 whitespace-nowrap text-right">
                                        <div className="flex justify-center items-center gap-2">
                                            {isNew && (
                                                <>
                                                    <button
                                                        onClick={() => onAction('accept', lead)}
                                                        className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-md active:scale-95 whitespace-nowrap"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => onAction('reject', lead)}
                                                        className="px-3 py-2 bg-rose-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-rose-600 transition-all shadow-md active:scale-95 whitespace-nowrap"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {isAccepted && (
                                                <button
                                                    onClick={() => onAction('contact', lead)}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-100 transition-all active:scale-95"
                                                >
                                                    <MessageSquare size={12} /> Contact
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Vertical systematic Layout */}
            <div className="md:hidden space-y-6 px-4 py-4">
                {leads.map((lead) => {
                    const statusVal = lead.assignmentStatus || lead.status;
                    const statusLower = (statusVal || '').toLowerCase();
                    const isNew = ['new', 'open', 'sent', 'viewed'].includes(statusLower);
                    const isAccepted = statusLower === 'accepted';
                    const isRejected = statusLower === 'rejected';

                    const displayName = lead.customerName || 'Customer';
                    const displayLocation = lead.location || 'Not Specified';

                    return (
                        <div key={lead.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col transition-all active:scale-[0.99] hover:shadow-2xl">
                            {/* Card Header - Main Info */}
                            <div className="bg-gradient-to-r from-gray-50 to-white px-5 md:px-6 py-6 md:py-7 border-b border-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1.5 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-50 shadow-sm leading-none">ID: #{lead.leadNo || lead.id}</span>
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(statusVal)}`}>
                                        {isNew ? 'New' : (statusLower === 'completed' || statusLower === 'closed' ? 'Closed' : statusVal)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shrink-0 border-4 border-white">
                                        {(lead.customerName?.charAt(0) || 'C')}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black tracking-tight truncate leading-none mb-1.5 text-gray-900 text-xl">
                                            {displayName}
                                        </h4>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{new Date(lead.dateRequested).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body - Systematic Vertical Details */}
                            <div className="px-5 md:px-6 py-5 md:py-6 space-y-6">
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Service Type</p>
                                    <div className="bg-gray-50 px-5 py-3.5 rounded-2xl border border-gray-100 font-black text-gray-800 text-sm">
                                        {lead.serviceCategory}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Location</p>
                                    <div className="bg-gray-50 px-5 py-3.5 rounded-2xl border border-gray-100 text-lg leading-relaxed text-gray-900">
                                        {displayLocation}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gray-100 w-full"></div>

                                {/* Bottom Actions Row */}
                                <div className="flex items-center gap-3 pt-2">
                                    {isAccepted && (
                                        <button
                                            onClick={() => onAction('view', lead)}
                                            className="h-14 w-14 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm shrink-0 active:scale-90 transition-all"
                                        >
                                            <Eye size={24} />
                                        </button>
                                    )}

                                    <div className="flex-1">
                                        {isNew && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => onAction('accept', lead)}
                                                    className="flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-50 active:scale-95 transition-all"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => onAction('reject', lead)}
                                                    className="flex items-center justify-center gap-2 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-50 active:scale-95 transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {isAccepted && (
                                            <button
                                                onClick={() => onAction('contact', lead)}
                                                className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-50 border-2 border-emerald-100 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-sm"
                                            >
                                                <MessageSquare size={18} /> Contact Customer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {leads.length === 0 && (
                <div className="py-24 text-center bg-white rounded-[2rem] border border-dashed border-gray-200 m-4">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No leads match your search.</p>
                </div>
            )}
        </div>
    );
};

export default LeadTable;

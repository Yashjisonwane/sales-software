import React from 'react';
import { MapPin, Clock, DollarSign, User, Navigation } from 'lucide-react';

const LeadCard = ({ lead, onAction }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'sent':
            case 'new': return 'bg-red-500 shadow-red-200';
            case 'viewed': return 'bg-blue-500 shadow-blue-200';
            case 'accepted': return 'bg-green-500 shadow-green-200';
            default: return 'bg-gray-400';
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'sent': return 'New Opportunity';
            case 'viewed': return 'Lead Viewed';
            case 'accepted': return 'Active Job';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(lead.status)} shadow-lg`}></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{getStatusLabel(lead.status)}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{lead.serviceCategory}</h3>
                </div>
                <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-1 rounded-lg">ID-{lead.id}</span>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <User size={14} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{lead.customerName}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-500 truncate">{lead.location}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <Navigation size={14} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-600">
                        {lead.distance || "2.5 miles away"}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        <Clock size={14} className="text-gray-400" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">
                        {new Date(lead.dateRequested).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                {lead.budget && (
                    <div className="pt-2 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Revenue</span>
                            <span className="text-lg font-black text-emerald-600 tracking-tighter">{lead.budget}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => onAction('view', lead)}
                    className="py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                >
                    View Details
                </button>
                {(lead.status?.toLowerCase() === 'sent' || lead.status?.toLowerCase() === 'new' || lead.status?.toLowerCase() === 'viewed') && (
                    <button
                        onClick={() => onAction('accept', lead)}
                        className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95"
                    >
                        Accept Lead
                    </button>
                )}
            </div>
        </div>
    );
};

export default LeadCard;

import React from 'react';
import { X, Eye, MapPin, Phone, Mail, Calendar, Tag, FileText } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

const getStatusColor = (status) => {
    switch (status) {
        case 'Open': return 'bg-blue-100 text-blue-700 border border-blue-200';
        case 'Assigned': return 'bg-blue-100 text-blue-700 border border-blue-200';
        case 'Pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
        case 'Completed': return 'bg-green-100 text-green-700 border border-green-200';
        default: return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
};

const DetailRow = ({ icon: Icon, label, value, iconColor = 'text-gray-400' }) => (
    <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${iconColor}`}>
            <Icon size={16} />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5 break-words">{value || '—'}</p>
        </div>
    </div>
);

const LeadDetailsModal = ({ isOpen, onClose, lead }) => {
    const { assignments, professionals, reassignLead } = useMarketplace();
    if (!isOpen || !lead) return null;

    const leadAssignments = assignments?.filter(a => a.leadId === lead.id) || [];
    const hasAssignments = leadAssignments.length > 0;
    const isAccepted = lead.status === 'Accepted' || lead.status === 'Assigned' || lead.status === 'In Progress' || lead.status === 'Completed';

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-5 md:px-8 pt-8 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 text-white rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Eye size={18} className="md:hidden" />
                            <Eye size={22} className="hidden md:block" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800">Lead Details</h2>
                            <p className="text-xs text-gray-400 font-medium">#{lead.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-5 md:px-8 pb-8 pt-4 space-y-5 max-h-[75vh] md:max-h-[70vh] overflow-y-auto">
                    {/* Status badge */}
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(lead.status)}`}>
                            {lead.status}
                        </span>
                        {lead.urgency && (
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                                {lead.urgency} Priority
                            </span>
                        )}
                    </div>

                    {/* Customer info */}
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Information</h3>
                        <div className="space-y-3">
                            <DetailRow icon={Tag} label="Customer Name" value={lead.customerName} iconColor="text-blue-500" />
                            <DetailRow icon={Phone} label="Phone" value={lead.customerPhone} iconColor="text-emerald-500" />
                            <DetailRow icon={Mail} label="Email" value={lead.customerEmail} iconColor="text-purple-500" />
                        </div>
                    </div>

                    {/* Service info */}
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Details</h3>
                        <div className="space-y-3">
                            <DetailRow icon={Tag} label="Service Category" value={lead.serviceCategory} iconColor="text-amber-500" />
                            <DetailRow icon={MapPin} label="Location" value={lead.location} iconColor="text-rose-500" />
                            <DetailRow icon={Calendar} label="Date Requested" value={new Date(lead.dateRequested).toLocaleDateString()} iconColor="text-indigo-500" />
                            <DetailRow icon={Calendar} label="Preferred Date" value={lead.preferredDate ? new Date(lead.preferredDate).toLocaleDateString() : '—'} iconColor="text-teal-500" />
                        </div>
                    </div>

                    {/* Description */}
                    {lead.description && (
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={14} /> Description
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{lead.description}</p>
                        </div>
                    )}

                    {/* Assigned Professionals */}
                    {hasAssignments && (
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Professionals</h3>
                            <div className="space-y-3">
                                {leadAssignments.map(assignment => {
                                    const pro = professionals?.find(p => p.id === assignment.professionalId);
                                    return (
                                        <div key={assignment.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    {pro?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-700">{pro?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-400">{pro?.category || 'Professional'}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${assignment.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    assignment.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                        'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                {assignment.status}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
                        >
                            Close
                        </button>
                        {!isAccepted && (
                            <button
                                onClick={() => {
                                    reassignLead(lead.id);
                                    onClose();
                                }}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 text-sm shadow-md shadow-blue-200"
                            >
                                Find Another Pro
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailsModal;

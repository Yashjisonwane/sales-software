import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, Eye, Edit, Trash2, Plus, Inbox, UserPlus, AlertCircle, Clock, Filter, ChevronDown } from 'lucide-react';
import AddLeadModal from '../../components/leads/AddLeadModal';
import LeadDetailsModal from '../../components/leads/LeadDetailsModal';
import EditLeadModal from '../../components/leads/EditLeadModal';
import ReassignLeadModal from '../../components/leads/ReassignLeadModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminLeads = () => {
    const { leads, professionals, addLead, updateLead, deleteLead, assignLead } = useMarketplace();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    const counts = useMemo(() => {
        const c = { All: leads.length, New: 0, Assigned: 0, Accepted: 0, Completed: 0, Closed: 0 };
        leads.forEach(lead => {
            const status = lead.status?.toUpperCase();
            const jobStatus = lead.job?.status?.toUpperCase();

            if (status === 'OPEN' || status === 'NEW') c.New++;
            else if (status === 'ASSIGNED') {
                if (!jobStatus || jobStatus === 'SCHEDULED') c.Assigned++;
                else if (jobStatus === 'ACCEPTED' || jobStatus === 'IN_PROGRESS' || jobStatus === 'ESTIMATED' || jobStatus === 'INVOICED') c.Accepted++;
                else if (jobStatus === 'COMPLETED') c.Completed++;
            } else if (status === 'REJECTED') c.Closed++;
        });
        return c;
    }, [leads]);

    const filtered = useMemo(() => {
        return leads.filter(lead => {
            const searchLower = searchTerm.toLowerCase();
            const matchSearch = (lead.customerName || '').toLowerCase().includes(searchLower) ||
                (lead.displayId || '').toLowerCase().includes(searchLower) ||
                (lead.id || '').toLowerCase().includes(searchLower);

            const status = lead.status?.toUpperCase();
            const jobStatus = lead.job?.status?.toUpperCase();
            let matchStatus = statusFilter === 'All';
            
            if (statusFilter === 'New') {
                matchStatus = status === 'OPEN' || status === 'NEW';
            } else if (statusFilter === 'Assigned') {
                matchStatus = status === 'ASSIGNED' && (!jobStatus || jobStatus === 'SCHEDULED');
            } else if (statusFilter === 'Accepted') {
                matchStatus = status === 'ASSIGNED' && (jobStatus === 'ACCEPTED' || jobStatus === 'IN_PROGRESS' || jobStatus === 'ESTIMATED' || jobStatus === 'INVOICED');
            } else if (statusFilter === 'Completed') {
                matchStatus = status === 'ASSIGNED' && jobStatus === 'COMPLETED';
            } else if (statusFilter === 'Closed') {
                matchStatus = status === 'REJECTED' || (lead.job && jobStatus === 'CANCELLED');
            }

            return matchSearch && matchStatus;
        }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }, [leads, searchTerm, statusFilter]);

    const getStatusColor = (lead) => {
        const status = lead.status?.toUpperCase();
        const jobStatus = lead.job?.status?.toUpperCase();

        if (status === 'OPEN' || status === 'NEW') return 'bg-blue-100 text-blue-700 border border-blue-200';
        if (status === 'REJECTED') return 'bg-gray-100 text-gray-700 border border-gray-200';
        
        if (status === 'ASSIGNED') {
            if (!jobStatus || jobStatus === 'SCHEDULED') return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
            if (jobStatus === 'ACCEPTED') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            if (jobStatus === 'IN_PROGRESS') return 'bg-orange-100 text-orange-700 border border-orange-200';
            if (jobStatus === 'COMPLETED') return 'bg-green-100 text-green-700 border border-green-200';
            if (jobStatus === 'CANCELLED') return 'bg-red-100 text-red-700 border border-red-200';
            return 'bg-amber-100 text-amber-700 border border-amber-200';
        }
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    };

    const getDisplayStatus = (lead) => {
        const status = lead.status?.toUpperCase();
        const jobStatus = lead.job?.status?.toUpperCase();

        if (status === 'ASSIGNED' && jobStatus) return jobStatus;
        return status;
    };

    // Handlers
    const handleAddLead = (newLead) => addLead(newLead);
    const handleViewLead = (lead) => { setSelectedLead(lead); setShowViewModal(true); };
    const handleEditLead = (lead) => { setSelectedLead(lead); setShowEditModal(true); };
    const handleSaveEdit = (updatedLead) => updateLead(updatedLead.id, updatedLead);
    const handleDeleteClick = (lead) => { setSelectedLead(lead); setShowDeleteConfirm(true); };
    const handleConfirmDelete = () => { if (selectedLead) deleteLead(selectedLead.id); };
    const handleReassignClick = (lead) => { setSelectedLead(lead); setShowReassignModal(true); };
    const handleConfirmReassign = (leadId, professionalId) => assignLead(leadId, professionalId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
                    <p className="text-sm text-gray-500 mt-1">View and manage all service requests across the platform.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all"
                >
                    <Plus size={16} /> Add Lead
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Lead ID or Customer..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                        className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-gray-100 transition-all text-gray-700"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {['All', 'New', 'Assigned', 'Accepted', 'Completed', 'Closed'].map(s => (
                            <option key={s} value={s}>{s} ({counts[s]})</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Leads View */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Lead ID', 'Customer', 'Service', 'Location', 'Status', 'Professional', 'Date', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {filtered.map(lead => {
                                const assignment = lead.job || null;
                                const acceptedPro = professionals.find(p => p.id === (assignment?.workerId || assignment?.professionalId));
                                return (
                                    <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{lead.displayId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {lead.customerName?.charAt(0) || '?'}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{lead.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.serviceCategory}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(lead)}`}>
                                                {getDisplayStatus(lead)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {acceptedPro ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                                                        {acceptedPro.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">{acceptedPro.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {new Date(lead.dateRequested).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleViewLead(lead)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={18} /></button>
                                                <button onClick={() => handleReassignClick(lead)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg"><UserPlus size={18} /></button>
                                                <button onClick={() => handleEditLead(lead)} className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteClick(lead)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden divide-y divide-gray-100">
                    {filtered.map(lead => {
                        const assignment = lead.job || null;
                        const acceptedPro = professionals.find(p => p.id === (assignment?.workerId || assignment?.professionalId));
                        return (
                            <div key={lead.id} className="p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100 shadow-sm">
                                            {lead.displayId}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-none">{lead.customerName}</h4>
                                            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">{lead.serviceCategory}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(lead)}`}>
                                        {getDisplayStatus(lead)}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Location:</span>
                                        <span className="font-bold text-gray-700">{lead.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Professional:</span>
                                        <span className="font-bold text-gray-700">{acceptedPro?.name || 'Unassigned'}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleViewLead(lead)} className="bg-gray-50 text-gray-700 font-bold py-2 rounded-xl text-xs hover:bg-gray-100">View</button>
                                    <button onClick={() => handleReassignClick(lead)} className="bg-gray-50 text-gray-700 font-bold py-2 rounded-xl text-xs hover:bg-gray-100">Assign</button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <Inbox size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No leads found</h3>
                        <p className="text-gray-400">Try adjusting your filters or search term.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddLeadModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddLead} existingLeads={leads} />
            <LeadDetailsModal isOpen={showViewModal} onClose={() => { setShowViewModal(false); setSelectedLead(null); }} lead={selectedLead} />
            <EditLeadModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setSelectedLead(null); }} lead={selectedLead} onSave={handleSaveEdit} />
            <ReassignLeadModal isOpen={showReassignModal} onClose={() => { setShowReassignModal(false); setSelectedLead(null); }} professionals={professionals} lead={selectedLead} onAssign={handleConfirmReassign} />
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => { setShowDeleteConfirm(false); setSelectedLead(null); }}
                onConfirm={handleConfirmDelete}
                title="Delete Lead"
                message={`Are you sure you want to delete this lead? This action cannot be undone.`}
                icon={AlertCircle}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default AdminLeads;

import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, Filter, Eye, Edit, RefreshCw, Trash2, Plus, Inbox, UserPlus, AlertCircle } from 'lucide-react';
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

    const filtered = useMemo(() => {
        return leads.filter(lead => {
            const searchLower = searchTerm.toLowerCase();
            const matchSearch = lead.customerName.toLowerCase().includes(searchLower) ||
                lead.displayId.toLowerCase().includes(searchLower) ||
                lead.id.toLowerCase().includes(searchLower);

            const status = lead.status?.toUpperCase();
            let matchStatus = statusFilter === 'All';
            
            if (statusFilter === 'New') matchStatus = status === 'OPEN' || status === 'NEW';
            else if (statusFilter === 'Assigned') matchStatus = status === 'ASSIGNED';
            else if (statusFilter === 'Accepted') matchStatus = status === 'ACCEPTED';
            else if (statusFilter === 'Completed') matchStatus = status === 'COMPLETED';
            else if (statusFilter === 'Closed') matchStatus = status === 'CLOSED';
            else if (statusFilter !== 'All') matchStatus = status === statusFilter.toUpperCase();

            return matchSearch && matchStatus;
        });
    }, [leads, searchTerm, statusFilter]);

    const getStatusColor = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case 'NEW':
            case 'OPEN': return 'bg-blue-100 text-blue-700 border border-blue-200';
            case 'ASSIGNED': return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
            case 'ACCEPTED': return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'COMPLETED': return 'bg-green-100 text-green-700 border border-green-200';
            case 'CLOSED': return 'bg-gray-100 text-gray-700 border border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border border-gray-200';
        }
    };

    // ── Handlers ──────────────────────────────────────────────

    const handleAddLead = (newLead) => {
        addLead(newLead);
    };

    const handleViewLead = (lead) => {
        setSelectedLead(lead);
        setShowViewModal(true);
    };

    const handleEditLead = (lead) => {
        setSelectedLead(lead);
        setShowEditModal(true);
    };

    const handleSaveEdit = (updatedLead) => {
        updateLead(updatedLead.id, updatedLead);
    };

    const handleDeleteClick = (lead) => {
        setSelectedLead(lead);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (selectedLead) {
            deleteLead(selectedLead.id);
        }
    };

    const handleReassignClick = (lead) => {
        setSelectedLead(lead);
        setShowReassignModal(true);
    };

    const handleConfirmReassign = (leadId, professionalId) => {
        assignLead(leadId, professionalId);
    };

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
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    {['All', 'New', 'Assigned', 'Accepted', 'Completed', 'Closed'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${statusFilter === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leads View */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop/Tablet Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Lead ID', 'Customer', 'Service', 'Location', 'Status', 'Accepted By', 'Date', 'Actions'].map(h => (
                                    <th key={h} scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {filtered.map(lead => {
                                // Find if there's a job for this lead to show who it's assigned to
                                const assignment = lead.job || null;
                                const acceptedPro = professionals.find(p => p.id === (assignment?.workerId || assignment?.professionalId));
                                return (
                                    <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{lead.displayId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {lead.customerName.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{lead.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.serviceCategory}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                                                {lead.status}
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
                                                <span className="text-xs font-bold text-gray-400 italic">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(lead.dateRequested).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleViewLead(lead)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="View Lead"><Eye size={18} /></button>
                                                <button onClick={() => handleReassignClick(lead)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Reassign Lead"><UserPlus size={18} /></button>
                                                <button onClick={() => handleEditLead(lead)} className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-all" title="Edit Lead"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteClick(lead)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Lead"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="sm:hidden divide-y divide-gray-100">
                    {filtered.map(lead => {
                        const assignment = lead.job || null;
                        const acceptedPro = professionals.find(p => p.id === (assignment?.workerId || assignment?.professionalId));
                        return (
                            <div key={lead.id} className="p-5 space-y-4 hover:bg-gray-50/50 transition-colors">
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
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </div>

                                <div className="space-y-3 py-1 text-sm border-t border-gray-50 pt-3">
                                    <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Search size={14} className="text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</span>
                                        </div>
                                        <span className="font-bold text-gray-700 text-xs text-right max-w-[150px] truncate">{lead.location}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Inbox size={14} className="text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</span>
                                        </div>
                                        <span className="font-bold text-gray-700 text-xs">{new Date(lead.dateRequested).toLocaleDateString()}</span>
                                    </div>

                                    <div className="bg-gray-50/50 p-2 rounded-lg">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accepted By</span>
                                        <div className="mt-1 flex items-center justify-between">
                                            {acceptedPro ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-[10px] border border-emerald-200">
                                                        {acceptedPro.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">{acceptedPro.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400 italic">Pending Assignment</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <button
                                        onClick={() => handleViewLead(lead)}
                                        className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                                    >
                                        <Eye size={14} className="text-blue-500" /> View
                                    </button>
                                    <button
                                        onClick={() => handleReassignClick(lead)}
                                        className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                                    >
                                        <UserPlus size={14} className="text-emerald-500" /> Reassign
                                    </button>
                                    <button
                                        onClick={() => handleEditLead(lead)}
                                        className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                                    >
                                        <Edit size={14} className="text-yellow-500" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(lead)}
                                        className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                                    >
                                        <Trash2 size={14} className="text-red-500" /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                            <Inbox size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No leads found</h3>
                        <p className="text-sm text-gray-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                            No leads match your current search or filter. Try a different term or status.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Modals ──────────────────────────────────────────── */}

            <AddLeadModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddLead}
                existingLeads={leads}
            />

            <LeadDetailsModal
                isOpen={showViewModal}
                onClose={() => { setShowViewModal(false); setSelectedLead(null); }}
                lead={selectedLead}
            />

            <EditLeadModal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setSelectedLead(null); }}
                lead={selectedLead}
                onSave={handleSaveEdit}
            />

            <ReassignLeadModal
                isOpen={showReassignModal}
                onClose={() => { setShowReassignModal(false); setSelectedLead(null); }}
                professionals={professionals}
                lead={selectedLead}
                onAssign={handleConfirmReassign}
            />

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => { setShowDeleteConfirm(false); setSelectedLead(null); }}
                onConfirm={handleConfirmDelete}
                title="Delete Lead"
                message={`Are you sure you want to delete this lead${selectedLead ? ` (${selectedLead.displayId} — ${selectedLead.customerName})` : ''}? This action cannot be undone.`}
                icon={AlertCircle}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default AdminLeads;

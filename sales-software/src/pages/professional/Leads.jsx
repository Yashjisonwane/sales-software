import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import LeadTable from '../../components/professional/LeadTable';
import LeadDetailModal from '../../components/professional/LeadDetailModal';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Leads = () => {
    const { leads, assignments, currentUser, respondToLead, showToast, startJob, completeJob } = useMarketplace();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const navigate = useNavigate();

    // Modal state
    const [selectedLead, setSelectedLead] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ── Real leads from context ───────────────────────────────
    const proAssignments = assignments.filter(a => a.professionalId === currentUser.id);

    const sourceLeads = leads
        .filter(lead => {
            const assignment = proAssignments.find(a => a.leadId === lead.id);
            if (!assignment) return false;

            const curStatus = (assignment.status || '').toLowerCase();
            if (curStatus === 'rejected') return false;

            if (lead.status === 'Accepted' && lead.assignedTo !== currentUser.id) {
                return false;
            }
            return true;
        })
        .map(lead => {
            const assignment = proAssignments.find(a => a.leadId === lead.id);
            return { 
                ...lead, 
                assignmentStatus: assignment?.status || 'Sent', 
                assignmentId: assignment?.id
            };
        });

    // ── Apply search + status filter ──────────────────────────
    const filteredLeads = sourceLeads.filter(lead => {
        const s = (lead.assignmentStatus || '').toLowerCase();

        const matchesSearch =
            (lead.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.id || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Open' && ['sent', 'viewed', 'open', 'new', 'Sent'].includes(s)) ||
            (statusFilter === 'Accepted' && s === 'accepted' || s === 'Accepted') ||
            (statusFilter === 'In Progress' && ['in progress', 'active', 'in_progress'].includes(s)) ||
            (statusFilter === 'Completed' && s === 'completed' || s === 'Completed');

        return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    // ── Action handler ────────────────────────────────────────
    const handleAction = (type, lead) => {
        if (type === 'view') {
            setSelectedLead(lead);
            setIsModalOpen(true);
            return;
        }

        if (type === 'contact') {
            navigate('/professional/messages', { state: { jobId: lead.assignmentId } });
            return;
        }

        if (type === 'start') {
            const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
            if (assignmentId) {
                startJob(assignmentId);
                if (selectedLead?.id === lead.id) {
                    setSelectedLead(prev => ({ ...prev, assignmentStatus: 'In Progress' }));
                }
            } else {
                showToast('Assignment record not found.', 'error');
            }
            return;
        }

        if (type === 'complete') {
            const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
            if (assignmentId) {
                completeJob(assignmentId);
                if (selectedLead?.id === lead.id) {
                    setSelectedLead(prev => ({ ...prev, assignmentStatus: 'Completed' }));
                }
            } else {
                showToast('Assignment record not found.', 'error');
            }
            return;
        }

        if (type === 'accept' || type === 'reject') {
            const assignmentId = lead.assignmentId || proAssignments.find(a => a.leadId === lead.id)?.id;
            if (assignmentId) {
                respondToLead(assignmentId, type);
                if (selectedLead?.id === lead.id) {
                    if (type === 'reject') {
                        setIsModalOpen(false);
                        setSelectedLead(null);
                    } else {
                        setSelectedLead(prev => ({ ...prev, assignmentStatus: 'Accepted' }));
                    }
                }
                showToast(
                    type === 'accept'
                        ? `✅ Lead from ${lead.customerName} accepted!`
                        : `❌ Lead from ${lead.customerName} rejected.`,
                    type === 'accept' ? 'success' : 'info'
                );
            } else {
                showToast('Assignment record not found for this lead.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and respond to service requests.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID or customer..."
                        className="w-full pl-11 sm:pl-12 pr-4 sm:pr-5 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-gray-900 placeholder-gray-300 shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 sm:gap-3">
                    <div className="flex-1 xl:flex-none relative">
                        <select
                            className="w-full appearance-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-100 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer pr-8 sm:pr-10"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Open">New / Open</option>
                            <option value="Accepted">Accepted</option>
                            <option value="In Progress">In Progress</option>
                        </select>
                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ChevronRight size={12} className="rotate-90 sm:w-3.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lead Table */}
            <LeadTable leads={filteredLeads} onAction={handleAction} />

            {/* Detail Modal */}
            <LeadDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                lead={selectedLead}
                onAction={handleAction}
            />
        </div>
    );
};

export default Leads;

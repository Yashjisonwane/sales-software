import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
    Briefcase,
    CheckCircle,
    Clock,
    MapPin,
    Eye,
    Check,
    X,
    ArrowUpRight,
    TrendingUp,
    Star,
    Zap,
    ChevronRight,
    ListChecks,
    Crown
} from 'lucide-react';
import LeadTable from '../../components/professional/LeadTable';
import LeadMap from '../../components/professional/LeadMap';
import LeadDetailModal from '../../components/professional/LeadDetailModal';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { leads, assignments, currentUser, respondToLead, showToast, dashboardStats, startJob, completeJob } = useMarketplace();
    const navigate = useNavigate();
    const [selectedLead, setSelectedLead] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter assignments once for internal logic (map, leads etc)
    const proAssignments = assignments.filter(a => a.professionalId === currentUser.id);

    // Icons Mapping
    const statIcons = {
        'New Jobs Today': Zap,
        'Total Assigned': Briefcase,
        'Accepted Jobs': ListChecks,
        'Completed Tasks': TrendingUp
    };

    const statColors = {
        'New Jobs Today': 'text-blue-600 bg-blue-50',
        'Total Assigned': 'text-indigo-600 bg-indigo-50',
        'Accepted Jobs': 'text-emerald-600 bg-emerald-50',
        'Completed Tasks': 'text-purple-600 bg-purple-50'
    };

    // Use Dashboard Stats from API if available, else fallback to locally calculated basics
    const stats = (dashboardStats && dashboardStats.length > 0) ? dashboardStats.map(s => ({
        ...s,
        icon: statIcons[s.name] || Zap,
        color: (statColors[s.name] || 'text-blue-600 bg-blue-50').split(' ')[0],
        bg: (statColors[s.name] || 'text-blue-600 bg-blue-50').split(' ')[1]
    })) : [
        {
            name: 'New Leads Today',
            value: proAssignments.filter(a => {
                const s = a.status?.toLowerCase();
                return s === 'sent' || s === 'viewed' || s === 'new' || s === 'scheduled';
            }).length,
            icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%', up: true
        },
        { name: 'Total Leads', value: proAssignments.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+8%', up: true },
        {
            name: 'Accepted Leads',
            value: proAssignments.filter(a => {
                const s = a.status?.toLowerCase();
                return s === 'accepted' || s === 'in progress' || s === 'active';
            }).length,
            icon: ListChecks, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%', up: true
        },
        { name: 'Conversion Rate', value: proAssignments.length > 0 ? ((proAssignments.filter(a => a.status?.toLowerCase() === 'completed').length / proAssignments.length) * 100).toFixed(0) + '%' : '0%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+0%', up: true },
    ];

    // Leads for map - combine lead data with assignment status
    const mapLeads = leads
        .filter(l => proAssignments.some(a => {
            const s = a.status?.toLowerCase();
            return a.leadId === l.id && s !== 'rejected';
        }))
        .map(l => {
            const assignment = proAssignments.find(a => a.leadId === l.id);
            return { ...l, status: assignment?.status || 'Sent' };
        });

    // Recent leads for this professional — attach assignmentStatus so LeadTable renders correct buttons
    const recentLeads = leads
        .filter(l => proAssignments.some(a => {
            const s = a.status?.toLowerCase();
            return a.leadId === l.id && (['sent', 'viewed', 'accepted', 'in progress', 'active', 'scheduled', 'new'].includes(s)) && s !== 'rejected';
        }))
        .slice(0, 10)
        .map(l => {
            const assignment = proAssignments.find(a => a.leadId === l.id);
            return {
                ...l,
                assignmentStatus: assignment?.status || 'Sent',
                assignmentId: assignment?.id // Real Job UUID
            };
        }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const handleAction = (type, lead) => {
        if (type === 'view') {
            setSelectedLead(lead);
            setIsModalOpen(true);
            return;
        }

        const assignment = proAssignments.find(a => a.leadId === lead.id);

        if (type === 'contact') {
            const assignmentId = lead.assignmentId || assignment?.id;
            navigate('/professional/messages', { state: { jobId: assignmentId } });
            return;
        }

        if (type === 'start') {
            const assignmentId = lead.assignmentId || assignment?.id;
            if (assignmentId) startJob(assignmentId);
            return;
        }

        if (type === 'complete') {
            const assignmentId = lead.assignmentId || assignment?.id;
            if (assignmentId) completeJob(assignmentId);
            return;
        }

        if (assignment && (type === 'accept' || type === 'reject')) {
            respondToLead(assignment.id, type);
            showToast(`Lead ${type === 'accept' ? 'Accepted' : 'Rejected'}`, type === 'accept' ? 'success' : 'info');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Marketplace Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor your leads, active jobs, and platform performance.</p>
                </div>
                {currentUser.plan && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100">
                        <Crown size={14} fill="currentColor" />
                        <span>{currentUser.plan.name} Member</span>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl sm:rounded-[2rem] shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-[9px] sm:text-xs font-bold px-1.5 sm:py-1 rounded-full ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                <ArrowUpRight size={12} className="sm:w-3.5" />
                                {stat.trend}
                            </div>
                        </div>
                        <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">{stat.name}</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 tracking-tight truncate">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Interactive Lead Map */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-lg font-bold text-gray-900 px-1">Job Locations</h2>
                </div>
                <div className="w-full rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
                    <LeadMap leads={mapLeads} onAction={handleAction} />
                </div>
            </div>

            {/* Recent Leads Section */}
            <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-lg font-bold text-gray-900">Recent Assignments</h2>
                    <button
                        onClick={() => navigate('/professional/leads')}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                        View all <ChevronRight size={14} />
                    </button>
                </div>

                <div className="overflow-visible">
                    <LeadTable leads={recentLeads} onAction={handleAction} />
                </div>
            </div>

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

export default Dashboard;

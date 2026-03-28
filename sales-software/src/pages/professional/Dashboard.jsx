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
    ListChecks
} from 'lucide-react';
import LeadTable from '../../components/professional/LeadTable';
import LeadMap from '../../components/professional/LeadMap';
import LeadDetailModal from '../../components/professional/LeadDetailModal';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { leads, assignments, currentUser, respondToLead, showToast, dashboardStats } = useMarketplace();
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
        { name: 'New Leads Today', value: proAssignments.filter(a => a.status === 'Sent' || a.status === 'Viewed').length, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%', up: true },
        { name: 'Total Leads', value: proAssignments.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+8%', up: true },
        { name: 'Accepted Leads', value: proAssignments.filter(a => a.status === 'Accepted').length, icon: ListChecks, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%', up: true },
        { name: 'Conversion Rate', value: '0%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+0%', up: true },
    ];

    // Leads for map - combine lead data with assignment status
    const mapLeads = leads
        .filter(l => proAssignments.some(a => a.leadId === l.id && a.status !== 'Rejected'))
        .map(l => {
            const assignment = proAssignments.find(a => a.leadId === l.id);
            return { ...l, status: assignment?.status || 'Sent' };
        });

    // Recent leads for this professional — attach assignmentStatus so LeadTable renders correct buttons
    const recentLeads = leads
        .filter(l => proAssignments.some(a => a.leadId === l.id && (['Sent', 'Viewed', 'Accepted', 'In Progress'].includes(a.status)) && a.status !== 'Rejected'))
        .slice(0, 10)
        .map(l => {
            const assignment = proAssignments.find(a => a.leadId === l.id);
            return { 
                ...l, 
                assignmentStatus: assignment?.status || 'Sent',
                assignmentId: assignment?.id // Real Job UUID
            };
        });

    const handleAction = (type, lead) => {
        if (type === 'view') {
            setSelectedLead(lead);
            setIsModalOpen(true);
            return;
        }

        const assignment = proAssignments.find(a => a.leadId === lead.id);
        if (assignment && (type === 'accept' || type === 'reject')) {
            respondToLead(assignment.id, type);
            showToast(`Lead ${type === 'accept' ? 'Accepted' : 'Rejected'}`, type === 'accept' ? 'success' : 'info');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
                <div className="w-full">
                    <h1 className="text-2xl font-bold text-slate-900">Professional Overview</h1>
                    <p className="text-sm md:text-base text-gray-500 mt-1 font-medium leading-relaxed">Welcome back, {currentUser.name}! Here's your business performance today.</p>
                </div>
                <div className="w-full md:w-auto px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-600 flex items-center justify-between md:justify-start gap-2">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        <span className="hidden sm:inline">Current Date:</span>
                    </div>
                    <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
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
                        <p className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-gray-900 mt-1 tracking-tight truncate">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Interactive Lead Map */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Lead Explorer</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Geo-Intelligence Visualization</p>
                    </div>
                </div>
                <div className="w-full overflow-hidden">
                    <LeadMap leads={mapLeads} onAction={handleAction} />
                </div>
            </div>

            {/* Recent Leads Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Recent Lead Opportunities</h2>
                    <button
                        onClick={() => navigate('/professional/leads')}
                        className="w-full sm:w-auto text-blue-600 text-xs font-black uppercase tracking-[0.15em] hover:opacity-70 transition-opacity flex items-center justify-center sm:justify-end gap-2"
                    >
                        View all leads <ArrowUpRight size={16} />
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <LeadTable leads={recentLeads} onAction={handleAction} />
                    {recentLeads.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <Clock size={48} className="mx-auto mb-3 opacity-20" />
                            <p className="font-medium">No new leads at the moment. We'll notify you when a match is found!</p>
                        </div>
                    )}
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

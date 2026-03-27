import { useState, useMemo } from 'react';
import { 
    TrendingUp, 
    Users, 
    Download, 
    Filter, 
    ArrowUpRight, 
    Activity, 
    MapPin, 
    Zap, 
    CheckCircle2, 
    ClipboardList,
    Layers,
    Star
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import ConfirmationModal from '../../components/ConfirmationModal';

const Reports = () => {
    const { leads, professionals, assignments, servicesData, showToast } = useMarketplace();
    const [timeRange, setTimeRange] = useState('This Month');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // --- Metrics Calculations ---
    const stats = useMemo(() => {
        const totalLeads = leads.length;
        const today = new Date().toDateString();
        const leadsToday = leads.filter(l => {
            const leadDate = new Date(l.dateRequested).toDateString();
            return leadDate === today;
        }).length;
        
        const totalPros = professionals.length;
        const convertedLeads = leads.filter(l => ['Accepted', 'Completed'].includes(l.status)).length;
        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

        return [
            { label: 'Total Leads', value: totalLeads.toLocaleString(), icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%' },
            { label: 'Leads Today', value: leadsToday.toLocaleString(), icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+5.2%' },
            { label: 'Total Professionals', value: totalPros.toLocaleString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+8.1%' },
            { label: 'Conversion Rate', value: `${conversionRate.toFixed(1)}%`, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2.4%' },
        ];
    }, [leads, professionals]);

    // --- Charts Data ---
    const leadsGrowthData = [45, 52, 38, 65, 48, 72, 55, 80, 62, 85, 75, 95]; // Monthly
    
    const categoryDemand = useMemo(() => {
        const counts = {};
        leads.forEach(l => {
            counts[l.serviceCategory] = (counts[l.serviceCategory] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [leads]);

    const locationData = [
        { name: 'Downtown', count: 42 },
        { name: 'North District', count: 28 },
        { name: 'West End', count: 35 },
        { name: 'East Side', count: 19 },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Lead Analytics</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Platform usage metrics and lead generation intelligence</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option>This Month</option>
                            <option>Last 3 Months</option>
                            <option>Annual View</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <Filter size={14} />
                        </div>
                    </div>
                    <button
                        onClick={() => setIsExportModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all text-xs font-bold shadow-lg shadow-gray-200 active:scale-95"
                    >
                        <Download size={16} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                                <stat.icon size={22} />
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                <ArrowUpRight size={12} />
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-lg font-bold text-gray-800 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <h3 className="font-bold text-gray-800 tracking-tight mb-8 text-lg">Monthly Leads Growth</h3>
                    <div className="overflow-x-auto pb-4 -mx-2 px-2 scrollbar-none">
                        <div className="h-[280px] flex items-end justify-between gap-2 md:gap-3 min-w-[500px] md:min-w-0">
                            {leadsGrowthData.map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="w-full relative h-[220px] flex flex-col justify-end">
                                        <div 
                                            className="w-full bg-blue-600 rounded-t-xl transition-all duration-700 shadow-lg shadow-blue-100 relative z-10 cursor-pointer group-hover:bg-blue-700"
                                            style={{ height: `${val}%` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                                {val}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">M{i+1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Service Category Demand */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 tracking-tight mb-8 text-lg">Leads by Category</h3>
                    <div className="space-y-6">
                        {categoryDemand.map((cat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    <span className="truncate pr-2">{cat.name}</span>
                                    <span className="shrink-0">{cat.count} Leads</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                    <div 
                                        className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${(cat.count / (leads.length || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onConfirm={() => {
                    showToast("Generating analytics report...", "success");
                    setIsExportModalOpen(false);
                }}
                title="Export Analytics Data"
                message="Are you sure you want to export the current lead analytics data as a CSV file for offline study?"
                icon={Download}
                confirmText="Download Report"
                type="info"
            />
        </div>
    );
};

export default Reports;

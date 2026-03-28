import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Briefcase, Users, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';

const MarketplaceDashboard = () => {
    const { leads, professionals, dashboardStats } = useMarketplace();

    const totalLeads = dashboardStats?.totalLeads || leads.length;
    const leadsToday = dashboardStats?.leadsToday || 0;
    const totalProfessionals = dashboardStats?.totalProfessionals || professionals.length;
    const conversionRate = dashboardStats?.conversionRate || 0;

    const stats = [
        { name: 'Total Leads', value: totalLeads, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8%', up: true },
        { name: 'Total Professionals', value: totalProfessionals, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+12%', up: true },
        { name: 'Leads Today', value: leadsToday, icon: Activity, color: 'text-green-600', bg: 'bg-green-50', trend: '+5%', up: true },
        { name: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', trend: '-2%', up: false },
    ];

    // Mock weekly data based on today's leads just for visual activity
    const weeklyData = [40, 70, 55, 90, 65, 80, leadsToday * 10 || 50];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Marketplace Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Platform performance and key metrics</p>
                </div>
                <select className="bg-white border border-gray-200 rounded-xl text-sm shadow-sm py-2.5 px-4 font-medium text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer">
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>This Year</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className={`p-2 rounded-lg sm:rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                            </div>
                            <span className={`flex items-center gap-1 text-[10px] sm:text-xs font-bold ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                                {stat.up ? <ArrowUpRight size={12} className="sm:w-3.5" /> : <ArrowDownRight size={12} className="sm:w-3.5" />}
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest truncate">{stat.name}</p>
                        <p className="text-lg font-bold text-gray-900 mt-1 truncate">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Lead Activity Chart Placeholder */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col min-h-[320px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Lead Activity</h2>
                        <div className="flex gap-2 text-xs font-bold">
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg transition-colors">Weekly</button>
                            <button className="px-3 py-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">Monthly</button>
                        </div>
                    </div>

                    {/* Mock bar chart */}
                    <div className="flex-1 flex items-end gap-2 pb-4 border-b border-gray-100">
                        {weeklyData.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className="w-full rounded-t-lg bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
                                    style={{ height: `${h}%`, minHeight: '8px' }}
                                ></div>
                                <span className="text-[10px] font-bold text-gray-400">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-4 text-center">Lead submissions per day this week</p>
                </div>

                {/* Growth Stats Placeholder */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col min-h-[320px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Growth Stats</h2>
                        <button className="text-blue-600 text-xs font-bold hover:underline cursor-pointer">Full Report →</button>
                    </div>

                    <div className="space-y-5 flex-1">
                        {[
                            { label: 'New Professionals', value: 78, max: 100, color: 'bg-purple-500' },
                            { label: 'Lead Completion Rate', value: conversionRate, max: 100, color: 'bg-green-500' },
                            { label: 'Platform Active Usage', value: 83, max: 100, color: 'bg-blue-500' },
                            { label: 'Customer Retention', value: 91, max: 100, color: 'bg-orange-500' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                    <span className="text-sm font-bold text-gray-900">{parseFloat(item.value).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center px-8 py-5 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">Recent Lead Activity</h2>
                    <button className="text-blue-600 text-xs font-bold hover:underline cursor-pointer">View All Leads →</button>
                </div>

                {/* Desktop View */}
                <div className="hidden sm:block divide-y divide-gray-50">
                    {leads.slice(0, 5).map(lead => (
                        <div key={lead.id} className="flex justify-between items-center px-8 py-4 hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                                    {lead.customerName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{lead.customerName}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{lead.serviceCategory} {lead.location && `• ${lead.location}`}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-xs text-gray-400">
                                    {lead.dateRequested ? new Date(lead.dateRequested).toLocaleDateString() : 'Today'}
                                </p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                    ${lead.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                                        lead.status === 'Assigned' ? 'bg-yellow-100 text-yellow-700' :
                                            lead.status === 'Accepted' || lead.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'}`}>
                                    {lead.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {leads.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">No recent leads found.</div>
                    )}
                </div>

                {/* Mobile View */}
                <div className="sm:hidden divide-y divide-gray-50">
                    {leads.slice(0, 5).map(lead => (
                        <div key={lead.id} className="p-5 space-y-3 hover:bg-gray-50/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                                        {lead.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{lead.customerName}</p>
                                        <p className="text-[11px] text-blue-600 font-bold">{lead.serviceCategory}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold 
                                    ${lead.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                                        lead.status === 'Assigned' ? 'bg-yellow-100 text-yellow-700' :
                                            lead.status === 'Accepted' || lead.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'}`}>
                                    {lead.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-gray-400">
                                <span className="flex items-center gap-1 font-medium italic truncate max-w-[150px]">
                                    {lead.location || 'No location'}
                                </span>
                                <span className="font-bold">
                                    {lead.dateRequested ? new Date(lead.dateRequested).toLocaleDateString() : 'Today'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {leads.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">No recent leads found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketplaceDashboard;

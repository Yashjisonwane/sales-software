import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ChevronLeft, MoreVertical, Camera, ClipboardCheck, FileText, Receipt, User, Phone, MapPin, Calendar, Clock, MessageSquare, History, Tag, ArrowRight } from 'lucide-react';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { jobs } = useMarketplace();
    
    const job = jobs.find(j => j.id === id);

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <ClipboardCheck size={32} className="text-gray-200" />
                </div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Entry Not Found</p>
                <button onClick={() => navigate('/admin/jobs')} className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">Return to Registry</button>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'text-blue-600 bg-blue-50';
            case 'In Progress': return 'text-yellow-600 bg-yellow-50';
            case 'Completed': return 'text-green-600 bg-green-50';
            case 'Estimated': return 'text-indigo-600 bg-indigo-50';
            case 'Invoiced': return 'text-purple-600 bg-purple-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const actionTools = [
        { icon: Camera, label: 'Add Photos', color: 'text-rose-600 bg-rose-50' },
        { icon: ClipboardCheck, label: 'Inspection', color: 'text-amber-600 bg-amber-50' },
        { icon: FileText, label: 'Create Estimate', color: 'text-blue-600 bg-blue-50' },
        { icon: Receipt, label: 'Create Invoice', color: 'text-indigo-600 bg-indigo-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header / Top Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/admin/jobs')}
                        className="h-14 w-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all shadow-sm group"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">#{job.id}</h1>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${getStatusColor(job.status)}`}>
                                {job.status}
                            </span>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                             <User size={12} className="text-blue-600" />
                             Managed by {job.professionalName}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-4 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-all">
                        Edit Metadata
                    </button>
                    <button className="p-4 bg-white border border-gray-100 rounded-[2rem] text-gray-400 hover:text-gray-900 shadow-sm transition-all">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Action Buttons (CRITICAL) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {actionTools.map((tool, idx) => (
                    <button 
                        key={idx}
                        className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${tool.color}`}>
                            <tool.icon size={22} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Action Step</p>
                        <h4 className="text-sm font-black text-gray-900">{tool.label}</h4>
                    </button>
                ))}
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: Info Blocks */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Job Details Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
                        <div className="flex justify-between items-start">
                             <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                 <Tag size={20} className="text-blue-500" /> Job Information
                             </h3>
                             <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Modify Specs</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Service Segment</p>
                                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                                     <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Tag size={16}/></div>
                                     <span className="text-sm font-black text-gray-800">{job.category}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Schedule Window</p>
                                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                                     <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Calendar size={16}/></div>
                                     <span className="text-sm font-black text-gray-800">{job.date}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Timestamp</p>
                                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                                     <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><Clock size={16}/></div>
                                     <span className="text-sm font-black text-gray-800">{job.time || '10:00 AM'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Job Description / Objective</p>
                             <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 text-sm font-bold text-gray-500 leading-relaxed italic">
                                 "{job.description || 'Initial deployment for standard service operations. All baseline requirements to be established upon site arrival.'}"
                             </div>
                        </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 space-y-10">
                        <div className="flex justify-between items-start">
                             <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                 <User size={20} className="text-indigo-500" /> Customer Insights
                             </h3>
                             <button className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                 <MessageSquare size={16} />
                             </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-indigo-50 text-indigo-700 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-inner border border-indigo-100">
                                    {job.customerName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-gray-900 tracking-tight mb-2">{job.customerName}</h4>
                                    <div className="flex flex-wrap gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <span className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">Residential</span>
                                        <span className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">Priority: Lead</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-gray-500 hover:text-gray-900 transition-colors group cursor-pointer">
                                     <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all"><Phone size={18} /></div>
                                     <span className="text-sm font-black tracking-tight">{job.phone}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-500 hover:text-gray-900 transition-colors group cursor-pointer">
                                     <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all"><MapPin size={18} /></div>
                                     <span className="text-sm font-black tracking-tight leading-tight">{job.address || job.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar Content */}
                <div className="space-y-8">
                    {/* Activity Feed Placeholder */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col h-full min-h-[400px]">
                        <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
                            <History size={18} className="text-gray-400" /> Activity Stream
                        </h3>
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8 opacity-40">
                             <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                                 <History size={28} />
                             </div>
                             <div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status: Initialized</p>
                                 <p className="text-xs font-bold text-gray-400 italic">"Real-time event synchronization will initialize upon first status change."</p>
                             </div>
                        </div>
                        <div className="pt-8 border-t border-gray-50">
                             <button className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all flex items-center justify-center gap-2 group">
                                 View Full History <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;

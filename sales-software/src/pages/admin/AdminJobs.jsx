import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Plus, Search, Filter, MoreHorizontal, User, Phone, MapPin, Calendar, Clock, ChevronRight, X, Briefcase, Tag, Map, Eye, Edit2, Trash2, CheckCircle2, Download } from 'lucide-react';

const AdminJobs = () => {
    const navigate = useNavigate();
    const { jobs, professionals, categories, addJob, deleteJob, updateJob } = useMarketplace();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [currentJobId, setCurrentJobId] = useState(null);
    const [viewData, setViewData] = useState(null);
    
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        category: '',
        date: '',
        time: '',
        professionalId: '',
        location: '',
        description: '',
        status: 'Scheduled'
    });

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = 
            job?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job?.displayId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job?.category?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Normalize status for comparison (handle 'In Progress' vs 'IN_PROGRESS' etc if needed)
        const jobStatus = (job?.status || '').toUpperCase().replace(/_/g, ' ');
        const filterStatus = statusFilter.toUpperCase();
        
        const matchesStatus = statusFilter === 'All' || jobStatus === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateJob(currentJobId, formData);
        } else {
            addJob({ ...formData, id: `JOB-${1000 + jobs.length + 1}` });
        }
        closeModal();
    };

    const closeModal = () => {
        setShowForm(false);
        setIsEditing(false);
        setIsViewing(false);
        setCurrentJobId(null);
        setViewData(null);
        setFormData({ customerName: '', phone: '', category: '', date: '', time: '', professionalId: '', location: '', description: '', status: 'Scheduled' });
    };

    const handleView = (job) => {
        setViewData(job);
        setIsViewing(true);
    };

    const handleEdit = (job) => {
        setFormData({
            customerName: job.customerName,
            phone: job.phone,
            category: job.category,
            date: job.date,
            time: job.time,
            professionalId: job.professionalId || '',
            location: job.location,
            description: job.description,
            status: job.status || 'Scheduled'
        });
        setCurrentJobId(job.id);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('CRITICAL: Are you sure you want to delete this job record? This cannot be undone.')) {
            deleteJob(id);
        }
    };

    const getStatusColor = (status = '') => {
        const s = status.toUpperCase().replace(/_/g, ' ');
        switch (s) {
            case 'SCHEDULED': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'IN PROGRESS': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'COMPLETED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'ESTIMATED': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
            case 'INVOICED': return 'text-purple-600 bg-purple-50 border-purple-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage service operations and professional assignments.</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95 w-full md:w-auto justify-center"
                >
                    <Plus size={16} /> Create Job
                </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col xl:flex-row gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search by client, ID or service..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    {['All', 'Scheduled', 'In Progress', 'Estimated', 'Invoiced', 'Completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${statusFilter === status ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                
                <button className="hidden xl:flex items-center justify-center px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:text-gray-700 transition shadow-sm gap-2">
                     <Download size={14} /> Export
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Assigned Pro</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Scheduled</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredJobs.map(job => (
                                <tr 
                                    key={job.id} 
                                    className="group hover:bg-blue-50/20 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">{job.displayId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100 shadow-sm">
                                                {job.customerName?.charAt(0)}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-bold text-gray-700">{job.customerName}</p>
                                                <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                                                    <Phone size={10} className="text-blue-400" /> {job.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                            <span className="text-sm font-semibold text-gray-600">{job.category}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] border border-slate-200">
                                                {job.professionalName?.charAt(0) || '?'}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-bold text-gray-800">{job.professionalName}</p>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Assigned Expert</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-gray-700">
                                                <Calendar size={12} className="text-gray-400" />
                                                <p className="text-xs font-bold">{job.date}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Clock size={12} />
                                                <p className="text-[11px] font-medium">{job.time || '10:00 AM'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleView(job); }}
                                                className="h-10 w-10 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 rounded-xl transition-all shadow-sm flex items-center justify-center group/btn"
                                                title="Quick View"
                                            >
                                                <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEdit(job); }}
                                                className="h-10 w-10 bg-white border border-gray-100 text-gray-400 hover:text-amber-600 hover:border-amber-100 hover:bg-amber-50/50 rounded-xl transition-all shadow-sm flex items-center justify-center group/btn"
                                                title="Edit Job"
                                            >
                                                <Edit2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(job.id); }}
                                                className="h-10 w-10 bg-white border border-gray-100 text-gray-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50/50 rounded-xl transition-all shadow-sm flex items-center justify-center group/btn"
                                                title="Delete Job"
                                            >
                                                <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredJobs.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto border border-gray-100">
                                <Briefcase size={28} className="text-gray-200" />
                            </div>
                            <p className="text-sm font-medium text-gray-400">No job records found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Job Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setShowForm(false)}></div>
                    
                    <div className="relative w-[95%] sm:max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-4 shrink-0 bg-white border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    {isEditing ? <Edit2 size={22} /> : <Briefcase size={22} />}
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">{isEditing ? 'Modify Job Order' : 'Create New Job'}</h2>
                            </div>
                            <button 
                                onClick={() => setShowForm(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-8 pt-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Customer Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="e.g. John Doe"
                                        value={formData.customerName}
                                        onChange={e => setFormData({...formData, customerName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="555-0000"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Service Category</label>
                                    <select 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Assign Professional</label>
                                    <select 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                        value={formData.professionalId}
                                        onChange={e => setFormData({...formData, professionalId: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Professional</option>
                                        {professionals.map(pro => (
                                            <option key={pro.id} value={pro.id}>{pro.name} ({pro.category})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Schedule Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={formData.date}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Schedule Time</label>
                                    <input 
                                        type="time" 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={formData.time}
                                        onChange={e => setFormData({...formData, time: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Service Location</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Enter full address or drop pin..."
                                    value={formData.location}
                                    onChange={e => setFormData({...formData, location: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Job Status</label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                    required
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Estimated">Estimated</option>
                                    <option value="Invoiced">Invoiced</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Job Description</label>
                                <textarea 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    rows={3}
                                    placeholder="Brief description of work to be performed..."
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm w-full"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className={`px-6 py-3 ${isEditing ? 'bg-amber-600' : 'bg-blue-600'} text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-200 w-full`}
                                >
                                    {isEditing ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                                    <span>{isEditing ? 'Save Changes' : 'Create Job'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Detail Modal - Matches Edit UI Style */}
            {isViewing && viewData && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" onClick={closeModal}></div>
                    
                    <div className="relative w-[95%] sm:max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-4 shrink-0 bg-white border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    <Eye size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Review Job Record</h2>
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{viewData.displayId}</p>
                                </div>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 sm:px-8 pb-8 pt-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Customer Name</label>
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-800">{viewData.customerName}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Phone Number</label>
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-800">{viewData.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Service Category</label>
                                    <div className="flex items-center gap-2">
                                        <Tag size={14} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-800">{viewData.category}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Assigned Professional</label>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={14} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-800">{viewData.professionalName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Scheduled Date</label>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-800">{viewData.date}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Current Status</label>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-gray-400" />
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusColor(viewData.status)}`}>
                                            {viewData.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Work Location</label>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400" />
                                    <p className="text-sm font-bold text-gray-800">{viewData.location}</p>
                                </div>
                            </div>

                            <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Job Description</label>
                                <p className="text-sm text-gray-600 leading-relaxed italic">
                                    "{viewData.description || 'No specific description provided.'}"
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button 
                                    onClick={closeModal}
                                    className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm w-full"
                                >
                                    Close View
                                </button>
                                <button 
                                    onClick={() => navigate(`/admin/jobs/${viewData.id}`)}
                                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-md w-full"
                                >
                                    <span>Manage Job</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminJobs;

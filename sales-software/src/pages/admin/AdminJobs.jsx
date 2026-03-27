import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Plus, Search, Filter, MoreHorizontal, User, Phone, MapPin, Calendar, Clock, ChevronRight, X, Briefcase, Tag, Map } from 'lucide-react';

const AdminJobs = () => {
    const navigate = useNavigate();
    const { jobs, professionals, addJob } = useMarketplace();
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        category: '',
        date: '',
        time: '',
        professionalId: '',
        location: '',
        description: ''
    });

    const filteredJobs = jobs.filter(job => 
        job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        addJob(formData);
        setShowForm(false);
        setFormData({ customerName: '', phone: '', category: '', date: '', time: '', professionalId: '', location: '', description: '' });
    };

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
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95"
                >
                    <Plus size={16} /> Create Job
                </button>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by client, ID or service..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:text-gray-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                             <Filter size={14} /> Filter
                        </button>
                        <button className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:text-gray-700 transition-colors shadow-sm">
                             Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
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
                                    onClick={() => navigate(`/admin/jobs/${job.id}`)}
                                    className="group hover:bg-blue-50/20 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{job.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                {job.customerName.charAt(0)}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium text-gray-700">{job.customerName}</p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    {job.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{job.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                                                {job.professionalName.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{job.professionalName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <p className="text-sm text-gray-700 font-medium">{job.date}</p>
                                            <p className="text-xs text-gray-400">{job.time || '10:00 AM'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-400">
                                        <ChevronRight size={18} className="inline group-hover:translate-x-1 transition-transform" />
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
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setShowForm(false)}></div>
                    
                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="flex items-center justify-between px-8 pt-8 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    <Briefcase size={22} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Create New Job</h2>
                            </div>
                            <button 
                                onClick={() => setShowForm(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-3">
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

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Service Category</label>
                                    <select 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Cleaning">Cleaning</option>
                                        <option value="Roofing">Roofing</option>
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

                            <div className="grid grid-cols-2 gap-3">
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
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Job Description</label>
                                <textarea 
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    rows={3}
                                    placeholder="Brief description of work to be performed..."
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-200"
                                >
                                    <Plus size={16} />
                                    <span>Create Job</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminJobs;

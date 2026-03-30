import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, CheckCircle, XCircle, Edit, Plus, Star, X, Save, Users, Trash2, Eye, EyeOff, AlertCircle, Activity, MapPin, Wrench, Zap, Sparkles, Wind, Home, Package, TreePine, Paintbrush, Clock, ShieldCheck, Mail, Phone, Building } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import CategoryModal from '../../components/admin/CategoryModal';

const BLANK_PRO = {
    name: '', businessName: '', category: '', 
    address: '', city: '', state: '', pincode: '',
    phone: '', email: '', hourlyRate: '', serviceRadius: 20,
    availability: 'Available', status: 'Active', rating: 0,
    completedJobs: 0, reviews: 0, subscriptionPlan: 'Starter',
    password: '', confirmPassword: '',
    trackingEnabled: false, lat: '', lng: ''
};

const CATEGORIES = ['General', 'Plumbing', 'Electrical', 'Cleaning', 'HVAC', 'Roofing', 'Painting', 'Handyman', 'Landscaping'];

const categoryIcons = {
    'Plumbing': Wrench,
    'Electrical': Zap,
    'Cleaning': Sparkles,
    'HVAC': Wind,
    'Roofing': Home,
    'Painting': Paintbrush,
    'Handyman': Package,
    'Landscaping': TreePine
};

const Field = ({ label, name, type = 'text', as, children, required, value, error, onChange, showToggle, onToggle, isVisible }) => (
    <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
            {as === 'select' ? (
                <select
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${error ? 'border-red-400' : 'border-gray-200'}`}
                >
                    {children}
                </select>
            ) : (
                <>
                    <input
                        type={showToggle ? (isVisible ? 'text' : 'password') : type}
                        name={name}
                        value={value ?? ''}
                        onChange={onChange}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-200'} ${showToggle ? 'pr-11' : ''}`}
                    />
                    {showToggle && (
                        <button
                            type="button"
                            onClick={onToggle}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    )}
                </>
            )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const AdminProfessionals = () => {
    const [searchParams] = useSearchParams();
    const querySearch = searchParams.get('search') || '';

    const { 
        professionals, addProfessional, editProfessional, removeProfessional, 
        categories, addCategory, professionalRequests, 
        approveProfessionalRequest, rejectProfessionalRequest, 
        refreshData, subscriptionPlans 
    } = useMarketplace();
    
    const [activeTab, setActiveTab] = useState('active');
    const [searchTerm, setSearchTerm] = useState(querySearch);
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [modalMode, setModalMode] = useState(null);
    const [formData, setFormData] = useState(BLANK_PRO);
    const [formErrors, setFormErrors] = useState({});
    const [showPasswords, setShowPasswords] = useState(false);
    const [toast, setToast] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedPro, setSelectedPro] = useState(null);
    const [approvalDetails, setApprovalDetails] = useState(null);
    
    // Category management
    const availableCategories = Array.from(new Set([
        ...CATEGORIES, 
        ...(categories || []).map(c => c.name)
    ])).sort();
    
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    useEffect(() => {
        if (querySearch) setSearchTerm(querySearch);
        // Refresh requests and pros on page mount
        if (refreshData) refreshData();
    }, [querySearch, refreshData]);

    // Filtering Professionals
    const filteredPros = professionals.filter(pro => {
        const terms = searchTerm.toLowerCase();
        const matchSearch = (pro.name || '').toLowerCase().includes(terms) ||
            (pro.category || '').toLowerCase().includes(terms) ||
            (pro.location || '').toLowerCase().includes(terms);
        
        const jobStatus = (pro.status || '').toUpperCase();
        let matchStatus = statusFilter === 'All';
        if (!matchStatus) {
            if (statusFilter === 'Suspended') matchStatus = ['SUSPENDED', 'OFFLINE', 'INACTIVE'].includes(jobStatus);
            else matchStatus = jobStatus === statusFilter.toUpperCase();
        }
        
        const matchCategory = categoryFilter === 'All Categories' || pro.category === categoryFilter;
        return matchSearch && matchStatus && matchCategory;
    });

    // Filtering Requests
    const filteredRequests = professionalRequests.filter(req => {
        const terms = searchTerm.toLowerCase();
        // Only show PENDING requests in the New Requests tab
        if ((req.status || '').toUpperCase() !== 'PENDING') return false;
        
        return (req.name || '').toLowerCase().includes(terms) ||
               (req.businessName || '').toLowerCase().includes(terms) ||
               (req.email || '').toLowerCase().includes(terms) ||
               (req.category || '').toLowerCase().includes(terms);
    });

    const proCounts = {
        All: professionals.length,
        Active: professionals.filter(p => (p.status || '').toUpperCase() === 'ACTIVE').length,
        Suspended: professionals.filter(p => ['SUSPENDED', 'OFFLINE', 'INACTIVE'].includes((p.status || '').toUpperCase())).length,
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const openAdd = () => { setFormData({ ...BLANK_PRO }); setFormErrors({}); setModalMode('add'); };
    const openEdit = (pro) => { 
        setFormData({ 
            ...BLANK_PRO, 
            ...pro,
            address: pro.address || '',
            city: pro.city || '',
            state: pro.state || '',
            pincode: pro.pincode || '',
            hourlyRate: pro.hourlyRate || '',
            subscriptionPlan: pro.subscriptionPlan || 'Starter',
            serviceRadius: pro.serviceRadius || 20,
            status: pro.status || 'Active'
        }); 
        setFormErrors({}); 
        setModalMode('edit'); 
    };
    const closeModal = () => { setModalMode(null); setApprovalDetails(null); };

    const handleField = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Required';
        if (!formData.category) errors.category = 'Required';
        if (!formData.address?.trim()) errors.address = 'Required';
        if (!formData.city?.trim()) errors.city = 'Required';
        if (!formData.pincode?.trim()) errors.pincode = 'Required';
        if (!formData.email.trim()) errors.email = 'Required';
        if (!formData.phone.trim()) errors.phone = 'Required';

        if (modalMode === 'add') {
            if (!formData.password) errors.password = 'Required';
            else if (formData.password.length < 8) errors.password = 'Min 8 chars';
            if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Mismatch';
        } else if (modalMode === 'edit' && formData.password) {
            // Optional password reset during edit
            if (formData.password.length < 8) errors.password = 'Min 8 chars';
            if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Mismatch';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        let res;
        if (modalMode === 'add') res = await addProfessional(formData);
        else res = await editProfessional(formData.id, formData);
        
        if (res) {
            showToast(modalMode === 'add' ? 'Added successfully' : 'Updated successfully');
            closeModal();
        }
    };

    const handleStatusToggle = (pro) => {
        const newStatus = pro.status === 'Active' ? 'Suspended' : 'Active';
        editProfessional(pro.id, { status: newStatus });
    };

    const handleDelete = (pro) => {
        setSelectedPro(pro);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedPro) return;
        const success = await removeProfessional(selectedPro.id);
        if (success) {
            showToast('Professional removed from database', 'success');
            setShowDeleteConfirm(false);
            setSelectedPro(null);
        }
    };

    const handleApproveRequest = async (id) => {
        const data = await approveProfessionalRequest(id);
        if (data) {
            setApprovalDetails(data);
            setModalMode('approve-success');
        }
    };

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                    {toast.message}
                    <button onClick={() => setToast(null)}><X size={16} /></button>
                </div>
            )}

            {/* Modal for Add/Edit Professional */}
            {(modalMode === 'add' || modalMode === 'edit') && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg`}>
                                   {modalMode === 'add' ? <Plus size={20} /> : <Edit size={20} />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {modalMode === 'add' ? 'New Professional' : 'Edit Professional'}
                                    </h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{modalMode === 'add' ? 'Register Provider' : formData.name}</p>
                                </div>
                            </div>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="px-8 py-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
                            <Field label="Full Name" name="name" required value={formData.name} error={formErrors.name} onChange={handleField} />
                            <Field label="Business Name" name="businessName" value={formData.businessName} error={formErrors.businessName} onChange={handleField} />

                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <Field label="Category" name="category" as="select" required value={formData.category} error={formErrors.category} onChange={handleField}>
                                            <option value="">Select category</option>
                                            {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </Field>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setIsCategoryModalOpen(true)}
                                        className="mb-[1px] p-[10px] bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100/50 shadow-sm flex items-center justify-center shrink-0"
                                        title="Create New Category"
                                    >
                                        <Plus size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                                <Field label="Hourly Rate" name="hourlyRate" value={formData.hourlyRate} error={formErrors.hourlyRate} onChange={handleField} />
                            </div>

                            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                                            <Activity size={14} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">Live Tracking</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={formData.trackingEnabled}
                                            onChange={(e) => setFormData(prev => ({ ...prev, trackingEnabled: e.target.checked }))}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium">When enabled, the professional's GPS coordinates will be tracked every 15 seconds while they are online.</p>
                            </div>

                            <Field label="Street Address" name="address" required value={formData.address} error={formErrors.address} onChange={handleField} />
                            
                            <div className="grid grid-cols-3 gap-4">
                                <Field label="City" name="city" required value={formData.city} error={formErrors.city} onChange={handleField} />
                                <Field label="State" name="state" value={formData.state} error={formErrors.state} onChange={handleField} />
                                <Field label="Pincode" name="pincode" required value={formData.pincode} error={formErrors.pincode} onChange={handleField} />
                            </div>

                            {/* Map Location Picker Placeholder */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Base Location (Map)</label>
                                <div className="h-32 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=19.0760,72.8777&zoom=11&size=400x200&sensor=false')] bg-cover opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative z-10 flex flex-col items-center pointer-events-none">
                                        <MapPin className="text-blue-600 mb-1" size={24} />
                                        <p className="text-[10px] font-bold text-gray-600 bg-white/80 px-2 py-1 rounded-full border border-gray-200">19.0760, 72.8777</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, lat: '19.0760', lng: '72.8777' }));
                                        }}
                                        className="absolute inset-x-0 bottom-0 py-2 bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform"
                                    >
                                        Drop Pin to Current Address
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Phone" name="phone" type="tel" required value={formData.phone} error={formErrors.phone} onChange={handleField} />
                                <Field label="Email" name="email" type="email" required value={formData.email} error={formErrors.email} onChange={handleField} />
                            </div>
                            <Field label="Performance Rating (0-5)" name="rating" type="number" step="0.1" max="5" min="0" value={formData.rating} error={formErrors.rating} onChange={handleField} />

                            {(modalMode === 'add' || modalMode === 'edit') && (
                                <div className={`p-5 rounded-[20px] mb-4 ${modalMode === 'edit' ? 'bg-amber-50/50 border border-amber-100/50 shadow-inner' : ''}`}>
                                    {modalMode === 'edit' && <p className="text-[9px] uppercase font-black text-amber-600 mb-3 tracking-[0.1em] text-center opacity-80">Reset Account Password (Optional)</p>}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field
                                            label={modalMode === 'edit' ? "New Password" : "Password"}
                                            name="password"
                                            required={modalMode === 'add'}
                                            type="password"
                                            value={formData.password}
                                            error={formErrors.password}
                                            onChange={handleField}
                                            showToggle
                                            isVisible={showPasswords}
                                            onToggle={() => setShowPasswords(!showPasswords)}
                                        />
                                        <Field
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            required={modalMode === 'add'}
                                            type="password"
                                            value={formData.confirmPassword}
                                            error={formErrors.confirmPassword}
                                            onChange={handleField}
                                            showToggle
                                            isVisible={showPasswords}
                                            onToggle={() => setShowPasswords(!showPasswords)}
                                        />
                                    </div>
                                    {modalMode === 'edit' && <p className="text-[8px] text-amber-500/70 mt-2 text-center font-medium">Leave both blank if you don't want to change the password.</p>}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Availability" name="availability" as="select" value={formData.availability} onChange={handleField}>
                                    <option>Available</option>
                                    <option>Busy</option>
                                    <option>Suspended</option>
                                </Field>
                                <Field label="Status" name="status" as="select" value={formData.status} onChange={handleField}>
                                    <option>Active</option>
                                    <option>Suspended</option>
                                </Field>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Subscription Plan" name="subscriptionPlan" as="select" value={formData.subscriptionPlan} onChange={handleField}>
                                    <option>Starter</option>
                                    <option>Pro</option>
                                    <option>Premium</option>
                                </Field>
                                <Field label="Service Radius (mi)" name="serviceRadius" type="number" value={formData.serviceRadius} onChange={handleField} />
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="px-8 py-5 border-t border-gray-100 flex gap-3">
                            <button onClick={closeModal} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors">
                                <Save size={15} />
                                {modalMode === 'add' ? 'Add Professional' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approval Success Modal */}
            {modalMode === 'approve-success' && approvalDetails && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-scale-in">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-50">
                            <ShieldCheck size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Professional Approved!</h2>
                        <p className="text-sm text-gray-500 mb-8 font-medium">Account created for <span className="text-gray-900 font-bold">{approvalDetails.user.email}</span>. Share the generated password below with the professional.</p>
                        
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 relative group">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">One-Time Password</p>
                            <p className="text-3xl font-black text-blue-600 tracking-wider">
                                {approvalDetails.generatedPassword}
                            </p>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(approvalDetails.generatedPassword);
                                    showToast("Password copied to clipboard!", "success");
                                }}
                                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Copy Password"
                            >
                                <Plus size={16} className="rotate-45" />
                            </button>
                        </div>

                        <button onClick={closeModal} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold tracking-tight hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200">
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Professionals</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage providers and review signup requests.</p>
                </div>
                <div className="flex items-center gap-3">
                    {activeTab === 'active' && (
                        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all flex items-center gap-2">
                            <Plus size={16} /> Add Professional
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-100">
                <button 
                    onClick={() => setActiveTab('active')}
                    className={`pb-3 text-sm font-bold relative transition-all ${activeTab === 'active' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    All Professionals
                    {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </button>
                <button 
                    onClick={() => setActiveTab('requests')}
                    className={`pb-3 text-sm font-bold relative transition-all ${activeTab === 'requests' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    New Requests
                    {professionalRequests.length > 0 && <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{professionalRequests.filter(r => (r.status || '').toUpperCase() === 'PENDING').length}</span>}
                    {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or category..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {activeTab === 'active' && (
                    <div className="flex gap-2">
                        {['All', 'Active', 'Suspended'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${statusFilter === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Table Section */}
            {activeTab === 'active' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto text-sm font-bold">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Name', 'Category', 'Location', 'Rating', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {filteredPros.map(pro => (
                                    <tr key={pro.id} className="hover:bg-blue-50/20">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{pro.name}</div>
                                            <div className="text-[10px] text-gray-400 font-medium">{pro.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] uppercase">{pro.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-medium">{pro.city || pro.location}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 font-bold">
                                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                {pro.rating || '0.0'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${pro.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                                {(pro.status === 'Offline' || pro.status === 'Suspended') ? 'Suspended' : pro.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => openEdit(pro)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                                                <button onClick={() => handleStatusToggle(pro)} className={`p-2 rounded-lg ${pro.status === 'Active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`} title={pro.status === 'Active' ? 'Suspend' : 'Approve'}>
                                                    {pro.status === 'Active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                                </button>
                                                <button onClick={() => handleDelete(pro)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Applicant', 'Business', 'Specialty', 'Contact', 'Location', 'Plan', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-blue-50/10">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{req.name}</div>
                                            <div className="text-[10px] text-gray-400 uppercase font-black">{req.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-blue-600 text-xs">{req.businessName || '—'}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-600">{req.category}</td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-500">{req.phone}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-gray-700">{req.city}, {req.state}</div>
                                            <div className="text-[10px] text-gray-400">{req.pincode}</div>
                                            <div className="text-[9px] text-gray-400 truncate max-w-[150px]">{req.address}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{req.preferredPlan}</div>
                                            <div className="text-[10px] text-blue-600 font-bold">
                                                ₹{subscriptionPlans?.find(p => p.name === req.preferredPlan)?.price || '—'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleApproveRequest(req.id)} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 shadow-sm transition-all active:scale-95">Approve</button>
                                                    <button onClick={() => rejectProfessionalRequest(req.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Reject"><Trash2 size={18} /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => { setShowDeleteConfirm(false); setSelectedPro(null); }}
                onConfirm={handleConfirmDelete}
                title="Delete Professional"
                message={`Are you sure you want to delete ${selectedPro?.name}?`}
                confirmText="Delete"
                type="danger"
            />
            <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSave={async (data) => { await addCategory(data); setIsCategoryModalOpen(false); }} />
        </div>
    );
};

export default AdminProfessionals;

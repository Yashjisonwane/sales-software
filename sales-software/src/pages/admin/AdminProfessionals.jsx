import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { professionalsData } from '../../data/models';
import { Search, CheckCircle, XCircle, Edit, Plus, Star, X, Save, Users, Trash2, Eye, EyeOff, AlertCircle, Activity, MapPin, Wrench, Zap, Sparkles, Wind, Home, Package, TreePine, Paintbrush } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import CategoryModal from '../../components/admin/CategoryModal';

const initialPros = professionalsData.map(p => ({ ...p, status: p.status || 'Active' }));

const BLANK_PRO = {
    name: '', businessName: '', category: '', 
    address: '', city: '', state: '', pincode: '',
    phone: '', email: '', hourlyRate: '', serviceRadius: 20,
    availability: 'Available', status: 'Active', rating: 0,
    completedJobs: 0, reviews: 0, subscriptionPlan: 'Starter',
    password: '', confirmPassword: '',
    trackingEnabled: false, lat: '', lng: ''
};

const CATEGORIES = ['Plumbing', 'Electrical', 'Cleaning', 'HVAC', 'Roofing', 'Painting', 'Handyman', 'Landscaping'];

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

// ── Field is defined OUTSIDE the component to prevent remount on every keystroke ──
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

    const [professionals, setProfessionals] = useState(initialPros);
    const [searchTerm, setSearchTerm] = useState(querySearch);
    const [statusFilter, setStatusFilter] = useState('All');
    const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit'
    const [formData, setFormData] = useState(BLANK_PRO);
    const [formErrors, setFormErrors] = useState({});
    const [showPasswords, setShowPasswords] = useState(false);
    const [toast, setToast] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedPro, setSelectedPro] = useState(null);
    
    // Category management
    const [availableCategories, setAvailableCategories] = useState(CATEGORIES);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Sync search term if query param changes
    useEffect(() => {
        if (querySearch) {
            setSearchTerm(querySearch);
        }
    }, [querySearch]);

    // ── Filtering ─────────────────────────────────────────────
    const filtered = professionals.filter(pro => {
        const terms = searchTerm.toLowerCase();
        const matchSearch = pro.name.toLowerCase().includes(terms) ||
            pro.category.toLowerCase().includes(terms) ||
            pro.location.toLowerCase().includes(terms);
        const matchStatus = statusFilter === 'All' || pro.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const counts = {
        All: professionals.length,
        Active: professionals.filter(p => p.status === 'Active').length,
        Suspended: professionals.filter(p => p.status === 'Suspended').length,
        Pending: professionals.filter(p => p.status === 'Pending').length,
    };

    // ── Toast ─────────────────────────────────────────────────
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Modal ─────────────────────────────────────────────────
    const openAdd = () => { setFormData({ ...BLANK_PRO }); setFormErrors({}); setModalMode('add'); };
    const openEdit = (pro) => { setFormData({ ...pro }); setFormErrors({}); setModalMode('edit'); };
    const closeModal = () => setModalMode(null);

    const handleField = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required.';
        if (!formData.category) errors.category = 'Category is required.';
        if (!formData.address?.trim()) errors.address = 'Address is required.';
        if (!formData.city?.trim()) errors.city = 'City is required.';
        if (!formData.pincode?.trim()) errors.pincode = 'Pincode is required.';
        if (!formData.email.trim()) errors.email = 'Email is required.';
        if (!formData.phone.trim()) errors.phone = 'Phone is required.';

        if (modalMode === 'add') {
            if (!formData.password) {
                errors.password = 'Password is required.';
            } else if (formData.password.length < 8) {
                errors.password = 'Password must be at least 8 characters.';
            }
            if (formData.confirmPassword !== formData.password) {
                errors.confirmPassword = 'Passwords do not match.';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleQuickAddCategory = (categoryData) => {
        if (!availableCategories.includes(categoryData.name)) {
            setAvailableCategories(prev => [...prev, categoryData.name]);
            setFormData(prev => ({ ...prev, category: categoryData.name }));
            showToast(`✨ ${categoryData.name} added and selected!`, 'info');
        }
        setIsCategoryModalOpen(false);
    };

    // ── CRUD ──────────────────────────────────────────────────
    const handleSave = () => {
        if (!validate()) return;
        if (modalMode === 'add') {
            const newPro = {
                ...formData,
                id: `P${String(professionals.length + 1).padStart(3, '0')}`,
                services: [formData.category],
                completedJobs: 0, rating: 0, reviews: 0,
            };
            setProfessionals(prev => [newPro, ...prev]);
            showToast(`✅ ${newPro.name} added successfully!`, 'success');
        } else {
            setProfessionals(prev => prev.map(p => p.id === formData.id ? { ...formData } : p));
            showToast(`✏️ ${formData.name} updated!`, 'info');
        }
        closeModal();
    };

    const handleStatusToggle = (pro) => {
        const newStatus = pro.status === 'Active' ? 'Suspended' : 'Active';
        setProfessionals(prev => prev.map(p => p.id === pro.id ? { ...p, status: newStatus } : p));
        showToast(
            newStatus === 'Suspended' ? `🚫 ${pro.name} suspended.` : `✅ ${pro.name} approved.`,
            newStatus === 'Suspended' ? 'error' : 'success'
        );
    };

    const handleDelete = (pro) => {
        setSelectedPro(pro);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedPro) return;
        setProfessionals(prev => prev.filter(p => p.id !== selectedPro.id));
        showToast(`🗑️ ${selectedPro.name} removed.`, 'error');
        setShowDeleteConfirm(false);
        setSelectedPro(null);
    };

    const statusColor = (s) => ({
        Active: 'bg-green-100 text-green-700 border border-green-200',
        Suspended: 'bg-red-100 text-red-700 border border-red-200',
        Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    }[s] || 'bg-gray-100 text-gray-600');

    return (
        <div className="space-y-6">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-bold flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                    } text-white`}>
                    {toast.message}
                    <button onClick={() => setToast(null)}><X size={16} /></button>
                </div>
            )}

            {/* Add / Edit Modal */}
            {modalMode && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                        {/* Modal header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${modalMode === 'add' ? 'bg-blue-600 shadow-blue-100' : 'bg-blue-600 shadow-blue-100'} text-white rounded-xl flex items-center justify-center shadow-lg`}>
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

                        {/* Modal body — scrollable */}
                        <div className="px-8 py-6 overflow-y-auto flex-1 space-y-4">
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
                                            // Mocking lat/long set
                                            setFormData(prev => ({ ...prev, lat: '19.0760', lng: '72.8777' }));
                                            showToast("Location pinned to Mumbai Center", "info");
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

                            {modalMode === 'add' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <Field
                                        label="Password"
                                        name="password"
                                        required
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
                                        required
                                        value={formData.confirmPassword}
                                        error={formErrors.confirmPassword}
                                        onChange={handleField}
                                        showToggle
                                        isVisible={showPasswords}
                                        onToggle={() => setShowPasswords(!showPasswords)}
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Availability" name="availability" as="select" value={formData.availability} onChange={handleField}>
                                    <option>Available</option>
                                    <option>Busy</option>
                                    <option>Offline</option>
                                </Field>
                                <Field label="Status" name="status" as="select" value={formData.status} onChange={handleField}>
                                    <option>Active</option>
                                    <option>Pending</option>
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

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Professionals</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage all service provider accounts on the platform.</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all">
                    <Plus size={16} /> Add Professional
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, category, or city..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                    {['All', 'Active', 'Suspended', 'Pending'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${statusFilter === s ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                                }`}>
                            {s}
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${statusFilter === s ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {counts[s]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Desktop Table (md+) ── */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Name', 'Business / Services', 'Location', 'Rating', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {filtered.map(pro => (
                                <tr key={pro.id} className="hover:bg-blue-50/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${pro.status === 'Suspended' ? 'bg-red-100 text-red-700' :
                                                pro.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>{pro.name.charAt(0)}</div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{pro.name}</p>
                                                <p className="text-xs text-gray-400">{pro.completedJobs} jobs • {pro.subscriptionPlan || 'Starter'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-blue-50/50 rounded-xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <div className="text-blue-600 group-hover:text-white transition-colors">
                                                {React.createElement(categoryIcons[pro.category] || Package, { size: 14, strokeWidth: 2.5 })}
                                            </div>
                                            <span className="text-xs font-bold tracking-tight uppercase">{pro.category}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pro.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                                            <Star size={14} className="text-yellow-400 fill-current" />
                                            {pro.rating || '—'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColor(pro.status)}`}>{pro.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {pro.status === 'Active' ? (
                                                <button onClick={() => handleStatusToggle(pro)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
                                                    <XCircle size={13} /> Suspend
                                                </button>
                                            ) : (
                                                <button onClick={() => handleStatusToggle(pro)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
                                                    <CheckCircle size={13} /> Approve
                                                </button>
                                            )}
                                            <button onClick={() => openEdit(pro)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors">
                                                <Edit size={13} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(pro)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Users size={48} className="mx-auto mb-3 text-gray-200" />
                        <p className="font-bold text-gray-500">No professionals found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {statusFilter !== 'All' ? `No ${statusFilter.toLowerCase()} professionals yet.` : 'Try adjusting your search.'}
                        </p>
                        {statusFilter === 'All' && !searchTerm && (
                            <button onClick={openAdd} className="mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 inline-flex items-center gap-2 shadow-md">
                                <Plus size={15} /> Add First Professional
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Mobile Cards (below md) ── */}
            <div className="md:hidden space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Users size={48} className="mx-auto mb-3 text-gray-200" />
                        <p className="font-bold text-gray-500">No professionals found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {statusFilter !== 'All' ? `No ${statusFilter.toLowerCase()} professionals yet.` : 'Try adjusting your search.'}
                        </p>
                        {statusFilter === 'All' && !searchTerm && (
                            <button onClick={openAdd} className="mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 inline-flex items-center gap-2 shadow-md">
                                <Plus size={15} /> Add First Professional
                            </button>
                        )}
                    </div>
                ) : (
                    filtered.map(pro => (
                        <div key={pro.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center gap-3">
                                <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-base shrink-0 ${pro.status === 'Suspended' ? 'bg-red-100 text-red-700' :
                                    pro.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>{pro.name.charAt(0)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{pro.name}</p>
                                    <p className="text-xs text-gray-400">{pro.completedJobs} Jobs • {pro.subscriptionPlan || 'Starter'}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${statusColor(pro.status)}`}>{pro.status}</span>
                            </div>

                            {/* Card Info Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-blue-50/30 rounded-xl px-3 py-2.5 flex items-center gap-3 border border-blue-50/50">
                                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm border border-blue-100">
                                        {React.createElement(categoryIcons[pro.category] || Package, { size: 16, strokeWidth: 2.5 })}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-blue-600/60 uppercase tracking-widest mb-0">Specialty</p>
                                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{pro.category || '—'}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-xl px-3 py-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                                    <p className="text-sm font-bold text-gray-800 truncate">{pro.hourlyRate || '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl px-3 py-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
                                    <p className="text-sm font-bold text-gray-800 truncate">{pro.location || '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl px-3 py-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Rating</p>
                                    <div className="flex items-center gap-1">
                                        <Star size={13} className="text-yellow-400 fill-current" />
                                        <p className="text-sm font-bold text-gray-800">{pro.rating || '—'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="flex gap-2 pt-1 border-t border-gray-50">
                                {pro.status === 'Active' ? (
                                    <button onClick={() => handleStatusToggle(pro)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors">
                                        <XCircle size={14} /> Suspend
                                    </button>
                                ) : (
                                    <button onClick={() => handleStatusToggle(pro)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-colors">
                                        <CheckCircle size={14} /> Approve
                                    </button>
                                )}
                                <button onClick={() => openEdit(pro)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors">
                                    <Edit size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(pro)}
                                    className="px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition-colors">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => { setShowDeleteConfirm(false); setSelectedPro(null); }}
                onConfirm={handleConfirmDelete}
                title="Delete Professional"
                message={`Are you sure you want to delete ${selectedPro?.name}? This action cannot be undone.`}
                icon={AlertCircle}
                confirmText="Delete"
                type="danger"
            />

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSave={handleQuickAddCategory}
            />
        </div>
    );
};

export default AdminProfessionals;

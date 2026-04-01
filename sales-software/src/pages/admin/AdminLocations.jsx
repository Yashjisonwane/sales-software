import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Loader2, X, AlertCircle, Sparkles } from 'lucide-react';
import AddLocationModal from '../../components/locations/AddLocationModal';
import EditLocationModal from '../../components/locations/EditLocationModal';
import LocationDetailsModal from '../../components/locations/LocationDetailsModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { fetchAllLocations, createLocation, removeLocation } from '../../services/apiService';

const AdminLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        loadLocations();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadLocations = async () => {
        setLoading(true);
        const res = await fetchAllLocations();
        if (res.success) {
            setLocations(res.data);
        } else {
            showToast(res.error || 'Failed to fetch locations', 'error');
        }
        setLoading(false);
    };

    // ── Handlers ──────────────────────────────────────────────

    const handleAddLocation = async (locData) => {
        const res = await createLocation(locData);
        if (res.success) {
            showToast(`📍 ${locData.city} added to service areas!`, 'success');
            loadLocations();
            setShowAddModal(false);
        } else {
            showToast(res.error || 'Failed to add location', 'error');
        }
    };

    const handleCardClick = (loc) => {
        setSelectedLocation(loc);
        setShowDetailsModal(true);
    };

    const handleEditClick = (e, loc) => {
        e.stopPropagation();
        setSelectedLocation(loc);
        setShowEditModal(true);
    };

    const handleSaveEdit = (updatedLocation) => {
        // UI only update for now or add API if exists
        setLocations(prev => prev.map(l => l.id === updatedLocation.id ? updatedLocation : l));
        setShowEditModal(false);
    };

    const handleDeleteClick = (e, loc) => {
        e.stopPropagation();
        setSelectedLocation(loc);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedLocation) {
            const res = await removeLocation(selectedLocation.id);
            if (res.success) {
                showToast(`🗑️ Service area removed.`, 'error');
                loadLocations();
            } else {
                showToast(res.error || 'Could not remove area', 'error');
            }
            setShowDeleteConfirm(false);
            setSelectedLocation(null);
        }
    };

    const getStatusStyle = (status) => {
        return status === 'Active'
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
            : 'bg-rose-50 text-rose-600 border-rose-100';
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${
                    toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                } text-white font-bold text-sm`}>
                    {toast.type === 'error' ? <AlertCircle size={18} /> : <Sparkles size={18} />}
                    {toast.message}
                    <button onClick={() => setToast(null)} className="ml-2 hover:rotate-90 transition-transform">
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Service Areas & Cities</h1>
                    <p className="text-base text-gray-500 mt-1 font-medium font-sans">Manage the specific cities and zones where your business operates and offers services.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm uppercase tracking-wider"
                >
                    <Plus size={18} strokeWidth={3} /> Add Location
                </button>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                    <p className="font-bold text-sm uppercase tracking-widest italic">Mapping Territories...</p>
                </div>
            ) : locations.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 gap-3">
                    <MapPin className="text-gray-300" size={48} />
                    <p className="font-bold text-gray-500 italic">No service areas active. Expand your reach!</p>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        + Define New Market Location
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map(loc => (
                        <div
                            key={loc.id}
                            onClick={() => handleCardClick(loc)}
                            className="bg-white rounded-[2rem] border border-gray-100 p-7 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-orange-50 text-orange-500 shadow-inner border border-white group-hover:bg-orange-600 group-hover:text-white transition-all transform group-hover:scale-110">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors uppercase italic">{loc.city}</h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{loc.state}, {loc.country || 'USA'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(loc.status)}`}>
                                        {loc.status || 'Active'}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleEditClick(e, loc)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteClick(e, loc)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-100"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50/50 rounded-3xl border border-gray-100 mb-2">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-900 leading-none mb-1.5">{loc.professionals || 0}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered Pros</p>
                                </div>
                                <div className="text-center border-l border-gray-100">
                                    <p className="text-lg font-bold text-gray-900 leading-none mb-1.5">{loc.activeLeads || 0}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Leads</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Modals ──────────────────────────────────────────── */}

            <AddLocationModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddLocation}
            />

            <LocationDetailsModal
                isOpen={showDetailsModal}
                onClose={() => { setShowDetailsModal(false); setSelectedLocation(null); }}
                location={selectedLocation}
            />

            <EditLocationModal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setSelectedLocation(null); }}
                location={selectedLocation}
                onSave={handleSaveEdit}
            />

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => { setShowDeleteConfirm(false); setSelectedLocation(null); }}
                onConfirm={handleConfirmDelete}
                title="Delete Location"
                message={`Are you sure you want to delete ${selectedLocation ? selectedLocation.city : 'this location'}? This action cannot be undone.`}
                icon={AlertCircle}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default AdminLocations;

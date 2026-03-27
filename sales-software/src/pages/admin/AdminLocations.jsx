import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import AddLocationModal from '../../components/locations/AddLocationModal';
import EditLocationModal from '../../components/locations/EditLocationModal';
import LocationDetailsModal from '../../components/locations/LocationDetailsModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const MOCK_LOCATIONS = [
    { id: 1, city: 'Los Angeles', state: 'CA', country: 'USA', professionals: 42, leads: 89, status: 'Active' },
    { id: 2, city: 'New York', state: 'NY', country: 'USA', professionals: 67, leads: 134, status: 'Active' },
    { id: 3, city: 'Chicago', state: 'IL', country: 'USA', professionals: 31, leads: 61, status: 'Active' },
    { id: 4, city: 'Houston', state: 'TX', country: 'USA', professionals: 28, leads: 55, status: 'Active' },
    { id: 5, city: 'Phoenix', state: 'AZ', country: 'USA', professionals: 22, leads: 43, status: 'Inactive' },
    { id: 6, city: 'Philadelphia', state: 'PA', country: 'USA', professionals: 19, leads: 38, status: 'Active' },
];

const AdminLocations = () => {
    const [locations, setLocations] = useState(MOCK_LOCATIONS);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // ── Handlers ──────────────────────────────────────────────

    const handleAddLocation = (newLocation) => {
        setLocations(prev => [...prev, newLocation]);
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
        setLocations(prev => prev.map(l => l.id === updatedLocation.id ? updatedLocation : l));
    };

    const handleDeleteClick = (e, loc) => {
        e.stopPropagation();
        setSelectedLocation(loc);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (selectedLocation) {
            setLocations(prev => prev.filter(l => l.id !== selectedLocation.id));
        }
    };

    const getStatusStyle = (status) => {
        return status === 'Active'
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
            : 'bg-rose-50 text-rose-600 border-rose-100';
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Marketplace Locations</h1>
                    <p className="text-base text-gray-500 mt-1 font-medium">Manage active service areas and professional density.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm uppercase tracking-wider"
                >
                    <Plus size={18} strokeWidth={3} /> Add Location
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map(loc => (
                    <div
                        key={loc.id}
                        onClick={() => handleCardClick(loc)}
                        className="bg-white rounded-[2rem] border border-gray-100 p-7 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-orange-50 text-orange-500 shadow-inner border border-white">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg tracking-tight">{loc.city}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{loc.state}, {loc.country || 'USA'}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(loc.status)}`}>
                                    {loc.status || 'Active'}
                                </span>
                                <div className="flex items-center gap-1">
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
                                <p className="text-lg font-bold text-gray-900 leading-none mb-1.5">{loc.professionals}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Professionals</p>
                            </div>
                            <div className="text-center border-l border-gray-100">
                                <p className="text-lg font-bold text-gray-900 leading-none mb-1.5">{loc.leads}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Leads</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {locations.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <MapPin size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No locations added yet.</p>
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

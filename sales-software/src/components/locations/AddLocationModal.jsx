import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const initialForm = {
    city: '',
    state: '',
    country: 'USA',
    professionals: '',
    leads: '',
    status: 'Active',
};

const AddLocationModal = ({ isOpen, onClose, onAdd }) => {
    const [form, setForm] = useState(initialForm);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newLocation = {
            id: Date.now(),
            city: form.city,
            state: form.state,
            country: form.country || 'USA',
            professionals: parseInt(form.professionals) || 0,
            leads: parseInt(form.leads) || 0,
            status: form.status,
        };
        onAdd(newLocation);
        setForm(initialForm);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between px-8 pt-8 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Plus size={22} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Add Location</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">City Name *</label>
                        <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="e.g. Los Angeles"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">State</label>
                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="e.g. CA"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
                            <input
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="e.g. USA"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Professionals</label>
                            <input
                                name="professionals"
                                type="number"
                                min="0"
                                value={form.professionals}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Active Leads</label>
                            <input
                                name="leads"
                                type="number"
                                min="0"
                                value={form.leads}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-200">
                            <Plus size={16} />
                            <span>Add Location</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLocationModal;

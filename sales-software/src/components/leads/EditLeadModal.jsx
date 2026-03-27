import React, { useState, useEffect } from 'react';
import { X, Save, Edit } from 'lucide-react';

const serviceOptions = [
    'Plumbing', 'Electrical', 'Cleaning', 'HVAC',
    'Roofing', 'Painting', 'Handyman', 'Landscaping',
];

const statusOptions = ['Open', 'Assigned', 'Completed'];

const EditLeadModal = ({ isOpen, onClose, lead, onSave }) => {
    const [form, setForm] = useState({
        customerName: '',
        serviceCategory: '',
        location: '',
        status: '',
    });

    useEffect(() => {
        if (lead) {
            setForm({
                customerName: lead.customerName || '',
                serviceCategory: lead.serviceCategory || '',
                location: lead.location || '',
                status: lead.status || 'Open',
            });
        }
    }, [lead]);

    if (!isOpen || !lead) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...lead, ...form });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-yellow-200">
                            <Edit size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Edit Lead</h2>
                            <p className="text-xs text-gray-400 font-medium">#{lead.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Customer Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Customer Name</label>
                        <input
                            name="customerName"
                            value={form.customerName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Service Category */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Service Category</label>
                        <select
                            name="serviceCategory"
                            value={form.serviceCategory}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="">Select a service...</option>
                            {serviceOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Location / Address</label>
                        <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            {statusOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-yellow-200"
                        >
                            <Save size={16} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLeadModal;

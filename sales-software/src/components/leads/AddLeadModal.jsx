import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const initialForm = {
    customerName: '',
    serviceCategory: '',
    location: '',
    customerPhone: '',
    customerEmail: '',
    description: '',
    preferredDate: '',
};

const serviceOptions = [
    'Plumbing', 'Electrical', 'Cleaning', 'HVAC',
    'Roofing', 'Painting', 'Handyman', 'Landscaping',
];

const AddLeadModal = ({ isOpen, onClose, onAdd, existingLeads }) => {
    const [form, setForm] = useState(initialForm);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nextId = `L${String(existingLeads.length + 1).padStart(3, '0')}`;
        const newLead = {
            id: nextId,
            customerName: form.customerName,
            customerEmail: form.customerEmail,
            customerPhone: form.customerPhone,
            serviceCategory: form.serviceCategory,
            description: form.description,
            location: form.location,
            zipCode: '',
            latitude: 0,
            longitude: 0,
            status: 'Open',
            urgency: 'Medium',
            budget: '',
            preferredDate: form.preferredDate,
            assignedTo: null,
            assignedProfessionals: [],
            dateRequested: new Date().toISOString(),
            photos: [],
        };
        onAdd(newLead);
        setForm(initialForm);
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
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Plus size={22} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Add New Lead</h2>
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
                            placeholder="e.g. John Doe"
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
                            placeholder="e.g. 123 Main St, Springfield"
                        />
                    </div>

                    {/* Phone & Email row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                            <input
                                name="customerPhone"
                                value={form.customerPhone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="555-1234"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                            <input
                                name="customerEmail"
                                type="email"
                                value={form.customerEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="john@email.com"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            placeholder="Describe the service request..."
                        />
                    </div>

                    {/* Preferred Date */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Preferred Date</label>
                        <input
                            name="preferredDate"
                            type="date"
                            value={form.preferredDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
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
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-200"
                        >
                            <Plus size={16} />
                            <span>Add Lead</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLeadModal;

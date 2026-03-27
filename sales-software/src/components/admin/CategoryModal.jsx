import React, { useState, useEffect } from 'react';
import { X, Save, Package, Wrench, Zap, Sparkles, Wind, Home, TreePine, Paintbrush } from 'lucide-react';

const icons = [
    { id: 'Wrench', icon: Wrench },
    { id: 'Zap', icon: Zap },
    { id: 'Sparkles', icon: Sparkles },
    { id: 'Wind', icon: Wind },
    { id: 'Home', icon: Home },
    { id: 'Package', icon: Package },
    { id: 'TreePine', icon: TreePine },
    { id: 'Paintbrush', icon: Paintbrush },
];

const Field = ({ label, name, type = 'text', as, children, required, value, error, onChange }) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {as === 'select' ? (
            <select
                name={name}
                value={value ?? ''}
                onChange={onChange}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all ${error ? 'border-red-400' : 'border-gray-200'}`}
            >
                {children}
            </select>
        ) : as === 'textarea' ? (
            <textarea
                name={name}
                value={value ?? ''}
                onChange={onChange}
                rows="3"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${error ? 'border-red-400' : 'border-gray-200'}`}
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${error ? 'border-red-400' : 'border-gray-200'}`}
            />
        )}
        {error && <p className="text-[10px] text-red-500 mt-1 font-bold">{error}</p>}
    </div>
);

const CategoryModal = ({ isOpen, onClose, onSave, category }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: 'Package',
        status: 'Active'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
                icon: category.icon || 'Package',
                status: category.status || 'Active'
            });
        } else {
            setFormData({
                name: '',
                description: '',
                icon: 'Package',
                status: 'Active'
            });
        }
        setErrors({});
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleAddCategory = (e) => {
        if (e) e.preventDefault();
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave({
            ...category,
            ...formData
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Package size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {category ? 'Edit Category' : 'Add New Category'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <form
                    id="category-form"
                    onSubmit={handleAddCategory}
                    className="flex-1 overflow-y-auto px-8 py-6 space-y-5 custom-scrollbar"
                >
                    <Field
                        label="Category Name"
                        name="name"
                        required
                        value={formData.name}
                        error={errors.name}
                        onChange={handleChange}
                        placeholder="e.g. Plumbing Services"
                    />

                    <Field
                        label="Description"
                        name="description"
                        as="textarea"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Briefly describe what this category covers..."
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            label="Icon"
                            name="icon"
                            as="select"
                            value={formData.icon}
                            onChange={handleChange}
                        >
                            {icons.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.id.replace(/([A-Z])/g, ' $1').trim()}
                                </option>
                            ))}
                        </Field>

                        <Field
                            label="Status"
                            name="status"
                            as="select"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Field>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Icon Preview</p>
                        <div className="flex flex-wrap gap-2">
                            {icons.map(item => {
                                const Icon = item.icon;
                                const isSelected = formData.icon === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, icon: item.id }))}
                                        className={`p-3 rounded-xl transition-all border ${isSelected
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 scale-110'
                                            : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-500'
                                            }`}
                                    >
                                        <Icon size={20} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 flex gap-3 bg-white shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="category-form"
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors active:scale-95 shadow-blue-100"
                    >
                        <Save size={16} />
                        <span>{category ? 'Save Changes' : 'Add Category'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;

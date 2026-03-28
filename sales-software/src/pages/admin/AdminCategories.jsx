import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Wrench, Zap, Sparkles, Wind, Home, Package, TreePine, Paintbrush, Loader2, X, AlertCircle } from 'lucide-react';
import CategoryModal from '../../components/admin/CategoryModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { fetchAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/apiService';

const iconMap = { Wrench, Zap, Sparkles, Wind, Home, Package, TreePine, Paintbrush };

const AdminCategories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadCategories = async () => {
        setLoading(true);
        const res = await fetchAllCategories();
        if (res.success) {
            setCategories(res.data);
        } else {
            showToast(res.error || 'Failed to fetch categories', 'error');
        }
        setLoading(false);
    };

    const handleOpenAdd = () => {
        setActiveCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (cat) => {
        setActiveCategory(cat);
        setIsModalOpen(true);
    };

    const handleSave = async (categoryData) => {
        let res;
        if (categoryData.id) {
            res = await updateCategory(categoryData.id, categoryData);
        } else {
            res = await createCategory(categoryData);
        }

        if (res.success) {
            showToast(categoryData.id ? 'Category updated!' : 'Category created!', 'success');
            loadCategories();
            setIsModalOpen(false);
        } else {
            showToast(res.error || 'Operation failed', 'error');
        }
    };

    const handleDelete = (id) => {
        setCategoryToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            const res = await deleteCategory(categoryToDelete);
            if (res.success) {
                showToast('Category deleted successfully', 'success');
                loadCategories();
            } else {
                showToast(res.error || 'Could not delete category', 'error');
            }
        }
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    return (
        <div className="space-y-6">
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

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">Service Categories</h1>
                    <p className="text-sm text-gray-500 mt-1 font-sans">Manage the service catalog available on the marketplace.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all font-sans"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="font-bold text-sm uppercase tracking-widest">Loading Catalog...</p>
                </div>
            ) : categories.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 gap-3">
                    <Package className="text-gray-300" size={48} />
                    <p className="font-bold text-gray-500">No categories found. Create your first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categories.map(cat => {
                        const IconComp = iconMap[cat.icon] || Package;

                        return (
                            <div key={cat.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 transition-all hover:shadow-xl hover:shadow-blue-50/50 hover:border-blue-100 group relative">
                                {/* Status Badge */}
                                <div className="absolute top-6 right-6 flex gap-1.5 items-center bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100/50">
                                    <span className={`flex h-1.5 w-1.5 rounded-full ${cat.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${cat.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                        {cat.status}
                                    </span>
                                </div>

                                <div className="flex items-start justify-between mb-5">
                                    <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 shadow-sm border border-blue-100/20">
                                        <IconComp size={24} />
                                    </div>
                                </div>

                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors font-sans">{cat.name}</h3>
                                <p className="text-sm text-gray-400 mt-1 mb-6 leading-relaxed line-clamp-2 min-h-[40px] font-medium font-sans italic">
                                    {cat.description || 'Professional services for your needs.'}
                                </p>

                                <div className="flex items-center justify-between text-xs font-bold pt-5 border-t border-gray-50 font-sans">
                                    <span className="text-gray-400">{cat.professionals || 0} providers</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(cat)}
                                            className="p-1.5 text-blue-400 hover:text-blue-600 transition-colors bg-blue-50/50 rounded-lg hover:bg-blue-100"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-1.5 text-red-300 hover:text-red-500 transition-colors bg-red-50/50 rounded-lg hover:bg-red-100"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/admin/professionals?search=${cat.name}`)}
                                    className="w-full mt-4 flex items-center justify-center gap-1.5 text-[13px] font-bold text-blue-600 py-3 rounded-2xl border border-blue-50 bg-blue-50/30 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm hover:shadow-blue-200 active:scale-95 font-sans"
                                >
                                    View Professionals →
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Category Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                category={activeCategory}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default AdminCategories;

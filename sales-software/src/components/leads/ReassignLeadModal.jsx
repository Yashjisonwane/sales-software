import React, { useState, useMemo } from 'react';
import { X, Search, User, MapPin, CheckCircle2, Star } from 'lucide-react';

const ReassignLeadModal = ({ isOpen, onClose, professionals, onAssign, lead }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPro, setSelectedPro] = useState(null);

    const filteredPros = useMemo(() => {
        if (!professionals) return [];
        return professionals.filter(pro => {
            const searchLower = searchTerm.toLowerCase();
            return pro.name.toLowerCase().includes(searchLower) ||
                   pro.category.toLowerCase().includes(searchLower) ||
                   pro.location.toLowerCase().includes(searchLower);
        });
    }, [professionals, searchTerm]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (selectedPro && lead) {
            onAssign(lead.id, selectedPro.id);
            onClose();
            setSelectedPro(null);
            setSearchTerm('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Reassign Lead</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Select a professional for Lead #{lead?.id}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600 shadow-sm border border-transparent hover:border-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-6 pb-0">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, category, or location..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Professional List */}
                <div className="p-6 max-h-[400px] overflow-y-auto">
                    <div className="space-y-3">
                        {filteredPros.map((pro) => (
                            <div 
                                key={pro.id}
                                onClick={() => setSelectedPro(pro)}
                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                                    selectedPro?.id === pro.id 
                                    ? 'border-blue-500 bg-blue-50/50 shadow-md' 
                                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                            >
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                                    selectedPro?.id === pro.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {pro.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 truncate">{pro.name}</h4>
                                        <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-700 px-1.5 py-0.5 rounded-lg">
                                            <Star size={12} className="fill-yellow-500 text-yellow-500" />
                                            <span className="text-[10px] font-black">{pro.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <User size={12} className="text-blue-500" />
                                            <span className="font-medium">{pro.category}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <MapPin size={12} className="text-red-500" />
                                            <span className="font-medium truncate">{pro.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 flex flex-col items-end gap-2">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                        pro.availability === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {pro.availability}
                                    </span>
                                    {selectedPro?.id === pro.id && (
                                        <CheckCircle2 size={20} className="text-blue-600 animate-in zoom-in duration-200" />
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredPros.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-400 font-medium">No professionals found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-white transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!selectedPro}
                        onClick={handleConfirm}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md ${
                            selectedPro 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Confirm Reassignment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReassignLeadModal;

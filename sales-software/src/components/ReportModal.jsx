import { X, FileText, Save, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const ReportModal = ({ isOpen, onClose }) => {
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-lg shadow-md">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Generate New Report</h2>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Custom analytical data extraction</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Report Title</label>
                            <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="Monthly Sales Analysis..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Category</label>
                                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm">
                                    <option>Sales Performance</option>
                                    <option>Customer Retention</option>
                                    <option>Revenue Forecast</option>
                                    <option>System Audit</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Frequency</label>
                                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm">
                                    <option>One-time</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Data Range</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs" />
                                <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            <span>Generate Report</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;

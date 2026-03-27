import { X, Bell, Save, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

const ReminderModal = ({ isOpen, onClose }) => {
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
                        <div className="p-3 bg-amber-600 text-white rounded-lg shadow-md">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Set New Reminder</h2>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Automated task follow-up</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Reminder Task</label>
                            <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="Follow up with Acme Corp..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Priority</label>
                                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm">
                                    <option>No Priority</option>
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High Critical</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Category</label>
                                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm">
                                    <option>Payment Follow-up</option>
                                    <option>Customer Meeting</option>
                                    <option>General Task</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Due Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input required type="date" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Due Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input required type="time" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all">
                            Discard
                        </button>
                        <button type="submit" disabled={isSaving} className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg font-bold text-sm hover:bg-amber-700 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            <span>Set Reminder</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReminderModal;

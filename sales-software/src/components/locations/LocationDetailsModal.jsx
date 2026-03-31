import React from 'react';
import { X, MapPin, Users, Briefcase, Globe } from 'lucide-react';

const DetailRow = ({ icon: Icon, label, value, iconColor = 'text-gray-400' }) => (
    <div className="flex items-center gap-3">
        <div className={`${iconColor}`}>
            <Icon size={16} />
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{value || '—'}</p>
        </div>
    </div>
);

const LocationDetailsModal = ({ isOpen, onClose, location }) => {
    if (!isOpen || !location) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-2 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                            <MapPin size={22} />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">Location Details</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 space-y-5 overflow-y-auto custom-scrollbar">
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border border-gray-100">
                        <DetailRow icon={MapPin} label="City" value={location.city} iconColor="text-orange-500" />
                        <DetailRow icon={Globe} label="State" value={location.state} iconColor="text-blue-500" />
                        <DetailRow icon={Globe} label="Country" value={location.country || 'USA'} iconColor="text-emerald-500" />
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border border-gray-100">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statistical Density</h3>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="text-center bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <p className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">{location.professionals || 0}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Professionals</p>
                            </div>
                            <div className="text-center bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <p className="text-xl sm:text-2xl font-black text-gray-900 leading-none mb-1">{location.activeLeads || 0}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Active Leads</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-sm uppercase tracking-widest active:scale-[0.98] shadow-lg shadow-gray-200"
                    >
                        Close Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationDetailsModal;

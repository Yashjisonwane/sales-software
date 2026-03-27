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
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between px-8 pt-8 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                            <MapPin size={22} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Location Details</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-8 pb-8 pt-4 space-y-5">
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                        <DetailRow icon={MapPin} label="City" value={location.city} iconColor="text-orange-500" />
                        <DetailRow icon={Globe} label="State" value={location.state} iconColor="text-blue-500" />
                        <DetailRow icon={Globe} label="Country" value={location.country || 'USA'} iconColor="text-emerald-500" />
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center bg-white rounded-xl p-4 border border-gray-100">
                                <p className="text-2xl font-black text-gray-900">{location.professionals}</p>
                                <p className="text-xs text-gray-400 font-medium mt-1">Professionals</p>
                            </div>
                            <div className="text-center bg-white rounded-xl p-4 border border-gray-100">
                                <p className="text-2xl font-black text-gray-900">{location.leads}</p>
                                <p className="text-xs text-gray-400 font-medium mt-1">Active Leads</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationDetailsModal;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useMarketplace } from '../../context/MarketplaceContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Trash2, Save, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { getSocketOrigin } from '../../services/apiClient';

const Settings = () => {
    const { currentUser, toggleTrackingSetting, updateProfessionalStatus, updateProfessionalLocation, updateProfile, showToast } = useMarketplace();
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [watchError, setWatchError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        newPassword: '',
    });

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
            }));
        }
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'WORKER') return undefined;
        if (!currentUser.trackingEnabled) return undefined;
        if (!navigator.geolocation) {
            setWatchError('Geolocation is not supported on this browser.');
            return undefined;
        }

        let socket;
        const token = localStorage.getItem('userToken');
        if (token) {
            socket = io(getSocketOrigin(), {
                auth: { token },
                transports: ['websocket', 'polling']
            });
        }

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                setWatchError('');
                const payload = {
                    professionalId: currentUser.id,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (socket) socket.emit('location_update', payload);
                // Keep API persistence as backup
                await updateProfessionalLocation(payload.lat, payload.lng);
            },
            (error) => {
                setWatchError(error.message || 'Unable to access GPS location');
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 15000
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
            if (socket) socket.disconnect();
        };
    }, [currentUser?.id, currentUser?.role, currentUser?.trackingEnabled]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const success = await updateProfile({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.newPassword || undefined
        });
        if (success) {
            showToast('Settings updated successfully!', 'success');
            setFormData(prev => ({ ...prev, newPassword: '' }));
        }
    };

    return (
        <div className="max-w-4xl space-y-8 pb-12 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Professional Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account preferences and live tracking status.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 space-y-10">
                    
                    {/* Live Status Section */}
                    <section className="bg-blue-50/50 -mx-8 -mt-8 px-8 py-8 border-b border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Visibility & Tracking</h2>
                            <p className="text-xs text-blue-600/70 font-medium">Control if you are visible to management and new leads.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-blue-100 shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">GPS TRACKING</span>
                                <button
                                    onClick={() => toggleTrackingSetting(currentUser.id, !currentUser.trackingEnabled)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${currentUser?.trackingEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentUser?.trackingEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            
                            <div className="flex bg-white p-1 rounded-2xl border border-blue-100 shadow-sm">
                                <button 
                                    onClick={() => updateProfessionalStatus(true)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentUser?.isAvailable ? 'bg-green-500 text-white shadow-md' : 'text-gray-400'}`}
                                >
                                    Online
                                </button>
                                <button 
                                    onClick={() => updateProfessionalStatus(false)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!currentUser?.isAvailable ? 'bg-slate-900 text-white shadow-md' : 'text-gray-400'}`}
                                >
                                    Offline
                                </button>
                            </div>
                        </div>
                        {watchError && (
                            <p className="text-[11px] font-bold text-rose-500">{watchError}</p>
                        )}
                    </section>

                    <form onSubmit={handleSave} className="space-y-10">
                        {/* Account Info */}
                        <section>
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Account Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Update Password (Optional)</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                            placeholder="Enter new password"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2 active:scale-95"
                            >
                                <Save size={16} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50 rounded-2xl border border-rose-100 p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-black text-rose-900 uppercase tracking-tight">Deactivate Account</h3>
                    <p className="text-xs text-rose-500 font-medium">Permanently disable your access to the platform.</p>
                </div>
                <button
                    onClick={() => setIsDeactivateModalOpen(true)}
                    className="px-6 py-3 bg-white text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                >
                    Deactivate
                </button>
            </div>

            <ConfirmationModal
                isOpen={isDeactivateModalOpen}
                onClose={() => setIsDeactivateModalOpen(false)}
                onConfirm={() => setIsDeactivateModalOpen(false)}
                title="Deactivate Account"
                message="Are you sure you want to deactivate your account? This will hide your profile from all customers."
                icon={Trash2}
                confirmText="Yes, Deactivate"
                type="danger"
            />
        </div>
    );
};

export default Settings;

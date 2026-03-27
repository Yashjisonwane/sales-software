import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Trash2 } from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();
    const { currentUser, toggleTrackingSetting, updateProfessionalStatus, showToast } = useMarketplace();
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        // Account Settings
        adminName: 'John Doe',
        emailAddress: 'john.doe@example.com',
        username: 'johndoe_admin',
        phoneNumber: '+1 (555) 123-4567',
        
        // Security Settings
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorAuth: false,

        // Platform Settings
        platformName: 'LeadMarket Inc.',
        supportEmail: 'support@leadmarket.com',
        defaultCurrency: 'USD ($)',
        timezone: 'UTC-05:00 Eastern Time (US & Canada)',

        // Notification Settings
        newLeadEmail: true,
        proRegistrationAlert: true,
        weeklyReport: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleToggle = (name) => {
        setFormData(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const handleSave = () => {
        showToast('Settings saved successfully.', 'success');
    };

    const handleDeactivate = () => {
        deactivateAccount();
        setIsDeactivateModalOpen(false);
        localStorage.removeItem('userRole');
        localStorage.removeItem('isLoggedIn');
        navigate('/professional/login');
    };

    return (
        <div className="max-w-5xl space-y-8 pb-12 animate-in fade-in duration-300">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Professional Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account preferences and live tracking configuration.</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 space-y-10">
                    
                    {/* --- Live Tracking --- */}
                    <section className="bg-blue-50/50 -mx-8 -mt-8 px-8 py-8 border-b border-blue-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Live Tracking & Status</h2>
                        <p className="text-sm text-blue-600/70 mb-8 font-medium italic">Configure how your location is shared with the management cluster.</p>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-blue-100 shadow-sm">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Enable Live Tracking</p>
                                    <p className="text-xs text-gray-400 font-medium tracking-tight">Broadcast your GPS coordinates every 15 seconds to the admin fleet.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggleTrackingSetting(currentUser.id, !currentUser.trackingEnabled)}
                                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${currentUser.trackingEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentUser.trackingEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-blue-100 shadow-sm">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Active Online Status</p>
                                    <p className="text-xs text-gray-400 font-medium tracking-tight">Set your current availability for new lead matches.</p>
                                </div>
                                <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-2">
                                    <button 
                                        onClick={() => updateProfessionalStatus(currentUser.id, 'Online')}
                                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentUser.onlineStatus === 'Online' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Online
                                    </button>
                                    <button 
                                        onClick={() => updateProfessionalStatus(currentUser.id, 'Offline')}
                                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentUser.onlineStatus !== 'Online' ? 'bg-slate-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Offline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* --- Account Settings --- */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Account Settings</h2>
                        <p className="text-sm text-gray-500 mb-6">Update your personal administrator profile details.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Name</label>
                                <input
                                    type="text"
                                    name="adminName"
                                    value={formData.adminName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    name="emailAddress"
                                    value={formData.emailAddress}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-200" />

                    {/* --- Security Settings --- */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Security Settings</h2>
                        <p className="text-sm text-gray-500 mb-6">Manage your password and authentication methods.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="hidden md:block"></div> {/* Spacer for grid alignment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between py-3 border-t border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication (2FA)</p>
                                <p className="text-sm text-gray-500">Require an additional code when logging in.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleToggle('twoFactorAuth')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </section>

                    <hr className="border-gray-200" />

                    {/* --- Platform Settings --- */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Platform Settings</h2>
                        <p className="text-sm text-gray-500 mb-6">Global configuration for the CRM application.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform Name</label>
                                <input
                                    type="text"
                                    name="platformName"
                                    value={formData.platformName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
                                <input
                                    type="email"
                                    name="supportEmail"
                                    value={formData.supportEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Currency</label>
                                <select
                                    name="defaultCurrency"
                                    value={formData.defaultCurrency}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="USD ($)">USD ($)</option>
                                    <option value="EUR (€)">EUR (€)</option>
                                    <option value="GBP (£)">GBP (£)</option>
                                    <option value="CAD ($)">CAD ($)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                                <select
                                    name="timezone"
                                    value={formData.timezone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="UTC-08:00 Pacific Time (US & Canada)">UTC-08:00 Pacific Time</option>
                                    <option value="UTC-05:00 Eastern Time (US & Canada)">UTC-05:00 Eastern Time</option>
                                    <option value="UTC+00:00 London">UTC+00:00 London</option>
                                    <option value="UTC+01:00 Central European Time">UTC+01:00 Central Europe</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-200" />

                    {/* --- Notification Settings --- */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Notification Settings</h2>
                        <p className="text-sm text-gray-500 mb-6">Configure which alerts and emails you receive.</p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">New Lead Email Notification</p>
                                    <p className="text-sm text-gray-500">Receive an email when a new lead enters the system.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('newLeadEmail')}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.newLeadEmail ? 'bg-blue-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.newLeadEmail ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Professional Registration Alert</p>
                                    <p className="text-sm text-gray-500">Alert me when a newly registered professional requires approval.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('proRegistrationAlert')}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.proRegistrationAlert ? 'bg-blue-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.proRegistrationAlert ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Weekly Report Emails</p>
                                    <p className="text-sm text-gray-500">Send a weekly summary of marketplace performance.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('weeklyReport')}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.weeklyReport ? 'bg-blue-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.weeklyReport ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
                
                {/* Form Footer */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 bg-red-50 rounded-lg border border-red-200 p-6 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-red-800">Deactivate Account</h3>
                    <p className="text-sm text-red-600 mt-1">Permanently remove this administrator account and all associated access rights.</p>
                </div>
                <button
                    onClick={() => setIsDeactivateModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
                >
                    Deactivate Account
                </button>
            </div>

            <ConfirmationModal
                isOpen={isDeactivateModalOpen}
                onClose={() => setIsDeactivateModalOpen(false)}
                onConfirm={handleDeactivate}
                title="Deactivate Account"
                message="Are you sure you want to deactivate your administrator account? You will lose access to the platform."
                icon={Trash2}
                confirmText="Yes, Deactivate"
                type="danger"
            />
        </div>
    );
};

export default Settings;

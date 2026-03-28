import React, { useState } from 'react';
import { 
    User, Lock, Save, Eye, EyeOff, CheckCircle2, 
    Globe, Layers, Navigation, Activity, MapPin, 
    Zap, Settings as SettingsIcon, ShieldAlert 
} from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useMarketplace } from '../../context/MarketplaceContext';

const Settings = () => {
    const { currentUser, updateProfile, showToast } = useMarketplace();
    const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [testConnection, setTestConnection] = useState(false);
    const [activeTab, setActiveTab] = useState('integrations'); 

    const [formData, setFormData] = useState({
        username: currentUser?.name || '',
        email: currentUser?.email || '',
        password: '',
        mapProvider: 'google', 
        apiKey: '••••••••••••••••',
        enableLiveTracking: true,
        enableDashboardMap: true,
        enableLocationPicker: false,
        defaultLocation: 'India',
        defaultZoom: '10'
    });

    // Auto-sync form data with live user profile once it loads from context
    React.useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                username: currentUser.name || '',
                email: currentUser.email || ''
            }));
        }
    }, [currentUser]);

    const handleUpdate = async () => {
        const res = await updateProfile({ 
            name: formData.username, 
            email: formData.email,
            password: formData.password
        });
        if (res.success) {
            setShowSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    const handleDiscard = () => {
        setFormData({
            username: currentUser?.name || 'admin',
            email: currentUser?.email || 'admin@leadmarket.platform',
            password: '',
            mapProvider: 'google',
            apiKey: '••••••••••••••••',
            enableLiveTracking: true,
            enableDashboardMap: true,
            enableLocationPicker: false,
            defaultLocation: 'India',
            defaultZoom: '10'
        });
        setIsDiscardModalOpen(false);
        setTestConnection(false);
    };

    const Toggle = ({ enabled, onChange, label, description }) => (
        <div className="flex items-center justify-between py-2.5 group transition-colors hover:bg-gray-50/50 -mx-3 px-3 rounded-xl border border-transparent hover:border-gray-100">
            <div className="space-y-0">
                <p className="text-[12px] font-black text-gray-900 leading-tight">{label}</p>
                {description && <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{description}</p>}
            </div>
            <button
                type="button"
                onClick={onChange}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
        </div>
    );

    return (
        <div className="ml-0 mt-0 min-h-screen animate-in fade-in duration-700 pb-20 px-4 md:px-8">
            {/* Page Header */}
            <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">System Settings</h1>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic opacity-70">Administrative Hub</p>
                </div>
                {showSuccess && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-green-50 text-green-700 rounded-xl shadow-lg shadow-green-50/20 transition-all animate-in zoom-in-95 duration-500">
                        <CheckCircle2 size={13} className="text-green-500" strokeWidth={2.5} />
                        <p className="text-[8px] font-black uppercase tracking-[0.2em]">Environment Updated</p>
                    </div>
                )}
            </div>

            {/* Premium Tab Navigation */}
            <div className="flex gap-2.5 mb-6 overflow-x-auto pb-1 scrollbar-none">
                <button 
                    onClick={() => setActiveTab('integrations')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap active:scale-95 ${activeTab === 'integrations' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-white text-gray-400 border border-gray-50 hover:border-blue-200 hover:text-blue-600 shadow-sm'}`}
                >
                    Integrations
                </button>
                <button 
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap active:scale-95 ${activeTab === 'security' ? 'bg-slate-900 text-white shadow-md shadow-slate-100' : 'bg-white text-gray-400 border border-gray-50 hover:border-slate-400 hover:text-slate-900 shadow-sm'}`}
                >
                    Security
                </button>
            </div>

            <div className="space-y-6">
                {activeTab === 'integrations' ? (
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg shadow-blue-50/5 overflow-hidden animate-in fade-in slide-in-from-right-3 duration-500">
                        <div className="p-6 lg:p-8">
                            <div className="flex items-center gap-3.5 mb-8">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Map Configuration</h2>
                                    <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mt-0.5 opacity-50 italic">Spatial Infrastructure</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Provider Selection</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {[
                                            { id: 'google', name: 'Google Maps', logo: 'G' }
                                        ].map(provider => (
                                            <button
                                                key={provider.id}
                                                onClick={() => setFormData({ ...formData, mapProvider: provider.id })}
                                                className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all group active:scale-95 ${
                                                    formData.mapProvider === provider.id 
                                                    ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100/50' 
                                                    : 'border-gray-50 bg-gray-50/50 hover:border-blue-100 hover:bg-white'
                                                }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-all ${
                                                    formData.mapProvider === provider.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-400'
                                                }`}>
                                                    {provider.logo}
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-tight ${formData.mapProvider === provider.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {provider.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Authentication Credentials</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-lg border border-gray-50 flex items-center justify-center text-gray-400 group-focus-within:text-blue-600 transition-all">
                                            <Lock size={14} />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.apiKey}
                                            onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-transparent rounded-[1.5rem] font-bold text-gray-900 tracking-tight focus:bg-white focus:border-blue-500/10 outline-none transition-all placeholder:text-gray-300 shadow-inner"
                                            placeholder="Environmental Key Identifier"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/20 rounded-xl">
                                        <Zap size={11} className="text-yellow-500 fill-yellow-500" />
                                        <p className="text-[9px] text-blue-600 font-bold uppercase tracking-tight">Requires high-precision geocoding API credentials.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-2 border-t border-gray-50 mt-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Capabilities Engine</label>
                                        <div className="grid grid-cols-1">
                                            <Toggle 
                                                label="Live Tracking" 
                                                description="REAL-TIME COORDINATES"
                                                enabled={formData.enableLiveTracking}
                                                onChange={() => setFormData({...formData, enableLiveTracking: !formData.enableLiveTracking})} 
                                            />
                                            <Toggle 
                                                label="Spatial Data" 
                                                description="GEO-FENCING OVERLAYS"
                                                enabled={formData.enableDashboardMap}
                                                onChange={() => setFormData({...formData, enableDashboardMap: !formData.enableDashboardMap})} 
                                            />
                                            <Toggle 
                                                label="Coordinate Picker" 
                                                description="MANUAL INJECTION"
                                                enabled={formData.enableLocationPicker}
                                                onChange={() => setFormData({...formData, enableLocationPicker: !formData.enableLocationPicker})} 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Universal View Engine</label>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1 italic">Default Anchor</p>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-white text-blue-600 rounded-lg border border-gray-50 flex items-center justify-center shadow-sm">
                                                        <MapPin size={12} strokeWidth={2.5} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={formData.defaultLocation}
                                                        onChange={e => setFormData({ ...formData, defaultLocation: e.target.value })}
                                                        className="w-full pl-13 pr-4 py-3 bg-gray-50 border border-gray-50 rounded-xl font-bold text-gray-900 text-[12px] focus:bg-white focus:border-blue-200 outline-none transition-all shadow-sm"
                                                        placeholder="e.g. India"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1 italic">Magnification Scale</p>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-white text-blue-600 rounded-lg border border-gray-50 flex items-center justify-center shadow-sm">
                                                        <Layers size={12} strokeWidth={2.5} />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={formData.defaultZoom}
                                                        onChange={e => setFormData({ ...formData, defaultZoom: e.target.value })}
                                                        className="w-full pl-13 pr-4 py-3 bg-gray-50 border border-gray-50 rounded-xl font-bold text-gray-900 text-[12px] focus:bg-white focus:border-blue-200 outline-none transition-all shadow-sm"
                                                        placeholder="e.g. 10"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-2">
                                    <button
                                        onClick={() => setTestConnection(true)}
                                        className="px-6 py-2.5 bg-gray-50 text-gray-400 border border-gray-50 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-2"
                                    >
                                        <Navigation size={12} />
                                        Verify Integration
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setIsDiscardModalOpen(true)}
                                className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors uppercase italic"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-100/30 hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Save size={13} strokeWidth={2.5} />
                                Commit Settings
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg shadow-slate-50/5 overflow-hidden animate-in fade-in slide-in-from-left-3 duration-500">
                        <div className="p-6 lg:p-8">
                            <div className="flex items-center gap-3.5 mb-8">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Admin Security</h2>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 opacity-80 italic">Root Profile Identity</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Profile Metadata</label>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1 italic">Administrative Username</p>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 text-slate-900 rounded-lg flex items-center justify-center transition-all group-focus-within:bg-slate-900 group-focus-within:text-white">
                                                        <User size={14} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={formData.username}
                                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-slate-100 outline-none transition-all shadow-inner"
                                                        placeholder="Admin UUID"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1 italic">Primary Contact Protocol</p>
                                                <div className="relative group">
                                                     <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 text-slate-900 rounded-lg flex items-center justify-center transition-all group-focus-within:bg-slate-900 group-focus-within:text-white">
                                                        <Activity size={14} />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-slate-100 outline-none transition-all shadow-inner"
                                                        placeholder="admin@leadmarket.platform"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Authentication Layer</label>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1 italic">Account Security Key</p>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 text-slate-900 rounded-lg flex items-center justify-center transition-all group-focus-within:bg-slate-900 group-focus-within:text-white">
                                                        <Lock size={14} />
                                                    </div>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={formData.password}
                                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                        className="w-full pl-14 pr-12 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-slate-100 outline-none transition-all shadow-inner"
                                                        placeholder="••••••••••••••••"
                                                    />
                                                    <button 
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-slate-900 transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button
                                onClick={handleUpdate}
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-slate-100/30 hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Lock size={13} strokeWidth={2.5} />
                                Secure Account
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDiscardModalOpen}
                onClose={() => setIsDiscardModalOpen(false)}
                onConfirm={handleDiscard}
                title="Revert Settings"
                message="Are you sure you want to revert all changes to the environment? Current progress will be lost."
                confirmText="Revert Now"
                type="danger"
            />
        </div>
    );
};

export default Settings;

import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Briefcase,
    CheckCircle,
    Star,
    Clock,
    ShieldAlert,
    Globe
} from 'lucide-react';

const Profile = () => {
    const { currentUser, updateProfile, showToast } = useMarketplace();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        businessName: currentUser?.businessName || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        category: currentUser?.category || '',
        location: currentUser?.location || '',
        serviceRadius: currentUser?.serviceRadius || 15,
        experience: currentUser?.experience || '5 years',
        bio: currentUser?.bio || 'Dedicated professional with a commitment to excellence in service delivery and customer satisfaction.',
        availability: currentUser?.availability || 'Mon - Fri, 9 AM - 6 PM'
    });
    const [avatar, setAvatar] = useState(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
        setIsEditing(false);
        showToast('Profile updated successfully', 'success');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-gray-900">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Professional Profile</h1>
                    <p className="text-base text-gray-500 mt-1 font-medium">Manage your public presence and service credentials.</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-8 py-3 bg-white border-2 border-gray-100 text-gray-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 hover:border-blue-100 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                    >
                        Edit Profile <User size={16} className="text-blue-600" />
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-100"
                        >
                            Save <CheckCircle size={16} />
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-8 py-3 bg-gray-100 text-gray-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-10 text-center">
                        <div className="relative inline-block group cursor-pointer">
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                disabled={!isEditing}
                            />
                            <label htmlFor="avatar-upload" className={isEditing ? 'cursor-pointer' : ''}>
                                <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                                    {avatar ? (
                                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        formData.name.charAt(0)
                                    )}
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={24} />
                                            <span className="text-[10px] uppercase font-black mt-1">Upload</span>
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{formData.businessName || formData.name}</h2>
                            <p className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mt-2">{formData.category || 'Service Provider'}</p>
                            <div className="flex items-center justify-center gap-1 mt-4 text-amber-400">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <span className="text-gray-400 text-xs font-black ml-1 uppercase tracking-widest">5.0 (42 reviews)</span>
                            </div>
                        </div>
                        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-gray-50 pt-10">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jobs Done</p>
                                <p className="text-xl font-black text-gray-900 mt-1">128</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</p>
                                <p className="text-xl font-black text-gray-900 mt-1">{formData.experience}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 disabled:opacity-50"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 disabled:opacity-50"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 disabled:opacity-50"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 disabled:opacity-50"
                                            placeholder="City, State"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Radius (Miles)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="number"
                                            name="serviceRadius"
                                            value={formData.serviceRadius}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 disabled:opacity-50"
                                            placeholder="e.g. 15"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Availability</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            name="availability"
                                            value={formData.availability}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 disabled:opacity-50"
                                            placeholder="e.g. Mon-Fri, 9am-5pm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows={4}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 disabled:opacity-50 resize-none leading-relaxed"
                                    placeholder="Describe your expertise and service quality..."
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

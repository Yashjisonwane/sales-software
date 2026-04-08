import React, { useState, useEffect } from 'react';
import {
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    ChevronRight,
    ArrowLeft,
    CheckCircle2,
    Search,
    X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const RequestService = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        categoryId: '',
        categoryName: '',
        address: '',
        city: '',
        state: '',
        description: '',
        zipCode: '',
        preferredDate: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const getBrowserLocation = () =>
        new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ latitude: null, longitude: null });
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    });
                },
                () => resolve({ latitude: null, longitude: null }),
                { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
            );
        });

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/leads/categories`);
                const fetchedCategories = res.data.data || [];
                setCategories(fetchedCategories);

                // Auto-match from URL after categories are loaded
                const params = new URLSearchParams(window.location.search);
                const q = params.get('query');
                const pc = params.get('postcode');
                const plan = params.get('plan');

                if (q) {
                    setSearchTerm(q);
                    const matched = fetchedCategories.find(c => 
                        c.name.toLowerCase() === q.toLowerCase() || 
                        c.name.toLowerCase().includes(q.toLowerCase())
                    );
                    if (matched) {
                        setFormData(prev => ({ 
                            ...prev, 
                            categoryId: matched.id, 
                            categoryName: matched.name,
                            zipCode: pc || prev.zipCode,
                            description: plan ? `Plan: ${plan}. ` : prev.description
                        }));
                        // Automatically show form if coming from Hero with full info
                        if (pc) setIsFormVisible(true);
                    } else {
                        setFormData(prev => ({ 
                            ...prev, 
                            zipCode: pc || prev.zipCode,
                            description: (q ? `Searching for: ${q}. ` : '') + (plan ? `Plan: ${plan}. ` : '')
                        }));
                    }
                } else {
                    if (pc) setFormData(prev => ({ ...prev, zipCode: pc }));
                    if (plan) setFormData(prev => ({ ...prev, description: `Plan: ${plan}. ` }));
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCats();
    }, []);

    const filteredCategories = searchTerm 
        ? categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : categories;

    const handleCategorySelect = (cat) => {
        setFormData({ ...formData, categoryId: cat.id, categoryName: cat.name });
        setSearchTerm(cat.name);
        setShowSuggestions(false);
    };

    const handleSearchClick = () => {
        if (!formData.categoryId) {
            setError('Please select a service category first');
            return;
        }
        if (!formData.zipCode) {
            setError('Please enter your ZIP Code / Pincode');
            return;
        }
        setIsFormVisible(true);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.categoryId) {
            setError('Please search and select a service category first');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            const { latitude, longitude } = await getBrowserLocation();
            const res = await axios.post(`${API_BASE_URL}/guest/request`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                categoryName: formData.categoryName,
                location: `${formData.address}, ${formData.city}, ${formData.state} - ZIP: ${formData.zipCode}`,
                description: formData.description,
                preferredDate: formData.preferredDate,
                latitude,
                longitude
            });

            if (res.data.success) {
                // Store guest session token for tracking/chat
                localStorage.setItem('guestSessionToken', res.data.sessionToken);
                setIsSuccess(true);
                // Redirect after status awareness
                setTimeout(() => navigate(`/track/${res.data.sessionToken}`), 3000);
            } else {
                setError(res.data.message || 'Failed to submit request');
            }
        } catch (err) {
            setError('Connection failed. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#7C3AED] p-6">
                <div className="bg-white rounded-[2.5rem] p-10 text-center shadow-2xl max-w-lg">
                    <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-4">Request Sent!</h2>
                    <p className="text-[#6B7280] font-medium mb-8">
                        Thank you. Our local professionals are being notified. Redirecting you home...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FCFCFD] min-h-screen pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <div className="mb-10 text-center">
                    <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-[#7C3AED] mb-4 hover:opacity-70 transition-all">
                        <ArrowLeft className="w-3 h-3 mr-2" />
                        Return Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-4 tracking-tighter leading-tight">Request Your <span className="text-[#7C3AED]">Service.</span></h1>
                    <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
                        Find verified professionals in your local area.
                    </p>
                </div>

                <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative border border-[#F3F4F6]">
                    {/* Compact Search Bar Section at Top */}
                    <div className="bg-[#111827] p-6 md:p-8 rounded-t-[3rem] overflow-visible">
                        <div className="relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block ml-4">Step 1: What do you need and where?</label>
                            <div className="flex flex-col gap-3">
                                {/* Search Row */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-[2] group">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="What service do you need?"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setShowSuggestions(true);
                                                setIsFormVisible(false); // Hide form if searching again
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                            className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-gray-500 focus:bg-white focus:text-[#111827] focus:ring-4 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm"
                                        />
                                        
                                        {showSuggestions && (searchTerm || categories.length > 0) && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden max-h-64 overflow-y-auto">
                                                <div className="px-5 py-3 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-[#7C3AED] border-b border-gray-100">
                                                    {searchTerm ? 'Suggested Services' : 'All Available Services'}
                                                </div>
                                                {filteredCategories.length > 0 ? (
                                                    filteredCategories.map(cat => (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            onClick={() => handleCategorySelect(cat)}
                                                            className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors bg-white text-[#111827]"
                                                        >
                                                            <span className="font-bold text-sm">{cat.name}</span>
                                                            <ChevronRight size={12} className="text-[#7C3AED]" />
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-6 py-4 text-gray-400 font-bold italic text-sm">No services found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative flex-1 group">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="zipCode"
                                            placeholder="Pincode / ZIP"
                                            value={formData.zipCode}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setIsFormVisible(false); // Hide form if pincode changes
                                            }}
                                            className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-gray-500 focus:bg-white focus:text-[#111827] focus:ring-4 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleSearchClick}
                                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12 min-h-[300px]">
                        {isFormVisible ? (
                             <>
                                <div className="p-5 bg-purple-50 border border-purple-100 rounded-2xl flex items-center gap-4 transition-all animate-in slide-in-from-top-4">
                                    <div className="w-12 h-12 bg-[#7C3AED] text-white rounded-xl flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#7C3AED] mb-1">Service Ready</div>
                                        <div className="text-lg font-black text-[#111827]">{formData.categoryName} at {formData.zipCode}</div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => { setIsFormVisible(false); }}
                                        className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Step 2: Personal & Project Details */}
                                <div className="space-y-12 animate-in fade-in duration-700">
                                    <section>
                                        <div className="flex items-center mb-8 border-b border-[#F9FAFB] pb-4">
                                            <div className="w-8 h-8 bg-purple-50 text-[#7C3AED] rounded-lg flex items-center justify-center mr-4">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <h2 className="text-xs font-black uppercase tracking-widest text-[#111827]">Step 2: Contact Info</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Full Name"
                                                className="block w-full px-6 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-4 focus:ring-[#7C3AED]/10 outline-none transition-all text-sm font-bold"
                                            />
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Phone Number"
                                                className="block w-full px-6 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-4 focus:ring-[#7C3AED]/10 outline-none transition-all text-sm font-bold"
                                            />
                                            <div className="md:col-span-2">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Email Address"
                                                    className="block w-full px-6 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-4 focus:ring-[#7C3AED]/10 outline-none transition-all text-sm font-bold"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center mb-8 border-b border-[#F9FAFB] pb-4">
                                            <div className="w-8 h-8 bg-purple-50 text-[#7C3AED] rounded-lg flex items-center justify-center mr-4">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <h2 className="text-xs font-black uppercase tracking-widest text-[#111827]">Step 3: Tell us more</h2>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    placeholder="City"
                                                    className="block w-full px-6 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-4 focus:ring-[#7C3AED]/10 outline-none transition-all text-sm font-bold"
                                                />
                                                <input
                                                    type="text"
                                                    name="state"
                                                    required
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    placeholder="State"
                                                    className="block w-full px-6 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-4 focus:ring-[#7C3AED]/10 outline-none transition-all text-sm font-bold"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    required
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="Street / Area Name"
                                                    className="block w-full px-6 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-4 focus:ring-[#7C3AED]/10 outline-none transition-all text-sm font-bold"
                                                />
                                                <div className="relative">
                                                     <input
                                                        type="date"
                                                        name="preferredDate"
                                                        required
                                                        value={formData.preferredDate}
                                                        onChange={handleChange}
                                                        className="block w-full px-6 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-4 focus:ring-[#7C3AED]/10 outline-none transition-all text-sm font-bold text-[#111827]"
                                                    />
                                                    <label className="absolute -top-2 left-4 bg-white px-2 text-[8px] font-black uppercase tracking-widest text-[#7C3AED]">Preferred Date</label>
                                                </div>
                                            </div>
                                            <textarea
                                                rows="4"
                                                name="description"
                                                required
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Describe the problem or what you need professional help with..."
                                                className="block w-full px-6 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-4 focus:ring-[#7C3AED]/10 outline-none transition-all text-sm font-bold resize-none"
                                            ></textarea>
                                        </div>
                                    </section>

                                    <div className="pt-12">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-6 bg-[#111827] hover:bg-[#1f2937] text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center"
                                        >
                                            {isSubmitting ? 'Sending Request...' : 'Get Free Quotes'}
                                            <ChevronRight className="w-5 h-5 ml-4" />
                                        </button>
                                    </div>
                                </div>
                             </>
                        ) : (
                             <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                                <Search size={64} className="text-gray-100 mx-auto mb-6" />
                                <h3 className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Enter a service and Pincode above, then click Search</h3>
                             </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-black flex items-center justify-center mt-8">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestService;

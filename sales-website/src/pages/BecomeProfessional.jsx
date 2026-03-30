import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    User,
    Phone,
    Mail,
    MapPin,
    ClipboardCheck,
    ShieldCheck,
    ChevronRight,
    ArrowLeft,
    CheckCircle,
    Building,
    Home,
    Power,
    CreditCard
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as apiService from '../apiService';

const BecomeProfessional = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [plans, setPlans] = useState([]);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        category: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        preferredPlan: searchParams.get('plan') || 'Starter'
    });

    const [showCatSuggestions, setShowCatSuggestions] = useState(false);

    const filteredCategories = formData.category
        ? categories.filter(cat => cat.name.toLowerCase().includes(formData.category.toLowerCase()))
        : categories;

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Load categories
                const catRes = await apiService.getCategories();
                if (catRes.success) {
                    setCategories(catRes.data);
                }
                
                // Load plans
                const planRes = await apiService.fetchSubscriptions();
                if (planRes.success) {
                    setPlans(planRes.data);
                }
            } catch (err) {
                console.error("Failed to load initial data:", err);
            }
        };
        loadInitialData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await apiService.submitProfessionalRequest(formData);
            if (res.success) {
                setSubmitted(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter">Application Received!</h1>
                <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                    Thank you, <span className="font-bold text-gray-900">{formData.name}</span>. Admin will review and send credentials to <span className="font-bold text-gray-900">{formData.email}</span>.
                </p>
                <Link to="/" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold transition-all hover:bg-black active:scale-95 shadow-lg">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-12">
            <div id="registration-form" className="max-w-3xl mx-auto px-6 py-6 lg:py-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-[#7C3AED] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        <ClipboardCheck size={12} />
                        Join Now
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] mb-3 tracking-tighter leading-tight">Professional <span className="text-[#7C3AED]">Registration.</span></h2>
                    <p className="text-sm text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                        Fill out the details below to request your professional account.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
                    <form className="p-6 md:p-10 space-y-8" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
                                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0">!</div>
                                {error}
                            </div>
                        )}

                        {/* Section 1: Identity */}
                        <section>
                            <div className="flex items-center mb-6">
                                <span className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-black mr-3 shadow-md">1</span>
                                <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">Identity & Contact</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#7C3AED] transition-colors" />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900 placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Business Name</label>
                                    <div className="relative group">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#7C3AED] transition-colors" />
                                        <input
                                            type="text"
                                            name="businessName"
                                            required
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            placeholder="Acme Services"
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#7C3AED] transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#7C3AED] transition-colors" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Specialty & Location */}
                        <section>
                            <div className="flex items-center mb-6">
                                <span className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-black mr-3 shadow-md">2</span>
                                <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">Specialty & Location</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5 relative">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Specialty / Category</label>
                                    <div className="relative group">
                                        <ClipboardCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#7C3AED] transition-colors" />
                                        <input 
                                            type="text"
                                            name="category"
                                            required
                                            value={formData.category}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setShowCatSuggestions(true);
                                            }}
                                            onFocus={() => setShowCatSuggestions(true)}
                                            placeholder="e.g. Plumbing, Electrician..."
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                        />
                                        
                                        {showCatSuggestions && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden max-h-60 overflow-y-auto transform animate-in fade-in slide-in-from-top-2">
                                                <div className="px-4 py-2 bg-gray-50 text-[8px] font-black uppercase tracking-widest text-[#7C3AED] border-b border-gray-100">
                                                    {formData.category ? 'Suggested Specialities' : 'All Speciality Categories'}
                                                </div>
                                                {filteredCategories.length > 0 ? (
                                                    filteredCategories.map(cat => (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, category: cat.name }));
                                                                setShowCatSuggestions(false);
                                                            }}
                                                            className="w-full px-5 py-3 text-left hover:bg-purple-50 flex items-center justify-between group transition-colors"
                                                        >
                                                            <span className="font-bold text-xs text-gray-700 group-hover:text-[#7C3AED]">{cat.name}</span>
                                                            <ChevronRight size={10} className="text-gray-300 group-hover:text-[#7C3AED]" />
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-5 py-4 text-center">
                                                        <p className="text-[10px] text-gray-400 font-bold italic">No matches. You can still type manually.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {showCatSuggestions && (
                                        <div 
                                            className="fixed inset-0 z-40 bg-transparent" 
                                            onClick={() => setShowCatSuggestions(false)}
                                        />
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Preferred Plan</label>
                                    <div className="relative group">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#7C3AED] transition-colors" />
                                        <select 
                                            name="preferredPlan"
                                            required
                                            value={formData.preferredPlan}
                                            onChange={handleChange}
                                            className="block w-full pl-11 pr-8 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900 appearance-none"
                                        >
                                            <option value="">Select Plan...</option>
                                            {plans.map(plan => (
                                                <option key={plan.id} value={plan.name}>
                                                    {plan.name} (Price: ${plan.price})
                                                </option>
                                            ))}
                                            {!plans.length && (
                                                <>
                                                    <option value="Starter">Starter Plan (Price: $10)</option>
                                                    <option value="Professional">Professional Plan (Price: $25)</option>
                                                    <option value="Business">Business Plan (Price: $50)</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                                    <div className="relative group">
                                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#7C3AED] transition-colors" />
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="123 Street"
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 col-span-1 md:col-span-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            required
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">ZIP</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            required
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold text-sm text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 text-white font-black text-lg rounded-xl transition-all shadow-xl flex items-center justify-center group active:scale-95 ${loading ? 'bg-gray-400' : 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-[#7C3AED]/20'}`}
                            >
                                {loading ? 'Submitting...' : 'Apply Now'}
                                {!loading && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" />}
                            </button>
                            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 mt-6 text-[9px] text-gray-400 font-black uppercase tracking-widest">
                                <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-green-500" /> Admin Review</span>
                                <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-green-500" /> No Fees</span>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BecomeProfessional;

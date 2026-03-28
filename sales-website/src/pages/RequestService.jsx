import React, { useState, useEffect } from 'react';
import {
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    ChevronRight,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const RequestService = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        categoryId: '',
        location: '',
        description: '',
        zipCode: '',
        preferredDate: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/leads/categories`);
                setCategories(res.data.data || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCats();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/leads`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                categoryId: formData.categoryId,
                location: `${formData.location}, ZIP: ${formData.zipCode}`,
                description: formData.description
            });

            if (res.data.success) {
                setIsSuccess(true);
                setTimeout(() => navigate('/'), 3000);
            } else {
                setError(res.data.error || 'Failed to submit request');
            }
        } catch (err) {
            setError('Connection failed. Please check your backend.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#7C3AED] p-6">
                <div className="bg-white rounded-[2.5rem] p-10 text-center shadow-2xl max-w-lg transform animate-in fade-in zoom-in duration-500">
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
                {/* Header/Back Link */}
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center text-[13px] font-black uppercase tracking-widest text-[#111827] hover:text-[#374151] transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Service Portal</span>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden border border-[#F3F4F6]">
                    <div className="bg-[#111827] p-10 md:p-14 !text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="relative z-10 text-center">
                            <h1 className="text-2xl md:text-3xl font-black mb-4 tracking-tight leading-tight !text-white">Request Your Service</h1>
                            <p className="!text-gray-300 text-sm md:text-base font-medium max-w-md mx-auto opacity-100">
                                Tell us what you need and we'll connect you with the best-matched local experts.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
                        {/* Personal Information */}
                        <section>
                            <div className="flex items-center mb-8 border-b border-[#F9FAFB] pb-4">
                                <div className="w-8 h-8 bg-purple-50 text-[#7C3AED] rounded-lg flex items-center justify-center mr-4">
                                    <User className="w-4 h-4" />
                                </div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-[#111827]">Contact Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="block w-full px-5 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all text-[14px] font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="1234567890"
                                        className="block w-full px-5 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all text-[14px] font-medium"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="block w-full px-5 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all text-[14px] font-medium"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Project Requirements */}
                        <section>
                            <div className="flex items-center mb-8 border-b border-[#F9FAFB] pb-4">
                                <div className="w-8 h-8 bg-purple-50 text-[#7C3AED] rounded-lg flex items-center justify-center mr-4">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-[#111827]">Job Requirements</h2>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Service Category</label>
                                    <select 
                                        name="categoryId"
                                        required
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all text-[14px] font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="">What do you need help with?</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Project Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="Street, City, State"
                                            className="block w-full px-5 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all text-[14px] font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            required
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            placeholder="90210"
                                            className="block w-full px-5 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all text-[14px] font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Detailed Description</label>
                                    <textarea
                                        rows="4"
                                        name="description"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Briefly describe the professional help you need..."
                                        className="block w-full px-5 py-4 border border-[#F3F4F6] bg-[#F9FAFB] rounded-2xl focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all text-[14px] font-medium resize-none shadow-inner"
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[13px] font-black flex items-center justify-center">
                                {error}
                            </div>
                        )}

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-5 bg-[#111827] hover:bg-[#1f2937] text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(17,24,39,0.3)] active:scale-[0.98] flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Processing...' : 'Submit Service Request'}
                                <ChevronRight className="w-4 h-4 ml-4" />
                            </button>
                        </div>
                    </form>
                </div>
                
                <p className="mt-8 text-center text-[11px] text-[#9CA3AF] font-bold uppercase tracking-widest">
                    Your request will be shared with verified local professionals only.
                </p>
            </div>
        </div>
    );
};

export default RequestService;

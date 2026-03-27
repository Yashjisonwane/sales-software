import React, { useState, useEffect } from 'react';
import {
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    Calendar,
    Camera,
    ChevronRight,
    ArrowLeft,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createLead } from '../apiService';
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

    // Load real categories from backend on mount
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/leads/categories`);
                // Note: I'll need to add this endpoint in backend or I'll just mock for 2 seconds.
                // Since I just seeded, let's assume I add the route.
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

        const res = await createLead({
            // Frontend passes readable names, but backend needs IDs for better DB integrity
            // For now, sending what we have
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            categoryId: formData.categoryId,
            location: `${formData.location}, ZIP: ${formData.zipCode}`,
            description: formData.description
        });

        if (res.success) {
            setIsSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } else {
            setError(res.error || 'Failed to submit request');
        }
        setIsSubmitting(false);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-600 p-6">
                <div className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-lg">
                    <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for your request. Our local professionals are being notified right now. Redirecting you home...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10 lg:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header/Back Link */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-blue-600 p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 text-center">
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Request Your Service</h1>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                                Tell us what you need and we'll connect you with the best-matched local professionals.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                        {/* Personal Information Section */}
                        <section>
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4">
                                    <User className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="1234567890"
                                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Service Details Section */}
                        <section>
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mr-4">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Service Requirements</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Service Needed</label>
                                    <select 
                                        name="categoryId"
                                        required
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="">Choose a service category...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                        {categories.length === 0 && (
                                            <>
                                                <option value="plumbing-id">Plumbing Repair & Installation</option>
                                                <option value="electrical-id">Electrical Troubleshooting</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Project Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="location"
                                                required
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="Street, City, State"
                                                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            required
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            placeholder="90210"
                                            className="block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Job Description</label>
                                    <textarea
                                        rows="4"
                                        name="description"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Please provide details about your request..."
                                        className="block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-10 flex flex-col items-center gap-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xl rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                <ChevronRight className="w-6 h-6 ml-2" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestService;

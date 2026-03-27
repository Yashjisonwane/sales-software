import React, { useState } from 'react';
import {
    Briefcase,
    User,
    Phone,
    Mail,
    MapPin,
    ClipboardCheck,
    Zap,
    Star,
    ShieldCheck,
    ChevronRight,
    ArrowLeft,
    CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BecomeProfessional = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            navigate('/signup');
        }, 2000);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Header/Back Link */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-10 text-center sm:text-left">
                <Link to="/" className="inline-flex items-center text-sm font-black text-brand-black hover:underline transition-all uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </div>

            <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-24">
                <div className="text-center mb-16 lg:mb-24">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#1a1a1a] mb-6 tracking-tighter leading-none">Elevate Your <br /><span className="text-[#7C3AED]">Business.</span></h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
                        Join the elite network of background-checked professionals and start receiving high-quality local leads instantly.
                    </p>
                </div>

                {/* Main Registration Card */}
                <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 mb-20 animate-slide-up">
                    <div className="bg-gray-900 p-8 sm:p-12 md:p-16 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-80 h-80 bg-[#7C3AED] rounded-full blur-[120px] opacity-10"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-black mb-3 tracking-tight outline-none">Become a Partner</h2>
                                <p className="text-gray-400 font-medium text-lg leading-none">Join 50k+ pros growing with ServiceHub.</p>
                            </div>
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-14 h-14 rounded-full border-4 border-gray-900 bg-gray-800 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-[#7C3AED]/10 text-[#7C3AED]/70 flex items-center justify-center font-black">P</div>
                                    </div>
                                ))}
                                <div className="w-14 h-14 rounded-full border-4 border-gray-900 bg-[#7C3AED] flex items-center justify-center text-white font-black text-xs tracking-tighter">
                                    +50k
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="p-8 sm:p-12 md:p-20 space-y-12 md:space-y-16" onSubmit={handleSubmit}>
                        {/* Section 1: Business Identity */}
                        <section>
                            <div className="flex items-center mb-10">
                                <span className="w-10 h-10 rounded-2xl bg-brand-black text-white flex items-center justify-center font-black mr-5 shadow-xl shadow-brand-black/10">1</span>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Identity</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Business Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-brand-black transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Elite Services LLC"
                                            className="block w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-brand-black focus:bg-white outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Jane Smith"
                                            className="block w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Work Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            placeholder="jane@eliteservices.com"
                                            className="block w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Phone</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="(555) 123-4567"
                                            className="block w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Services & Area */}
                        <section>
                            <div className="flex items-center mb-10">
                                <span className="w-10 h-10 rounded-2xl bg-brand-black text-white flex items-center justify-center font-black mr-5 shadow-xl shadow-brand-black/10">2</span>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Coverage</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Service Type</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <ClipboardCheck className="h-5 w-5 text-gray-400 group-focus-within:text-brand-black transition-colors" />
                                        </div>
                                        <select className="block w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-brand-black focus:bg-white outline-none transition-all bg-white appearance-none cursor-pointer font-black text-sm">
                                            <option value="">Select Service...</option>
                                            <option>Plumbing</option>
                                            <option>Electrical</option>
                                            <option>Cleaning</option>
                                            <option>HVAC</option>
                                            <option>Handyman</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">ZIP Codes</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-[#7C3AED] transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="90210, 90211"
                                            className="block w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-[#7C3AED] focus:bg-white outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="pt-8">
                            <button
                                type="submit"
                                disabled={submitted}
                                className={`w-full py-6 text-white font-black text-xl rounded-[1.5rem] transition-all shadow-2xl flex items-center justify-center group active:scale-95 ${submitted ? 'bg-green-500 shadow-green-500/20' : 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-[#7C3AED]/30'}`}
                            >
                                {submitted ? 'Application Sent!' : 'Create Professional Account'}
                                {!submitted && <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />}
                                {submitted && <CheckCircle className="w-6 h-6 ml-2" />}
                            </button>
                            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-8 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-green-500 shrink-0" /> No Hidden Fees</span>
                                <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-green-500 shrink-0" /> Secure Payments</span>
                                <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-green-500 shrink-0" /> Cancel Anytime</span>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BecomeProfessional;

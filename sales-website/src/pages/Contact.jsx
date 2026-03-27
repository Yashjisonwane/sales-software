import React, { useState } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Clock,
    Send,
    CheckCircle
} from 'lucide-react';
import MapPreview from '../components/MapPreview';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Header */}
            <section className="bg-gray-900 text-white py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#7C3AED_0%,transparent_50%)] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter">How Can We Help?</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        Whether you're a customer looking for help or a professional interested in joining, our team is ready to assist you.
                    </p>
                </div>
            </section>

            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Left Side: Contact Info & Map */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a] mb-10 tracking-tighter">Contact Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-2 transition-all">
                                        <div className="w-14 h-14 bg-brand-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-brand-black/10 group-hover:rotate-12 transition-transform">
                                            <Mail className="w-7 h-7" />
                                        </div>
                                        <h3 className="font-black text-gray-900 mb-2 text-xl tracking-tight">Email Support</h3>
                                        <p className="text-[10px] text-gray-400 mb-6 font-black uppercase tracking-widest leading-none">Quick response within 24h</p>
                                        <span className="text-gray-500 font-bold text-sm">support@servicehub.com</span>
                                    </div>

                                    <div className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-2 transition-all">
                                        <div className="w-14 h-14 bg-brand-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-brand-black/10 group-hover:rotate-12 transition-transform">
                                            <Phone className="w-7 h-7" />
                                        </div>
                                        <h3 className="font-black text-gray-900 mb-2 text-xl tracking-tight">Call Anywhere</h3>
                                        <p className="text-[10px] text-gray-400 mb-6 font-black uppercase tracking-widest leading-none">Mon-Fri: 8am - 6pm EST</p>
                                        <span className="text-gray-500 font-bold text-sm">+1 (800) 555-1234</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 pt-4">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-gray-100 text-brand-black rounded-xl flex items-center justify-center mr-5 shrink-0">
                                        <MapPin className="w-5 h-5 pointer-events-none" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 mb-1 text-sm uppercase tracking-widest">Office Address</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">
                                            123 Marketplace Avenue, Suite 500<br />
                                            Silicon Valley, CA 94025
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-gray-100 text-brand-black rounded-xl flex items-center justify-center mr-5 shrink-0">
                                        <Clock className="w-5 h-5 pointer-events-none" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 mb-1 text-sm uppercase tracking-widest">Business Hours</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">
                                            Monday - Friday: 9:00 AM - 5:00 PM<br />
                                            Saturday: 10:00 AM - 2:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Preview Container */}
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100 h-96 relative group">
                                <MapPreview />
                                <div className="absolute inset-0 bg-[#7C3AED]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-[1.5rem] border border-white flex items-center justify-between shadow-xl">
                                    <div className="flex items-center">
                                        <MapPin className="w-5 h-5 text-[#7C3AED] mr-3" />
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Get Directions</span>
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-[#7C3AED]" />
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Contact Form */}
                        <div className="bg-gray-50 rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-10 md:p-16 border border-gray-100 relative shadow-2xl shadow-gray-100">
                            <h2 className="text-3xl md:text-4xl font-black text-brand-black mb-12 tracking-tighter">Send a Message</h2>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white border border-gray-200 rounded-2xl p-5 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all font-bold text-sm"
                                            placeholder="Jane"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white border border-gray-200 rounded-2xl p-5 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all font-bold text-sm"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-white border border-gray-200 rounded-2xl p-5 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all font-bold text-sm"
                                        placeholder="jane@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Topic</label>
                                    <div className="relative">
                                        <select className="w-full bg-white border border-gray-200 rounded-2xl p-5 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all font-bold text-sm appearance-none cursor-pointer">
                                            <option>General Support</option>
                                            <option>Become a Professional</option>
                                            <option>Billing & Payments</option>
                                            <option>Report a Problem</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-gray-400">
                                            <Send className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Message</label>
                                    <textarea
                                        rows="5"
                                        required
                                        className="w-full bg-white border border-gray-200 rounded-2xl p-5 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all font-black text-sm resize-none"
                                        placeholder="Tell us more..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitted}
                                    className={`w-full py-5 text-white font-black text-lg rounded-2xl transition-all shadow-xl flex items-center justify-center group active:scale-95 ${submitted ? 'bg-green-500 shadow-green-500/20' : 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-[#7C3AED]/30'}`}
                                >
                                    {submitted ? 'Message Sent!' : 'Send Message'}
                                    {!submitted && <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                    {submitted && <CheckCircle className="w-5 h-5 ml-2" />}
                                </button>

                                <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    Average response time: 4 hours
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;

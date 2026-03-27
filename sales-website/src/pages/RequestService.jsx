import React from 'react';
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
    ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RequestService = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-10 lg:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header/Back Link */}
                <div className="mb-8">
                    <Link to="/services" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Professionals
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-blue-600 p-8 md:p-12 text-white relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10 text-center">
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Request Your Service</h1>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                                Tell us what you need and we'll connect you with the best-matched local professionals.
                            </p>
                        </div>
                    </div>

                    <form className="p-8 md:p-12 space-y-10">
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
                                            placeholder="John Doe"
                                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                                            placeholder="(555) 000-0000"
                                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                                            placeholder="john@example.com"
                                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                                    <select className="block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white appearance-none cursor-pointer">
                                        <option value="">Choose a service category...</option>
                                        <option value="plumbing">Plumbing Repair & Installation</option>
                                        <option value="electrical">Electrical Troubleshooting</option>
                                        <option value="cleaning">Home Deep Cleaning</option>
                                        <option value="hvac">HVAC Maintenance</option>
                                        <option value="landscaping">Landscaping & Garden</option>
                                        <option value="handyman">General Handyman Tasks</option>
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
                                                placeholder="Street, City, State"
                                                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">ZIP Code</label>
                                        <input
                                            type="text"
                                            placeholder="90210"
                                            className="block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Job Description</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Please provide details about your request (e.g., brand of appliance, specific issue, dimensions)..."
                                        className="block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Schedule and Photos */}
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center mb-2">
                                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mr-4">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Timing</h2>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Preferred Date</label>
                                        <input
                                            type="date"
                                            className="block w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                        />
                                        <p className="text-xs text-gray-500 ml-1 mt-2 flex items-center">
                                            <ShieldCheck className="w-3 h-3 mr-1 text-green-500" />
                                            ServiceHub will confirm availability.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center mb-2">
                                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mr-4">
                                            <Camera className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Photos</h2>
                                    </div>
                                    <div className="group relative border-2 border-dashed border-gray-200 rounded-3xl p-6 transition-all hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer flex flex-col items-center justify-center text-center">
                                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <Camera className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                                        <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Upload Photos</p>
                                        <p className="text-xs text-gray-500 mt-1">Add visuals to help pros estimate accurately.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Submit Button */}
                        <div className="pt-10 flex flex-col items-center gap-4 border-t border-gray-100">
                            <button
                                type="submit"
                                className="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xl rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center"
                            >
                                Submit Request
                                <ChevronRight className="w-6 h-6 ml-2" />
                            </button>
                            <p className="text-sm text-gray-500 flex items-center">
                                <ShieldCheck className="w-4 h-4 text-green-500 mr-2" />
                                Your information is secured and encrypted.
                            </p>
                        </div>
                    </form>
                </div>

                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>Need immediate assistance? <Link to="/contact" className="text-blue-600 font-bold hover:underline">Chat with a Support Agent</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RequestService;

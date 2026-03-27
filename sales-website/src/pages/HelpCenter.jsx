import React from 'react';
import CTASection from '../components/CTASection';
import { HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';

const HelpCenter = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-gray-50 py-20 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How can we help you today?</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Search our help center or contact our support team for any questions about your service requests.
                    </p>
                    <div className="mt-10 max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search for articles, guides..."
                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
                        />
                        <button className="absolute right-3 top-3 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Support Channels */}
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: HelpCircle, title: 'FAQs', desc: 'Find quick answers to common questions.' },
                        { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with our support experts 24/7.' },
                        { icon: Phone, title: 'Phone Support', desc: 'Call us at 1-800-SERVICE-HUB.' },
                        { icon: Mail, title: 'Email Us', desc: 'Get a response within 24 hours.' }
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* The new CTA Section */}
            <CTASection />
        </div>
    );
};

export default HelpCenter;

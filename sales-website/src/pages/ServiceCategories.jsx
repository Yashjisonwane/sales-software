import React from 'react';
import { Home, Zap, Wrench, Heart, Briefcase, ChevronRight } from 'lucide-react';

const categories = [
    { name: 'Home Cleaning', icon: <Home className="w-8 h-8 text-blue-500" />, count: 124 },
    { name: 'Electrical', icon: <Zap className="w-8 h-8 text-yellow-500" />, count: 85 },
    { name: 'Plumbing', icon: <Wrench className="w-8 h-8 text-gray-500" />, count: 112 },
    { name: 'Wellness', icon: <Heart className="w-8 h-8 text-red-500" />, count: 64 },
    { name: 'Business Services', icon: <Briefcase className="w-8 h-8 text-indigo-500" />, count: 93 },
    // Adding placeholders for grid
    { name: 'Landscaping', icon: <Home className="w-8 h-8 text-green-500" />, count: 75 },
    { name: 'Moving', icon: <Briefcase className="w-8 h-8 text-orange-500" />, count: 52 },
    { name: 'Handyman', icon: <Wrench className="w-8 h-8 text-blue-600" />, count: 145 },
];

const ServiceCategories = () => {
    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse All Categories</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        From quick repairs to major renovations, find the right professional for any project.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                {category.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{category.count} professionals</p>
                            <div className="mt-auto text-blue-600 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Explore <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceCategories;

import React from 'react';
import SearchBar from '../components/SearchBar';
import ProviderCard from '../components/ProviderCard';
import MapPreview from '../components/MapPreview';
import { Filter, MapPin, List } from 'lucide-react';

const FindServices = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            {/* Top Header with Search Bar */}
            <div className="bg-white border-b border-gray-100 z-20 sticky top-16 md:top-20">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 max-w-2xl">
                        <SearchBar />
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="flex items-center px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </button>
                        <div className="hidden sm:flex bg-gray-100 rounded-full p-1">
                            <button className="p-2 rounded-full bg-white shadow-sm text-blue-600">
                                <List className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700">
                                <MapPin className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Split Layout */}
            <div className="flex-1 flex flex-col lg:flex-row relative">
                {/* Left Side: Map Container */}
                <div className="w-full lg:w-1/2 h-[350px] lg:h-[calc(100vh-140px)] lg:sticky lg:top-32 lg:overflow-hidden bg-gray-50 border-r border-gray-100 p-4 lg:p-8 z-10">
                    <div className="h-full w-full rounded-3xl overflow-hidden card-shadow-lg animate-pulse-soft">
                        <MapPreview />
                    </div>
                </div>

                {/* Right Side: Provider List */}
                <div className="w-full lg:w-1/2 bg-white">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Found 24 Professionals</h2>
                            <span className="text-sm text-gray-500">Sorted by: Recommended</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                            {[
                                { name: "Elite Plumbing Solutions", profession: "Commercial & Residential", rating: "5.0", jobs: "1,240", distance: "1.2 miles" },
                                { name: "Pro-Spark Electrical", profession: "Licensed Master Electrician", rating: "4.9", jobs: "850", distance: "2.5 miles" },
                                { name: "Green Leaf Landscaping", profession: "Garden & Lawn Design", rating: "4.8", jobs: "620", distance: "3.1 miles" },
                                { name: "Swift Clean Professionals", profession: "Deep Cleaning Expert", rating: "4.9", jobs: "920", distance: "0.8 miles" },
                                { name: "Arctic Breeze HVAC", profession: "Heating & Cooling Systems", rating: "4.7", jobs: "410", distance: "4.5 miles" },
                                { name: "Modern Home Handyman", profession: "General Repairs & Assembly", rating: "5.0", jobs: "310", distance: "2.2 miles" },
                            ].map((provider, index) => (
                                <ProviderCard
                                    key={index}
                                    name={provider.name}
                                    profession={provider.profession}
                                    rating={provider.rating}
                                    jobsCompleted={provider.jobs}
                                    distance={provider.distance}
                                    buttonText="Request Service"
                                />
                            ))}
                        </div>

                        {/* Pagination / Load More */}
                        <div className="mt-12 text-center pb-12">
                            <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg">
                                Load More Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindServices;

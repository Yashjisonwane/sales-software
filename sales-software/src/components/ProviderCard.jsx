import React from 'react';
import { Star, MapPin, CheckCircle, MessageSquare } from 'lucide-react';

const ProviderCard = ({ provider, onViewProfile, onMessage }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                        {provider.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                            {provider.name}
                            {provider.rating >= 4.5 && (
                                <CheckCircle className="inline-block ml-2 h-4 w-4 text-blue-500" />
                            )}
                        </h3>
                        <p className="text-sm font-medium text-blue-600 capitalize mb-1">
                            {provider.category} Professional
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-1 text-sm font-medium text-gray-700">{provider.rating}</span>
                                <span className="ml-1 text-xs text-gray-500">({provider.reviews})</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-600">{provider.completedJobs} jobs</span>
                        </div>

                        <div className="mt-3 flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400 shrink-0" />
                            <span className="truncate">{provider.location}</span>
                        </div>

                        <div className="mt-2 text-sm font-medium text-gray-900">
                            {provider.hourlyRate}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 p-4 bg-gray-50 flex gap-3">
                <button
                    onClick={() => onViewProfile && onViewProfile(provider)}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium py-2 px-4 rounded-md transition-colors text-sm text-center"
                >
                    View Profile
                </button>
                <button
                    onClick={() => onMessage && onMessage(provider)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <MessageSquare className="h-4 w-4" />
                    Message
                </button>
            </div>
        </div>
    );
};

export default ProviderCard;

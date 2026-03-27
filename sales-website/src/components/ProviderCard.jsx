import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const ProviderCard = ({ name, avatar, profession, rating, jobsCompleted, distance, buttonText }) => {
    return (
        <div className="bg-white rounded-3xl p-8 card-shadow hover-lift border border-gray-100 text-center flex flex-col items-center">
            <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto overflow-hidden">
                    {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 font-bold text-2xl">
                            {name ? name.charAt(0) : "P"}
                        </div>
                    )}
                </div>
                <CheckCircle className="w-6 h-6 text-[#7C3AED] fill-white absolute bottom-0 right-0" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">{name || "Jane Doe"}</h3>
            <p className="text-sm text-blue-600 font-medium mb-3">{profession || "Master Plumber"}</p>
            <div className="flex justify-center items-center space-x-3 text-sm text-gray-600 mb-4 flex-wrap gap-y-2">
                <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{rating || "4.9"}</span>
                </div>
                <div className="border-l border-gray-300 h-4 hidden sm:block"></div>
                <div>{jobsCompleted || "342"} jobs</div>
                {distance && (
                    <>
                        <div className="border-l border-gray-300 h-4 hidden sm:block"></div>
                        <div className="text-blue-600 font-semibold">{distance}</div>
                    </>
                )}
            </div>
            <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest btn-transition shadow-lg shadow-blue-600/20">
                {buttonText || "View Profile"}
            </button>
        </div>
    );
};

export default ProviderCard;

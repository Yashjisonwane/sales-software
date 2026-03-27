import React from 'react';
import { Star } from 'lucide-react';

const ServiceCard = ({ title, category, price, rating, reviews, image }) => {
    return (
        <div className="bg-white rounded-2xl card-shadow hover-lift overflow-hidden border border-gray-100 cursor-pointer group">
            <div className="h-48 bg-gray-200 relative overflow-hidden">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">Image Placeholder</div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-700 shadow-sm border border-white/50">
                    {category || "Home Service"}
                </div>
            </div>
            <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors leading-tight">{title || "House Cleaning"}</h3>
                <div className="flex items-center space-x-1 mb-4">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm text-gray-900">{rating || "4.8"}</span>
                    <span className="text-gray-400 text-xs font-semibold">({reviews || "124"} reviews)</span>
                </div>
                <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Starting at</span>
                    <span className="font-black text-xl text-blue-600">${price || "50"}</span>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;

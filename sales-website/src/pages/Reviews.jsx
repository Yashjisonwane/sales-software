import React from 'react';
import { Star } from 'lucide-react';
import ReviewsSection from '../components/ReviewsSection';

const Reviews = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Page Header */}
            <div className="bg-blue-600 py-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Customer Success Stories</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        See what your neighbors are saying about the professionals they hired through ServiceHub.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Global Rating Summary */}
                <div className="bg-white rounded-3xl p-10 flex flex-col md:flex-row items-center justify-center gap-16 mb-20 card-shadow border border-gray-100 animate-slide-up">
                    <div className="text-center">
                        <div className="text-7xl font-black text-gray-900 mb-4 tracking-tighter">4.8</div>
                        <div className="flex justify-center mb-4 gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-6 h-6 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400 text-yellow-400 opacity-30"}`} />
                            ))}
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Based on 1.2M+ reviews</p>
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                        {[5, 4, 3, 2, 1].map((rating, idx) => {
                            const percentage = rating === 5 ? '75%' : rating === 4 ? '15%' : rating === 3 ? '5%' : rating === 2 ? '3%' : '2%';
                            return (
                                <div key={rating} className="flex items-center text-sm font-bold text-gray-500">
                                    <span className="w-4">{rating}</span>
                                    <Star className="w-3.5 h-3.5 text-yellow-400 mx-3" />
                                    <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                        <div
                                            className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out animate-slide-up"
                                            style={{ width: percentage, animationDelay: `${idx * 100}ms` }}
                                        ></div>
                                    </div>
                                    <span className="ml-5 text-gray-400 text-xs font-black w-8">{percentage}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <ReviewsSection />

                <div className="mt-12 text-center pb-16">
                    <button className="px-10 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-gray-900/20">
                        Load More Success Stories
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reviews;

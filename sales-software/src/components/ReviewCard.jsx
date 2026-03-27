import React from 'react';
import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => {
    return (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-medium">
                        {review.customerName.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">{review.customerName}</h4>
                        <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < Math.floor(review.rating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                            <span className="text-xs text-gray-500 ml-2">
                                {new Date(review.date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">{review.comment}</p>
        </div>
    );
};

export default ReviewCard;

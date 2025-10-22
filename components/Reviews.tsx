
import React, { useContext } from 'react';
import { Review } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';

interface ReviewsProps {
    reviews: Review[];
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <svg
                    key={index}
                    className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};


const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
    const { t } = useContext(LanguageContext);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('customer_reviews')}</h3>
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                            <div className="flex items-start">
                                <img src={review.avatar} alt={review.userName} className="w-12 h-12 rounded-full me-4" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">{review.userName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(review.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="mt-3 text-gray-700 dark:text-gray-300">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">{t('no_reviews_yet')}</p>
            )}
        </div>
    );
};

export default Reviews;

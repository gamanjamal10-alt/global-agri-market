
import React, { useState, useContext } from 'react';
import { Product } from '../types';
import * as api from '../services/mockApi';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';

interface ReviewsProps {
  product: Product;
}

const StarRating: React.FC<{ rating: number; setRating?: (rating: number) => void }> = ({ rating, setRating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => setRating && setRating(star)}
          className={`w-6 h-6 fill-current ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} ${setRating ? 'cursor-pointer' : ''}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
};


const Reviews: React.FC<ReviewsProps> = ({ product }) => {
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [reviews, setReviews] = useState(product.reviews || []);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to leave a review.");
      return;
    }
    if (newComment.trim() === '') {
        alert("Please enter a comment.");
        return;
    }
    const newReview = await api.addReview(product.id, user.name, newRating, newComment);
    setReviews([newReview, ...reviews]);
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('customer_reviews')}</h2>
      
      {user && user.role === 'Retailer' && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">{t('leave_a_review')}</h3>
            <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('rating')}</label>
                    <StarRating rating={newRating} setRating={setNewRating} />
                </div>
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('your_comment')}</label>
                    <textarea 
                        id="comment"
                        rows={4}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                </div>
                <button type="submit" className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-md transition duration-300">
                    {t('submit_review')}
                </button>
            </form>
        </div>
      )}

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-800 dark:text-white">{review.author}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
              </div>
              <StarRating rating={review.rating} />
              <p className="text-gray-600 dark:text-gray-300 mt-3">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">{t('no_reviews_yet')}</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;

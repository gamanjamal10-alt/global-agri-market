
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, User } from '../types';
import * as api from '../services/mockApi';
import { AuthContext } from '../contexts/AuthContext';
import Spinner from '../components/ui/Spinner';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [farmer, setFarmer] = useState<User | null>(null);
  const [quantity, setQuantity] = useState(100); // Default to 100kg
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    if (id) {
      api.getProductById(id)
        .then(prod => {
          if (prod) {
            setProduct(prod);
            api.getUserById(prod.farmerId).then(setFarmer);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handlePlaceOrder = async () => {
    if (product && currentUser) {
        setIsOrdering(true);
        try {
            await api.createOrder(product.id, currentUser.id, quantity);
            alert('Order placed successfully!');
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to place order.');
            console.error(error);
        } finally {
            setIsOrdering(false);
        }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-64 w-full object-cover md:h-full md:w-96" src={product.imageUrl} alt={product.name} />
          </div>
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="uppercase tracking-wide text-sm text-primary-500 font-semibold">{product.category}</div>
              <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-black dark:text-white">{product.name}</h1>
              <p className="mt-4 text-gray-600 dark:text-gray-300">{product.description}</p>
            
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Details</h3>
                    <ul className="mt-2 border-t border-b border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                        <li className="py-3 flex justify-between text-sm"><span className="font-medium text-gray-500 dark:text-gray-400">Price</span><span className="text-gray-900 dark:text-white">${product.price.toFixed(2)} / kg</span></li>
                        <li className="py-3 flex justify-between text-sm"><span className="font-medium text-gray-500 dark:text-gray-400">Available Quantity</span><span className="text-gray-900 dark:text-white">{product.quantity} kg</span></li>
                        <li className="py-3 flex justify-between text-sm"><span className="font-medium text-gray-500 dark:text-gray-400">Location</span><span className="text-gray-900 dark:text-white">{product.location}</span></li>
                    </ul>
                </div>
                 {farmer && (
                    <div className="mt-6 flex items-center">
                        <img className="h-12 w-12 rounded-full object-cover" src={farmer.avatar} alt={farmer.name} />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sold by</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{farmer.name}</p>
                        </div>
                    </div>
                 )}
            </div>
            
            {currentUser?.role === 'retailer' && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Place an Order</h3>
                <div className="mt-4 flex items-center gap-4">
                    <input 
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        min="1"
                        max={product.quantity}
                        className="w-32 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <span className="text-gray-600 dark:text-gray-300">kg</span>
                    <button 
                        onClick={handlePlaceOrder}
                        disabled={isOrdering}
                        className="flex-1 px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                        {isOrdering ? <Spinner /> : `Buy Now ($${(product.price * quantity).toFixed(2)})`}
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

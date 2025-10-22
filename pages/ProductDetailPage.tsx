
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, User } from '../types';
import * as api from '../services/mockApi';
import Spinner from '../components/ui/Spinner';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import Reviews from '../components/Reviews';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [farmer, setFarmer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setLoading(true);
      const productData = await api.getProductById(id);
      if (productData) {
        setProduct(productData);
        const farmerData = await api.getUserById(productData.farmerId);
        setFarmer(farmerData || null);
      }
      setLoading(false);
    };
    fetchProductDetails();
  }, [id]);

  const handleOrder = async () => {
    if (!user || user.role !== 'Retailer' || !product) {
      alert(t('alert_login_as_retailer'));
      navigate('/login');
      return;
    }
    setIsOrdering(true);
    await api.placeOrder({
      productId: product.id,
      productName: product.name,
      quantity,
      totalPrice: quantity * product.price,
      retailerId: user.id,
      farmerId: product.farmerId,
    });
    setIsOrdering(false);
    alert(t('order_placed_successfully'));
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  if (!product) {
    return <p className="text-center text-red-500 mt-10">Product not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{product.name}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">{t(product.category.toLowerCase())}</p>
            
            {farmer && (
              <div className="flex items-center mb-6">
                <img src={farmer.avatar} alt={farmer.name} className="w-10 h-10 rounded-full me-3"/>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{t('sold_by')} {farmer.name}</span>
              </div>
            )}

            <p className="text-gray-700 dark:text-gray-300 mb-6">{product.description}</p>
            
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">${product.price.toFixed(2)}</span>
              <span className="text-gray-600 dark:text-gray-400 ms-2">/{t('kg')}</span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">{product.quantity} {t('kg')} {t('available')}</p>

            {user?.role === 'Retailer' && (
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-24 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={handleOrder}
                  disabled={isOrdering}
                  className="flex-1 py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOrdering ? <Spinner /> : t('place_order')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Reviews product={product} />
    </div>
  );
};

export default ProductDetailPage;

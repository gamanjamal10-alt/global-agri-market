
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, User } from '../types';
import * as api from '../services/mockApi';
import Spinner from '../components/ui/Spinner';
import Reviews from '../components/Reviews';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { t } = useContext(LanguageContext);
    const [product, setProduct] = useState<Product | null>(null);
    const [farmer, setFarmer] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                setLoading(true);
                const productData = await api.getProductById(id);
                if (productData) {
                    setProduct(productData);
                    const farmerData = await api.getUserById(productData.farmerId);
                    setFarmer(farmerData || null);
                }
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handlePurchase = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (product && quantity > 0) {
            // Mock purchase logic
            alert(`${t('you_have_purchased')} ${quantity} kg ${t('of')} ${product.name}.`);
            // In a real app, this would create an order.
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (!product || !farmer) {
        return <p className="text-center text-red-500 mt-10">{t('product_not_found')}</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square" />
                </div>
                <div>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase">{t(product.category.toLowerCase())}</span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white my-3">{product.name}</h1>
                    <div className="flex items-center mb-4">
                        <img src={farmer.avatar} alt={farmer.name} className="w-10 h-10 rounded-full me-3" />
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">{t('sold_by')}</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{farmer.name}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">{product.description}</p>
                    <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">${product.price.toFixed(2)}</span>
                        <span className="ms-2 text-gray-500 dark:text-gray-400">/ {t('kg')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-6">
                        <label htmlFor="quantity" className="font-semibold">{t('quantity')}:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                            min="1"
                            max={product.quantity}
                            className="w-24 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                         <span className="text-gray-500 dark:text-gray-400">{product.quantity} kg {t('available')}</span>
                    </div>

                    <button 
                        onClick={handlePurchase} 
                        className="w-full py-4 px-6 bg-primary-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                        disabled={product.quantity === 0}
                    >
                        {product.quantity > 0 ? t('buy_now') : t('out_of_stock')}
                    </button>
                </div>
            </div>

            <div className="mt-16">
                <Reviews reviews={product.reviews} />
            </div>
        </div>
    );
};

export default ProductDetailPage;

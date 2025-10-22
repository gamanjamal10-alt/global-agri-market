
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import * as api from '../services/mockApi';
import Spinner from '../components/ui/Spinner';
import { LanguageContext } from '../contexts/LanguageContext';

const MarketplacePage: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const allProducts = await api.getAllProducts();
      setProducts(allProducts);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(product =>
        categoryFilter === 'All' || product.category === categoryFilter
      )
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, searchTerm, categoryFilter, sortBy]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">{t('marketplace')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <input
          type="text"
          placeholder={t('search_products')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="md:col-span-2 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          {categories.map(cat => <option key={cat} value={cat}>{t(cat.toLowerCase())}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="name">{t('sort_by_name')}</option>
          <option value="price-asc">{t('sort_by_price_asc')}</option>
          <option value="price-desc">{t('sort_by_price_desc')}</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="group bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t(product.category.toLowerCase())}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-extrabold text-primary-600 dark:text-primary-400">${product.price.toFixed(2)}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{product.quantity} kg {t('available')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;

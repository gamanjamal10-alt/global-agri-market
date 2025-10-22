
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import * as api from '../services/mockApi';
import { Link } from 'react-router-dom';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{product.location}</p>
            <div className="flex justify-between items-center mt-4">
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">${product.price.toFixed(2)}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/kg</span></p>
                <Link to={`/product/${product.id}`} className="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                    View
                </Link>
            </div>
        </div>
    </div>
);


const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');

  useEffect(() => {
    api.getAllProducts().then(setProducts);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === 'All' || p.category === category) &&
    (location === 'All' || p.location === location)
  );
  
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const locations = ['All', ...new Set(products.map(p => p.location))];


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Marketplace</h1>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
         <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
             {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
       {filteredProducts.length === 0 && (
            <div className="text-center col-span-full py-16">
                <h2 className="text-xl text-gray-600 dark:text-gray-400">No products found.</h2>
                <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters.</p>
            </div>
        )}
    </div>
  );
};

export default MarketplacePage;


import React, { useState, useEffect, useContext } from 'react';
import { User, Product, Order, OrderStatus } from '../../types';
import * as api from '../../services/mockApi';
import ProductForm from '../ProductForm';
import Spinner from '../ui/Spinner';
import { LanguageContext } from '../../contexts/LanguageContext';

interface FarmerDashboardProps {
  user: User;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ user }) => {
  const { t } = useContext(LanguageContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [userProducts, userOrders] = await Promise.all([
        api.getAllProducts().then(allProducts => allProducts.filter(p => p.farmerId === user.id)),
        api.getOrdersByUserId(user.id, 'Farmer')
      ]);
      setProducts(userProducts);
      setOrders(userOrders);
      setLoading(false);
    };
    fetchData();
  }, [user.id]);

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'farmerId' | 'reviews'>) => {
    const newProduct = await api.addProduct({ ...productData, farmerId: user.id });
    setProducts(prev => [newProduct, ...prev]);
  };
  
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    const updatedOrder = await api.updateOrderStatus(orderId, status);
    if (updatedOrder) {
      setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? updatedOrder : o));
    }
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div className="space-y-8">
      <ProductForm onAddProduct={handleAddProduct} farmerId={user.id} />
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('your_products')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{product.quantity} kg</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('incoming_orders')}</h3>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">{t('product')}</th>
                <th scope="col" className="px-6 py-3">{t('quantity')}</th>
                <th scope="col" className="px-6 py-3">{t('total_price')}</th>
                <th scope="col" className="px-6 py-3">{t('status')}</th>
                <th scope="col" className="px-6 py-3">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{order.productName}</td>
                  <td className="px-6 py-4">{order.quantity} kg</td>
                  <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {t(order.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'Pending' && (
                       <button onClick={() => handleUpdateStatus(order.id, 'Shipped')} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">{t('mark_shipped')}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

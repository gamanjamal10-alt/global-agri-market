
import React, { useState, useEffect, useContext } from 'react';
import { Order, OrderStatus, Product } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import * as api from '../../services/mockApi';
import { Link } from 'react-router-dom';

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case OrderStatus.ACCEPTED: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case OrderStatus.SHIPPED: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const RetailerDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (user) {
      api.getOrdersByBuyer(user.id).then(async (buyerOrders) => {
        setOrders(buyerOrders);
        const productIds = [...new Set(buyerOrders.map(o => o.productId))];
        const fetchedProducts = await Promise.all(productIds.map(id => api.getProductById(id)));
        setProducts(fetchedProducts.filter(p => p !== undefined) as Product[]);
      });
    }
  }, [user]);

  const totalSpent = orders
    .filter(o => o.status === OrderStatus.DELIVERED)
    .reduce((sum, o) => sum + o.totalPrice, 0);
  
  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Spent</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col justify-center items-center">
          <Link to="/marketplace" className="w-full text-center px-6 py-4 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
            Browse Marketplace
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Purchase History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.slice(0, 10).map(o => (
                <tr key={o.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{getProductName(o.productId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${o.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{o.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;

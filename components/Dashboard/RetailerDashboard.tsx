import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { User, Order, OrderStatus } from '../../types';
import * as api from '../../services/mockApi';
import Spinner from '../ui/Spinner';
import { LanguageContext } from '../../contexts/LanguageContext';

interface RetailerDashboardProps {
  user: User;
}

// Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);


const RetailerDashboard: React.FC<RetailerDashboardProps> = ({ user }) => {
  const { t } = useContext(LanguageContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const userOrders = await api.getOrdersByUserId(user.id, 'Retailer');
      setOrders(userOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [user.id]);

  const stats = useMemo(() => {
    return {
        totalOrders: orders.length,
        pending: orders.filter(o => o.status === 'Pending' || o.status === 'Shipped').length,
        completed: orders.filter(o => o.status === 'Delivered').length
    }
  }, [orders]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title={t('total_orders')} value={stats.totalOrders} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
            <StatCard title={t('pending_shipments')} value={stats.pending} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            <StatCard title={t('completed_deliveries')} value={stats.completed} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('your_orders')}</h3>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">{t('product')}</th>
                <th scope="col" className="px-6 py-3">{t('quantity')}</th>
                <th scope="col" className="px-6 py-3">{t('total_price')}</th>
                <th scope="col" className="px-6 py-3">{t('order_date')}</th>
                <th scope="col" className="px-6 py-3">{t('status')}</th>
                <th scope="col" className="px-6 py-3">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    <Link to={`/product/${order.productId}`} className="hover:underline">{order.productName}</Link>
                  </td>
                  <td className="px-6 py-4">{order.quantity} kg</td>
                  <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {t(order.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'Shipped' || order.status === 'Delivered' ? (
                       <Link to={`/track/${order.id}`} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">{t('track_shipment')}</Link>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">{t('no_action')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg mt-4">
            <p className="text-gray-500 dark:text-gray-400">{t('no_orders_found')}</p>
            <Link to="/marketplace" className="mt-4 inline-block px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
              {t('browse_marketplace')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetailerDashboard;
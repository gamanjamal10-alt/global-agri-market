import React, { useState, useEffect, useMemo, useContext } from 'react';
import { User, Order, OrderStatus } from '../../types';
import * as api from '../../services/mockApi';
import Spinner from '../ui/Spinner';
import { LanguageContext } from '../../contexts/LanguageContext';

interface LogisticsDashboardProps {
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


const LogisticsDashboard: React.FC<LogisticsDashboardProps> = ({ user }) => {
  const { t } = useContext(LanguageContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const userOrders = await api.getOrdersByUserId(user.id, 'Logistics');
      setOrders(userOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [user.id]);

  const stats = useMemo(() => {
    return {
        inTransit: orders.filter(o => o.status === 'Shipped').length,
        completed: orders.filter(o => o.status === 'Delivered').length
    }
  }, [orders]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title={t('shipments_in_transit')} value={stats.inTransit} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12h-6l-2-5H7" /></svg>} />
            <StatCard title={t('completed_deliveries')} value={stats.completed} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('shipments_to_manage')}</h3>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">{t('order_id')}</th>
                <th scope="col" className="px-6 py-3">{t('product')}</th>
                <th scope="col" className="px-6 py-3">{t('destination')}</th>
                <th scope="col" className="px-6 py-3">{t('status')}</th>
                <th scope="col" className="px-6 py-3">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-mono text-gray-700 dark:text-gray-300">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{order.productName}</td>
                  <td className="px-6 py-4">{order.shippingAddress}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {t(order.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'Shipped' && (
                       <button onClick={() => handleUpdateStatus(order.id, 'Delivered')} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">{t('mark_delivered')}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         {orders.length === 0 && (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg mt-4">
            <p className="text-gray-500 dark:text-gray-400">{t('no_active_shipments')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsDashboard;
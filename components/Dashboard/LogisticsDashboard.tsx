import React, { useState, useEffect, useContext } from 'react';
import { User, Order, OrderStatus } from '../../types';
import * as api from '../../services/mockApi';
import Spinner from '../ui/Spinner';
import { LanguageContext } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface LogisticsDashboardProps {
  user: User;
}

const LogisticsDashboard: React.FC<LogisticsDashboardProps> = ({ user }) => {
  const { t } = useContext(LanguageContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userOrders = await api.getOrdersByUserId(user.id, 'Logistics');
      setOrders(userOrders);
      setLoading(false);
    };
    fetchData();
  }, [user.id]);
  
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    const updatedOrder = await api.updateOrderStatus(orderId, status);
    if (updatedOrder) {
      setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? updatedOrder : o));
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('active_shipments')}</h3>
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
                  <td className="px-6 py-4 font-mono text-gray-900 dark:text-white whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4">{order.productName}</td>
                  <td className="px-6 py-4">{order.shippingAddress}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {t(order.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-4">
                    <Link to={`/track/${order.id}`} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">{t('view_details')}</Link>
                    {order.status === 'Shipped' && (
                       <button onClick={() => handleUpdateStatus(order.id, 'Delivered')} className="font-medium text-green-600 dark:text-green-500 hover:underline">{t('mark_delivered')}</button>
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

export default LogisticsDashboard;

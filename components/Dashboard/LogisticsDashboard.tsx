
import React, { useState, useEffect, useContext } from 'react';
import { User, Order, OrderStatus } from '../../types';
import * as api from '../../services/mockApi';
import Spinner from '../ui/Spinner';
import { LanguageContext } from '../../contexts/LanguageContext';

interface LogisticsDashboardProps {
  user: User;
}

const LogisticsDashboard: React.FC<LogisticsDashboardProps> = ({ user }) => {
  const { t } = useContext(LanguageContext);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      // In a real app, this would be a more complex query for orders needing shipping.
      const allOrders = await api.getOrdersByUserId(user.id, 'Logistics');
      setAvailableOrders(allOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [user.id]);

  const handleAcceptShipment = (orderId: string) => {
    // In a real app, this would create a shipping record and assign it to the logistics company
    console.log(`Accepted shipment for order: ${orderId}`);
    alert(`${t('shipment_for_order')} ${orderId} ${t('accepted')}`);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('available_shipments')}</h3>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">{t('order_id')}</th>
                <th scope="col" className="px-6 py-3">{t('product')}</th>
                <th scope="col" className="px-6 py-3">{t('quantity')}</th>
                <th scope="col" className="px-6 py-3">{t('status')}</th>
                <th scope="col" className="px-6 py-3">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {availableOrders.map(order => (
                <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{order.productName}</td>
                  <td className="px-6 py-4">{order.quantity} kg</td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {t(order.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'Pending' && (
                        <button onClick={() => handleAcceptShipment(order.id)} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">{t('accept_shipment')}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Additional logistics components like profit dashboards, route management, etc. */}
    </div>
  );
};

export default LogisticsDashboard;

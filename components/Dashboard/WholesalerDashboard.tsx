
import React, { useState, useEffect, useContext } from 'react';
import { User, Order, OrderStatus } from '../../types';
import * as api from '../../services/mockApi';
import Spinner from '../ui/Spinner';
import { LanguageContext } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface WholesalerDashboardProps {
  user: User;
}

const WholesalerDashboard: React.FC<WholesalerDashboardProps> = ({ user }) => {
    const { t } = useContext(LanguageContext);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const userOrders = await api.getOrdersByUserId(user.id, 'Wholesaler');
            setOrders(userOrders);
            setLoading(false);
        };
        fetchOrders();
    }, [user.id]);

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
             <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('your_orders')}</h3>
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">{t('product')}</th>
                        <th scope="col" className="px-6 py-3">{t('quantity')}</th>
                        <th scope="col" className="px-6 py-3">{t('total_price')}</th>
                        <th scope="col" className="px-6 py-3">{t('status')}</th>
                        <th scope="col" className="px-6 py-3">{t('order_date')}</th>
                        <th scope="col" className="px-6 py-3">{t('action')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap flex items-center">
                            <img src={order.productImageUrl} alt={order.productName} className="w-10 h-10 rounded-md me-3" />
                            {order.productName}
                        </td>
                        <td className="px-6 py-4">{order.quantity} kg</td>
                        <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {t(order.status.toLowerCase())}
                            </span>
                        </td>
                        <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                            {order.status === 'Shipped' && (
                            <Link to={`/track/${order.id}`} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">{t('track_shipment')}</Link>
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

export default WholesalerDashboard;

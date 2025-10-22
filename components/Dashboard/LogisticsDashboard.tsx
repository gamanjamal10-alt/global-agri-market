
import React, { useState, useEffect, useContext } from 'react';
import { Shipment, Order, OrderStatus } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import * as api from '../../services/mockApi';

const getShipmentStatusColor = (status: Shipment['status']) => {
  switch (status) {
    case 'Awaiting Pickup': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'In Transit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const LogisticsDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);

  const fetchDashboardData = () => {
      if (user) {
        api.getShipmentsByLogistics(user.id).then(setShipments);
        api.getOrdersByStatus(OrderStatus.ACCEPTED).then(setAvailableOrders);
      }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleAcceptShipment = async (orderId: string) => {
    if(user) {
        await api.createShipment(orderId, user.id);
        fetchDashboardData(); // Refresh data
    }
  };
  
  const totalEarnings = shipments
    .filter(s => s.status === 'Delivered')
    .length * 150; // Mock earning per delivery

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Earnings</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Active Shipments</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{shipments.filter(s => s.status === 'In Transit').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Completed Deliveries</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{shipments.filter(s => s.status === 'Delivered').length}</p>
        </div>
      </div>

      {/* My Shipments */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Current Shipments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Est. Delivery</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {shipments.map(s => (
                <tr key={s.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{s.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getShipmentStatusColor(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{s.estimatedDelivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Available for Pickup */}
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available for Pickup</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity (kg)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {availableOrders.map(o => (
                <tr key={o.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{o.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{o.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleAcceptShipment(o.id)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">
                        Accept
                    </button>
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

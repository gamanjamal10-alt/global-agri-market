
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types';
import FarmerDashboard from '../components/Dashboard/FarmerDashboard';
import RetailerDashboard from '../components/Dashboard/RetailerDashboard';
import LogisticsDashboard from '../components/Dashboard/LogisticsDashboard';
import { Navigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-600"></div></div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.FARMER:
        return <FarmerDashboard />;
      case UserRole.RETAILER:
        return <RetailerDashboard />;
      case UserRole.LOGISTICS:
        return <LogisticsDashboard />;
      default:
        return <p>Invalid user role.</p>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.name}!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Here's your overview for today.</p>
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;

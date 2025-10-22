
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import FarmerDashboard from '../components/Dashboard/FarmerDashboard';
import WholesalerDashboard from '../components/Dashboard/WholesalerDashboard';
import RetailerDashboard from '../components/Dashboard/RetailerDashboard';
import LogisticsDashboard from '../components/Dashboard/LogisticsDashboard';
import Spinner from '../components/ui/Spinner';

const DashboardPage: React.FC = () => {
  const { user, loading } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }
  
  if (!user) {
    // This should ideally not be reached due to ProtectedRoute, but as a fallback.
    return <p>Please log in to see your dashboard.</p>;
  }

  const renderDashboard = () => {
    switch(user.role) {
      case 'Farmer':
        return <FarmerDashboard user={user} />;
      case 'Wholesaler':
        return <WholesalerDashboard user={user} />;
      case 'Retailer':
        return <RetailerDashboard user={user} />;
      case 'Logistics':
        return <LogisticsDashboard user={user} />;
      default:
        return <p>No dashboard available for your role.</p>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{t('dashboard')}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{t('welcome_back')}, {user.name}!</p>
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;

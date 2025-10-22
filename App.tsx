
import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ChatPage from './pages/ChatPage';
import TrackingPage from './pages/TrackingPage';
import { AuthContext } from './contexts/AuthContext';
import Spinner from './components/ui/Spinner';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }
  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};


const AppLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/messages" element={<ChatPage />} />
          <Route path="/track/:orderId" element={<TrackingPage />} />
        </Route>
      </Route>
      
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;

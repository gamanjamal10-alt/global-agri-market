
import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';

const AppContent: React.FC = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {!isLoginPage && <Header />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
                    <Route path="/marketplace" element={user ? <MarketplacePage /> : <Navigate to="/login" />} />
                    <Route path="/product/:id" element={user ? <ProductDetailPage /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                </Routes>
            </main>
        </div>
    );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

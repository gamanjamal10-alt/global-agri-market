
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const { login } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{t('welcome_to_gam')}</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('login_as')}</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('Farmer')}
            className="w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-primary-600 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
          >
            <span className="me-3">👩‍🌾</span> {t('farmer')}
          </button>
          <button
            onClick={() => handleLogin('Retailer')}
            className="w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
          >
            <span className="me-3">🛒</span> {t('retailer')}
          </button>
          <button
            onClick={() => handleLogin('Logistics')}
            className="w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
          >
            <span className="me-3">🚚</span> {t('logistics')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

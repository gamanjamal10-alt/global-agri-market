
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { UserRole } from '../types';

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
            <span className="text-5xl">🌍</span>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">{t('login_to_account')}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('select_role_to_continue')}</p>
        </div>
        
        <div className="space-y-4">
            <button onClick={() => handleLogin('Farmer')} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800">
              {t('login_as_farmer')}
            </button>
            <button onClick={() => handleLogin('Wholesaler')} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
              {t('login_as_wholesaler')}
            </button>
            <button onClick={() => handleLogin('Retailer')} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800">
              {t('login_as_retailer')}
            </button>
            <button onClick={() => handleLogin('Logistics')} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-800">
              {t('login_as_logistics')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

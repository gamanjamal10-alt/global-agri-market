
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.RETAILER);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };
  
  const getUserIdForRole = (role: UserRole) => {
    switch(role) {
        case UserRole.FARMER: return 'user-1';
        case UserRole.RETAILER: return 'user-2';
        case UserRole.LOGISTICS: return 'user-3';
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
            Welcome to Global Agri Market
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
            Select your role to continue
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="role" className="sr-only">Role</label>
              <select
                id="role"
                name="role"
                required
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="relative block w-full px-3 py-3 text-lg text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={UserRole.RETAILER}>Wholesaler / Retailer</option>
                <option value={UserRole.FARMER}>Farmer</option>
                <option value={UserRole.LOGISTICS}>Logistics Company</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-3 text-lg font-medium text-white bg-primary-600 border border-transparent rounded-md group hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

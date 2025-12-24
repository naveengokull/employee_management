import React from 'react';
// Fix: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UsersIcon, ClipboardDocumentListIcon as ClipboardListIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = ReactRouterDOM.useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = "flex items-center px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors duration-200";
  const activeLinkClasses = "text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700/50";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ReactRouterDOM.NavLink to="/" className="flex items-center space-x-2">
                <ClipboardListIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Task Manager
                </h1>
            </ReactRouterDOM.NavLink>
          </div>
          <div className="flex items-center space-x-2">
             <ReactRouterDOM.NavLink to="/employees" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
               <UsersIcon className="h-5 w-5 mr-2" /> 
               <span className="font-medium">Employees</span>
            </ReactRouterDOM.NavLink>
             <ReactRouterDOM.NavLink to="/tasks" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
               <ClipboardListIcon className="h-5 w-5 mr-2" /> 
               <span className="font-medium">Tasks</span>
            </ReactRouterDOM.NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors duration-200"
              aria-label="Logout"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
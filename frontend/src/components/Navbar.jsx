import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <LayoutDashboard className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">ISSB Assessment</span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link to="/results" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                <FileText className="h-5 w-5" />
                <span>Results</span>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <Settings className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}
              <div className="flex items-center space-x-2 border-l pl-4">
                <span className="text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

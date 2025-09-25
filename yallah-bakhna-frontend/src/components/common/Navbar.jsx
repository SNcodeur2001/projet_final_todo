import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Yallah Bakhna</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-600">Connecté</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-200 border border-gray-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
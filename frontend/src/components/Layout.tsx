import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-black/30 backdrop-blur-sm border-r border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-8">🚀 AstraOps</h1>
          <nav className="space-y-4">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              🏠 Home
            </Link>
            <Link
              to="/operations"
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/operations') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              🛸 Space Operations
            </Link>
            <Link
              to="/assistant"
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/assistant') 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              🤖 Astra AI
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="container mx-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 
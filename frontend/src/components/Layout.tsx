import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BackButton } from './Navigation/BackButton';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const showAISidebar = pathname !== '/';

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="cosmic-bg fixed inset-0 h-full w-screen overflow-x-hidden">
      {/* AI Sidebar */}
      {showAISidebar && (
        <div className={`fixed right-0 top-0 h-full w-80 bg-space-black/95 backdrop-blur-lg transform transition-transform 
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl p-6`}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-purple-400">🚀</span>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Astra AI
            </span>
          </h2>
          <div className="h-[calc(100vh-120px)]">
            {/* Chat Interface */}
            <div className="h-full flex flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto">
                {/* Chat messages here */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        <BackButton />
        {children}
      </main>
    </div>
  );
};

export default Layout; 
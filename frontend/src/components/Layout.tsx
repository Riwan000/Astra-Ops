import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiMessageSquare, FiSend } from 'react-icons/fi';
import { BackButton } from './Navigation/BackButton';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const showAISidebar = pathname !== '/';

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="cosmic-bg min-h-screen h-screen w-screen fixed top-0 left-0">
      {/* Floating Chat Trigger */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="fixed right-4 bottom-4 z-50 p-4 bg-purple-600 rounded-full shadow-xl hover:bg-purple-700 transition-all"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </button>

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
              <div className="pt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask about space operations..."
                    className="w-full p-3 rounded-lg bg-space-dark border border-space-gray focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                  <button className="absolute right-3 top-3 text-purple-400 hover:text-purple-300">
                    <FiSend size={20} />
                  </button>
                </div>
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
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
    <div className="cosmic-bg min-h-screen w-full relative">
      {/* Main Content */}
      <main className="relative z-10 min-h-[calc(100vh-4rem)]">
        <BackButton />
        {children}
      </main>
    </div>
  );
};

export default Layout; 
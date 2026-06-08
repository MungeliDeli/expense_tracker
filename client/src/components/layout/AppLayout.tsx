import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatedBackground } from '../AnimatedBackground';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ToastContainer';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col lg:pl-[260px]">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </main>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

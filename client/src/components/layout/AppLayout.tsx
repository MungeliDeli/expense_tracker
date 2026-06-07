import { Outlet } from 'react-router-dom';
import { AnimatedBackground } from '../AnimatedBackground';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { ToastContainer } from '../ToastContainer';

export const AppLayout = () => (
  <div className="relative min-h-screen">
    <AnimatedBackground />
    <div className="relative z-10">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Navigation />
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  </div>
);

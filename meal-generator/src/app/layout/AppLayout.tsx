import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="pb-20 md:pb-8">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}

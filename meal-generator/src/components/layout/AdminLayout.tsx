import { Outlet, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <nav className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to App</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-dark-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

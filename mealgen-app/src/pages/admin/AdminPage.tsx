import { Shield } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <Shield className="w-8 h-8 text-teal-600 dark:text-teal-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Admin features coming soon...
        </p>
      </div>
    </div>
  );
}

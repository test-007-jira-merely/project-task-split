import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage meals and dataset
        </p>
      </div>
      {children}
    </div>
  );
}

import { ReactNode } from 'react';
import { ShieldCheck, Package, Users } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  stats?: {
    totalMeals: number;
    totalUsers: number;
  };
}

export function AdminLayout({ children, stats }: AdminLayoutProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage meals and monitor platform
            </p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-glass dark:shadow-glass-dark p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Meals</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.totalMeals}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-glass dark:shadow-glass-dark p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}

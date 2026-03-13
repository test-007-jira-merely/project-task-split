import { ReactNode } from 'react';
import { Shield, Database, PlusCircle } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: 'meals' | 'import' | 'create';
  onTabChange: (tab: 'meals' | 'import' | 'create') => void;
}

export const AdminLayout = ({ children, activeTab, onTabChange }: AdminLayoutProps) => {
  const tabs = [
    { id: 'meals' as const, label: 'Manage Meals', icon: Database },
    { id: 'import' as const, label: 'Import Data', icon: PlusCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage meals and content
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 font-medium
              border-b-2 transition-colors
              ${activeTab === tab.id
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {children}
    </div>
  );
};

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Utensils, Upload, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/meals', label: 'Meals', icon: Utensils },
    { path: '/admin/import', label: 'Import', icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen p-6">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to App</span>
          </Link>

          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative block"
                >
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-muted-foreground hover:bg-accent'}`}>
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="admin-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

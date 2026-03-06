import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { useTheme } from '@/hooks/useTheme';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar onToggleTheme={toggleTheme} theme={theme} />
      <main className="container mx-auto px-4 pb-8">
        {children}
      </main>
    </div>
  );
}

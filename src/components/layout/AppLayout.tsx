import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main content with proper spacing for fixed navbar */}
      <main className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-8">
        {children}
      </main>

      {/* Additional spacing for mobile bottom nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

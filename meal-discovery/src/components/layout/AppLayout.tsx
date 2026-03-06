import { AppLayoutProps } from '@/types/components';
import { Navbar } from './Navbar';

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
};

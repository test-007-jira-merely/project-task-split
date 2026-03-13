import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, History } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ElementType } from 'react';

export function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30">
      <div className="flex items-center justify-around h-16">
        <MobileNavLink to="/" icon={Home} label="Home" active={isActive('/')} />
        <MobileNavLink to="/ingredients" icon={Search} label="Search" active={isActive('/ingredients')} />
        {user && (
          <>
            <MobileNavLink to="/favorites" icon={Heart} label="Favorites" active={isActive('/favorites')} />
            <MobileNavLink to="/history" icon={History} label="History" active={isActive('/history')} />
          </>
        )}
      </div>
    </nav>
  );
}

interface MobileNavLinkProps {
  to: string;
  icon: ElementType;
  label: string;
  active: boolean;
}

function MobileNavLink({ to, icon: Icon, label, active }: MobileNavLinkProps) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
        active
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-600 dark:text-gray-400'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}

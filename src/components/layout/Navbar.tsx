import { Home, Leaf, Heart, History } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

const navigationLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/ingredients', label: 'Ingredients', icon: Leaf },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/history', label: 'History', icon: History },
];

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 hidden md:block">
        <div className="backdrop-blur-md bg-background/80 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">RecipeApp</span>
                </Link>
              </div>

              {/* Desktop Nav Links */}
              <div className="flex items-center gap-1">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground/70 hover:bg-accent/50 hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="backdrop-blur-md bg-background/80 border-t border-border">
          <div className="flex items-center justify-around h-16 px-2">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 flex-1 transition-colors ${
                    active
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar with Theme and User */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden">
        <div className="backdrop-blur-md bg-background/80 border-b border-border">
          <div className="flex h-14 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">RecipeApp</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

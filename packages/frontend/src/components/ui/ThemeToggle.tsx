import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';
import { Button } from './Button';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const Icon = theme === 'light' ? FiSun : theme === 'dark' ? FiMoon : FiMonitor;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
      className="relative"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
    </Button>
  );
}

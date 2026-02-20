'use client';

import { useCallback, useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Theme switcher button.
 * Toggles between light and dark mode using next-themes.
 * @returns {JSX.Element} Theme switcher button.
 */
const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const themeLabel = mounted
    ? `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`
    : 'Toggle theme';

  /**
   * Toggles between light and dark theme.
   * @returns {void}
   */
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);


  /**
   * Sets mounted state to true after initial render
   * to prevent hydration mismatch.
   * @returns {void}
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={themeLabel}
      title={themeLabel}
    >
      {mounted ? (
        resolvedTheme === 'dark' ? <Sun /> : <Moon />
      ) : (
        <Skeleton className="h-4 w-4 rounded-full" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;

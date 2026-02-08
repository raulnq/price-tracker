import { useEffect } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    function applyTheme(themeToApply: typeof theme) {
      // Remove existing theme classes
      root.classList.remove('light', 'dark');

      if (themeToApply === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(themeToApply);
      }
    }

    // Apply theme immediately
    applyTheme(theme);

    // Listen for system theme changes when using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return <>{children}</>;
}

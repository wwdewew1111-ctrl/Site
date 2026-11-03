import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/themeStore';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Moon : Sun;
  const label = isDark ? 'Тёмная' : 'Светлая';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
      title={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
      className="group flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs font-semibold uppercase tracking-wider text-text transition duration-200 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span key={theme} className="grid h-6 w-6 place-items-center rounded-full bg-accent text-white animate-fade-in">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

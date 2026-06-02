import { useEffect } from 'react';
import { useDumpStore } from '@/store/dump-store';

export function useApplyTheme(): void {
  const theme = useDumpStore((state) => state.settings.theme);
  const accent = useDumpStore((state) => state.settings.accent);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.setProperty('--accent', accent);
  }, [theme, accent]);
}

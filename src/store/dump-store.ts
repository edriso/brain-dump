import { create } from 'zustand';
import { repository } from '@/lib/repository';
import type { Accent, Settings, Theme } from '@/types/domain';

interface DumpState {
  settings: Settings;
  setWriteSecs: (n: number) => void;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
}

const initial = repository.getState();

export const useDumpStore = create<DumpState>((set) => ({
  settings: initial.settings,
  setWriteSecs: (writeSecs) => set({ settings: repository.setSettings({ writeSecs }).settings }),
  setTheme: (theme) => set({ settings: repository.setSettings({ theme }).settings }),
  setAccent: (accent) => set({ settings: repository.setSettings({ accent }).settings }),
}));

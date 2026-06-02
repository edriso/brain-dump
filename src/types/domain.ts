import { z } from 'zod';

export const THEMES = ['ink', 'paper'] as const;
export const themeSchema = z.enum(THEMES);
export type Theme = z.infer<typeof themeSchema>;

export const ACCENTS = ['#c08a5a', '#5fa3c0', '#9a8fb0', '#7fa090'] as const;
export const accentSchema = z.enum(ACCENTS);
export type Accent = z.infer<typeof accentSchema>;

export const settingsSchema = z.object({
  writeSecs: z.number().int().min(60).max(300),
  theme: themeSchema,
  accent: accentSchema,
});
export type Settings = z.infer<typeof settingsSchema>;

export const persistedStateSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
});
export type PersistedState = z.infer<typeof persistedStateSchema>;

export type Bucket = 'today' | 'later' | 'let';
export interface Line {
  txt: string;
  bucket: Bucket | null;
  done: boolean;
}
export type Phase = 'intro' | 'write' | 'sort' | 'done';

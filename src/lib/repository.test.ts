import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorageRepository, type Repository } from './repository';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => {
      map.delete(k);
    },
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  } as Storage;
}

describe('repository', () => {
  let repo: Repository;
  let storage: Storage;
  beforeEach(() => {
    storage = memoryStorage();
    repo = createLocalStorageRepository(storage);
  });
  it('returns defaults / tolerates corrupt data', () => {
    expect(repo.getState().settings.writeSecs).toBe(120);
    storage.setItem('braindump-v1', 'nope');
    expect(repo.getState().settings.theme).toBe('ink');
  });
  it('round-trips settings', () => {
    repo.setSettings({ writeSecs: 180, theme: 'paper' });
    expect(repo.getState().settings.writeSecs).toBe(180);
    expect(repo.getState().settings.theme).toBe('paper');
  });
});

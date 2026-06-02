import { describe, expect, it } from 'vitest';
import { inBucket, splitLines } from './lines';
import type { Line } from '@/types/domain';

describe('splitLines', () => {
  it('makes one line per non-empty, trimmed entry and ignores blanks', () => {
    const out = splitLines('  call mom \n\n\n  email boss\n   \nbreathe ');
    expect(out.map((l) => l.txt)).toEqual(['call mom', 'email boss', 'breathe']);
    expect(out.every((l) => l.bucket === null && l.done === false)).toBe(true);
  });
  it('returns an empty array for empty input', () => {
    expect(splitLines('\n  \n')).toEqual([]);
  });
});

describe('inBucket', () => {
  it('groups by the assigned bucket in order', () => {
    const lines: Line[] = [
      { txt: 'a', bucket: 'today', done: false },
      { txt: 'b', bucket: 'let', done: false },
      { txt: 'c', bucket: 'today', done: false },
    ];
    expect(inBucket(lines, 'today').map((l) => l.txt)).toEqual(['a', 'c']);
    expect(inBucket(lines, 'later')).toEqual([]);
  });
});

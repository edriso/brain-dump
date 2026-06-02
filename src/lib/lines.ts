import type { Bucket, Line } from '@/types/domain';

/** Split freewriting into one Line per non-empty, trimmed line. Pure. */
export function splitLines(text: string): Line[] {
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((txt) => ({ txt, bucket: null, done: false }));
}

/** All lines assigned to a bucket, in order. */
export function inBucket(lines: Line[], bucket: Bucket): Line[] {
  return lines.filter((line) => line.bucket === bucket);
}

export const BUCKETS: Record<Bucket, { label: string; color: string }> = {
  today: { label: 'Today', color: 'var(--today)' },
  later: { label: 'Not today', color: 'var(--later)' },
  let: { label: 'Let go', color: 'var(--let)' },
};

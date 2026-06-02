# Brain Dump

A **frontend-only** way to empty a too-full head in two minutes, then sort it so
it stops spinning. Freewrite fast with no editing, then put each line into
**Today**, **Not today**, or **Let go**. The Today items are check-off-able. No
backend, works offline. (The dump itself is intentionally not saved — it's a
release, not a record. Only your settings persist.)

## The flow

`intro → write → sort → done`

Start the dump → a timed freewrite (default 120s, "I'm empty" to end early) →
each non-empty line is sorted one at a time → grouped results.

## Tech

React 19 + TypeScript (strict), Vite, Tailwind v4, Zustand, Zod-validated
localStorage (settings only), PWA. Tested with Vitest + Testing Library and
Playwright.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

## Notes

- The line split and bucket grouping are pure (`lib/lines.ts`) and unit-tested.
- Entrances animate transform only and keep `opacity: 1`. Two themes (ink +
  paper); reduced motion honored.

## License

MIT.

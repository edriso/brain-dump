import { useEffect, useRef, useState } from 'react';
import { SettingsOverlay } from '@/components/settings-overlay';
import { useApplyTheme } from '@/hooks/use-apply-theme';
import { BUCKETS, inBucket, splitLines } from '@/lib/lines';
import { useDumpStore } from '@/store/dump-store';
import type { Bucket, Line, Phase } from '@/types/domain';

export function App() {
  useApplyTheme();
  const { writeSecs, theme } = useDumpStore((state) => state.settings);
  const setTheme = useDumpStore((state) => state.setTheme);

  const [phase, setPhase] = useState<Phase>('intro');
  const [text, setText] = useState('');
  const [left, setLeft] = useState(writeSecs);
  const [lines, setLines] = useState<Line[]>([]);
  const [si, setSi] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // The writing countdown auto-advances to the sort step.
  useEffect(() => {
    if (phase !== 'write') {
      return;
    }
    setLeft(writeSecs);
    let secondsLeft = writeSecs;
    const id = setInterval(() => {
      secondsLeft -= 1;
      setLeft(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(id);
        toSort();
      }
    }, 1000);
    taRef.current?.focus();
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function toSort() {
    // Read the live textarea value so the auto-timer path uses the latest text
    // (the interval callback's closure would otherwise see stale state).
    const parsed = splitLines(taRef.current?.value ?? text);
    setLines(parsed);
    setSi(0);
    setPhase(parsed.length > 0 ? 'sort' : 'done');
  }

  function assign(bucket: Bucket) {
    setLines((ls) => ls.map((l, i) => (i === si ? { ...l, bucket } : l)));
    if (si + 1 < lines.length) {
      setSi(si + 1);
    } else {
      setPhase('done');
    }
  }

  const mm = Math.floor(left / 60);
  const ss = left % 60;

  return (
    <div className="app">
      <div className="col">
        <button
          className="corner corner-l"
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          ⚙
        </button>
        <button
          className="corner"
          type="button"
          onClick={() => setTheme(theme === 'ink' ? 'paper' : 'ink')}
          aria-label="Theme"
        >
          {theme === 'ink' ? '☀' : '☾'}
        </button>
        <div className="word">Brain Dump</div>

        {phase === 'intro' && (
          <div
            className="rise"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '6vh',
            }}
          >
            <h1 className="h1">Too much in your head?</h1>
            <p className="sub">
              Two minutes. Empty all of it onto the page, fast, no editing. Then we&rsquo;ll sort it
              so it stops spinning.
            </p>
            <button className="cta" type="button" onClick={() => setPhase('write')}>
              Start the dump
            </button>
          </div>
        )}

        {phase === 'write' && (
          <div className="rise" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div className="timer" aria-live="polite">
              {mm}:{String(ss).padStart(2, '0')} — keep the pen moving
            </div>
            <textarea
              ref={taRef}
              className="ta"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Brain dump"
              placeholder="everything that's on your mind… one thing per line… don't stop to think…"
            />
            <div className="center">
              <button className="cta ghost" type="button" onClick={toSort}>
                I&rsquo;m empty — sort it
              </button>
            </div>
          </div>
        )}

        {phase === 'sort' && lines[si] && (
          <div
            className="rise"
            style={{ display: 'flex', flexDirection: 'column', marginTop: '3vh' }}
          >
            <h1 className="h1" style={{ fontSize: 'clamp(22px,6vw,28px)' }}>
              Where does this go?
            </h1>
            <p className="sub">
              {si + 1} of {lines.length}
            </p>
            <div className="sortrow" style={{ padding: '20px 18px', marginBottom: 18 }}>
              <span className="txt" style={{ fontSize: 20 }}>
                {lines[si].txt}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(Object.keys(BUCKETS) as Bucket[]).map((k) => (
                <button
                  key={k}
                  className="cta"
                  style={{ flex: 1, background: BUCKETS[k].color }}
                  type="button"
                  onClick={() => assign(k)}
                >
                  {BUCKETS[k].label}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="rise results" style={{ marginTop: '2vh' }}>
            <h1 className="h1" style={{ fontSize: 'clamp(24px,6vw,30px)' }}>
              Out of your head.
            </h1>
            <p className="sub">
              It&rsquo;s on the page now, not spinning. Focus on Today; the rest can wait or go.
            </p>
            {(Object.keys(BUCKETS) as Bucket[]).map((k) => {
              const group = inBucket(lines, k);
              if (group.length === 0) {
                return null;
              }
              return (
                <div key={k} className="grp">
                  <div className="grp-h" style={{ color: BUCKETS[k].color }}>
                    <span className="dot" style={{ background: BUCKETS[k].color }} />
                    {BUCKETS[k].label} · {group.length}
                  </div>
                  {group.map((line) => (
                    <button
                      key={line.txt}
                      className={'gi' + (line.done ? ' done' : '')}
                      type="button"
                      onClick={() =>
                        k === 'today' &&
                        setLines((ls) => ls.map((x) => (x === line ? { ...x, done: !x.done } : x)))
                      }
                      style={{ cursor: k === 'today' ? 'pointer' : 'default' }}
                    >
                      {line.txt}
                    </button>
                  ))}
                </div>
              );
            })}
            <div className="center">
              <button
                className="cta ghost"
                type="button"
                onClick={() => {
                  setText('');
                  setLines([]);
                  setPhase('intro');
                }}
              >
                New dump
              </button>
            </div>
          </div>
        )}
      </div>

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

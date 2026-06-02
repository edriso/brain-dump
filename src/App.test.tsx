import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { createDefaultState } from './lib/repository';
import { useDumpStore } from './store/dump-store';

function reset() {
  localStorage.clear();
  useDumpStore.setState({ settings: createDefaultState().settings });
}
beforeEach(() => {
  reset();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('Brain Dump', () => {
  it('shows the intro and is visible (no opacity-freeze)', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Too much in your head/ })).toBeVisible();
  });

  it('writes, ends on the timer, sorts each line, and groups the result', () => {
    useDumpStore.setState((s) => ({ settings: { ...s.settings, writeSecs: 2 } }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Start the dump' }));
    fireEvent.change(screen.getByLabelText('Brain dump'), {
      target: { value: 'call mom\nfix the leak' },
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // The timer ends → sort step for the first line.
    expect(screen.getByRole('heading', { name: /Where does this go/ })).toBeInTheDocument();
    expect(screen.getByText('call mom')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Today' }));
    fireEvent.click(screen.getByRole('button', { name: 'Let go' }));
    // Both sorted → done with grouped results.
    expect(screen.getByRole('heading', { name: /Out of your head/ })).toBeInTheDocument();
    expect(screen.getByText(/Today · 1/)).toBeInTheDocument();
    expect(screen.getByText(/Let go · 1/)).toBeInTheDocument();
  });
});

'use client';

import { useSyncExternalStore } from 'react';

const PLACEHOLDER = '00:00:00';

const format = () =>
  new Date().toLocaleTimeString([], {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

let snapshot = PLACEHOLDER;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  if (!timer) {
    timer = setInterval(() => {
      const next = format();
      if (next === snapshot) return;
      snapshot = next;
      listeners.forEach((listener) => listener());
    }, 1000);
  }

  snapshot = format();
  onChange();

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

// Renders PLACEHOLDER on the server and the first client paint, so hydration matches.
export function useClock() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => PLACEHOLDER,
  );
}

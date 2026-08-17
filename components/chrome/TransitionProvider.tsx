'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

const ENTER_MS = 580;
const LEAVE_MS = 800;

export type TransitionPhase = 'idle' | 'entering' | 'leaving';

type TransitionApi = {
  phase: TransitionPhase;
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionApi | null>(null);

export function useTransitionNav() {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const pendingRef = useRef<string | null>(null);
  const fromPathRef = useRef(pathname);

  const navigate = useCallback(
    (href: string) => {
      if (phase !== 'idle') return;

      const targetPath = href.split('#')[0] || '/';
      const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

      // A hash jump within the current route needs no curtain, and under reduced
      // motion the curtain would just be a dead delay.
      if (targetPath === pathname || reduced) {
        router.push(href);
        return;
      }

      pendingRef.current = href;
      fromPathRef.current = pathname;
      setPhase('entering');
    },
    [phase, pathname, router],
  );

  useEffect(() => {
    if (phase !== 'entering') return;
    const id = window.setTimeout(() => {
      const href = pendingRef.current;
      if (href) router.push(href);
    }, ENTER_MS);
    return () => window.clearTimeout(id);
  }, [phase, router]);

  useEffect(() => {
    if (phase === 'entering' && pathname !== fromPathRef.current) {
      setPhase('leaving');
    }
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== 'leaving') return;
    const id = window.setTimeout(() => {
      pendingRef.current = null;
      setPhase('idle');
    }, LEAVE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  const api = useMemo<TransitionApi>(() => ({ phase, navigate }), [phase, navigate]);

  return <TransitionContext.Provider value={api}>{children}</TransitionContext.Provider>;
}

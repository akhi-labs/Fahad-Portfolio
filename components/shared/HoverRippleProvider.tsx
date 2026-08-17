'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { gsap } from '@/components/chrome/gsapSetup';
import {
  createRippleRenderer,
  type RippleRenderer,
} from '@/lib/webgl/createRippleRenderer';
import styles from './HoverRippleCanvas.module.css';

type RippleApi = {
  activate: (el: HTMLElement, src: string) => void;
  pointerMove: (el: HTMLElement, clientX: number, clientY: number) => void;
  deactivate: (el: HTMLElement) => void;
};

const RippleContext = createContext<RippleApi | null>(null);

export function useHoverRipple() {
  return useContext(RippleContext);
}

/**
 * Owns the single WebGL canvas shared by every work card. Mounting one context
 * per card would risk the browser's concurrent-context limit and keep idle
 * GPU resources alive, so the canvas is repositioned over whichever card is
 * currently hovered instead.
 */
export function HoverRippleProvider({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<RippleRenderer | null>(null);
  const activeRef = useRef<HTMLElement | null>(null);
  const strengthRef = useRef({ value: 0 });

  // Built on first hover of a card that actually has an image, so a site with
  // no real covers yet never creates a WebGL context at all.
  const ensureRenderer = useCallback(() => {
    if (rendererRef.current) return rendererRef.current;
    const host = hostRef.current;
    if (!host) return null;
    if (!window.matchMedia('(pointer:fine)').matches) return null;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return null;

    const renderer = createRippleRenderer();
    if (!renderer) return null;

    renderer.canvas.className = styles.canvas;
    host.appendChild(renderer.canvas);
    rendererRef.current = renderer;
    return renderer;
  }, []);

  useEffect(
    () => () => {
      const renderer = rendererRef.current;
      rendererRef.current = null;
      activeRef.current = null;
      renderer?.destroy();
      renderer?.canvas.remove();
    },
    [],
  );

  // The card's rect can move under the pointer while it is hovered.
  const syncRect = useCallback(() => {
    const el = activeRef.current;
    const renderer = rendererRef.current;
    if (!el || !renderer) return;
    const r = el.getBoundingClientRect();
    Object.assign(renderer.canvas.style, {
      transform: `translate3d(${r.left}px, ${r.top}px, 0)`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });
    renderer.resize(r.width, r.height);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', syncRect, { passive: true });
    window.addEventListener('scroll', syncRect, { passive: true });
    return () => {
      window.removeEventListener('resize', syncRect);
      window.removeEventListener('scroll', syncRect);
    };
  }, [syncRect]);

  const api = useMemo<RippleApi>(
    () => ({
      activate(el, src) {
        const renderer = ensureRenderer();
        if (!renderer) return;
        activeRef.current = el;
        syncRect();

        const r = el.getBoundingClientRect();
        void renderer.show(src, r.width, r.height).then(() => {
          // Guard against a fast move to another card while decoding.
          if (activeRef.current !== el) return;
          renderer.canvas.style.opacity = '1';
          gsap.to(strengthRef.current, {
            value: 1,
            duration: 0.4,
            ease: 'power2.out',
            onUpdate: () => renderer.setStrength(strengthRef.current.value),
          });
        });
      },
      pointerMove(el, clientX, clientY) {
        const renderer = rendererRef.current;
        if (!renderer || activeRef.current !== el) return;
        const r = el.getBoundingClientRect();
        renderer.setMouse((clientX - r.left) / r.width, (clientY - r.top) / r.height);
      },
      deactivate(el) {
        const renderer = rendererRef.current;
        if (!renderer || activeRef.current !== el) return;
        activeRef.current = null;
        renderer.canvas.style.opacity = '0';
        gsap.to(strengthRef.current, {
          value: 0,
          duration: 0.35,
          ease: 'power2.in',
          onUpdate: () => renderer.setStrength(strengthRef.current.value),
        });
      },
    }),
    [syncRect, ensureRenderer],
  );

  return (
    <RippleContext.Provider value={api}>
      <div ref={hostRef} className={styles.host} aria-hidden="true" />
      {children}
    </RippleContext.Provider>
  );
}

'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import '@/components/chrome/gsapSetup';
import { HoverRippleProvider } from '@/components/shared/HoverRippleProvider';
import { Cursor } from './Cursor';
import { Grain } from './Grain';
import { Loader } from './Loader';
import { NavOverlay } from './NavOverlay';
import { ParallaxEngine } from './ParallaxEngine';
import { Topbar } from './Topbar';
import { TransitionCurtain } from './TransitionCurtain';
import { TransitionProvider } from './TransitionProvider';

export function PageChrome({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const openNav = useCallback(() => setMenuOpen(true), []);
  const closeNav = useCallback(() => setMenuOpen(false), []);

  // The ported CSS keys the overlay and nav-item reveal off `body.menu-open`.
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  return (
    <TransitionProvider>
      <Loader />
      <TransitionCurtain />
      <Grain />
      <Cursor />
      <ParallaxEngine />
      <Topbar onOpenNav={openNav} />
      <NavOverlay open={menuOpen} onClose={closeNav} />
      <HoverRippleProvider>{children}</HoverRippleProvider>
    </TransitionProvider>
  );
}

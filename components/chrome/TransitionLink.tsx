'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { useTransitionNav } from './TransitionProvider';

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export function TransitionLink({ href, onClick, ...rest }: TransitionLinkProps) {
  const nav = useTransitionNav();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let the browser handle open-in-new-tab / new-window clicks.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (!nav) return;
    e.preventDefault();
    nav.navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}

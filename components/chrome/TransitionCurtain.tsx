'use client';

import { useTransitionNav } from './TransitionProvider';
import styles from './TransitionCurtain.module.css';

export function TransitionCurtain() {
  const phase = useTransitionNav()?.phase ?? 'idle';

  const className = [
    styles.curtain,
    phase === 'entering' ? styles.enter : '',
    phase === 'leaving' ? styles.leave : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={className} aria-hidden="true" />;
}

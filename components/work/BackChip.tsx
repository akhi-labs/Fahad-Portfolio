import { TransitionLink } from '@/components/chrome/TransitionLink';
import styles from './BackChip.module.css';

export function BackChip() {
  return (
    <TransitionLink className={styles.backChip} href="/#work">
      ALL WORK
    </TransitionLink>
  );
}

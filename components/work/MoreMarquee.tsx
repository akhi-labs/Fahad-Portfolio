import styles from './MoreMarquee.module.css';

const LINE = 'MORE WORKS — MORE WORKS — MORE WORKS — MORE WORKS —';

export function MoreMarquee() {
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        <span>{LINE}</span>
        <span>{LINE}</span>
      </div>
    </div>
  );
}

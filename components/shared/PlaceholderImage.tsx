import styles from './PlaceholderImage.module.css';

type PlaceholderImageProps = {
  /** Names the asset slot, e.g. "COVER — DENTA SMART". */
  label: string;
  /** Section-owned class for transform/transition rules. */
  className?: string;
  /** Parallax speed factor, e.g. "0.065". */
  parallax?: string;
};

// Stands in for every image until real assets land in public/. See README.md for
// the slot-to-filename mapping.
export function PlaceholderImage({ label, className, parallax }: PlaceholderImageProps) {
  return (
    <div
      className={className ? `${styles.placeholder} ${className}` : styles.placeholder}
      data-parallax={parallax}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      <span className={styles.label}>{label}</span>
    </div>
  );
}

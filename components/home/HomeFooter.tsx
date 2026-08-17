'use client';

import { useHeadingStagger } from '@/components/hooks/useHeadingStagger';
import { useMagnetic } from '@/components/hooks/useMagnetic';
import { useReveal } from '@/components/hooks/useReveal';
import { splitWords } from '@/components/shared/splitWords';
import styles from '@/components/Footer.module.css';
import { site } from '@/lib/site';
import { ContactForm } from './ContactForm';

export function HomeFooter() {
  const titleRef = useHeadingStagger<HTMLHeadingElement>();
  const contactRef = useReveal();
  const formRef = useReveal();
  const statementRef = useReveal<HTMLParagraphElement>();
  const roundRef = useMagnetic<HTMLAnchorElement>();

  return (
    <footer className={`${styles.footer} shell`} id="contact">
      <h2 ref={titleRef} className={styles.title}>
        <span>{splitWords("LET'S WORK")}</span>
        <span>{splitWords('TOGETHER')}</span>
      </h2>
      <div ref={contactRef} className={`${styles.contact} reveal`}>
        <div className="tiny muted">OPEN TO NEW PROJECTS / {site.year}</div>
        {/* Distinct from the topbar's CONTACT NOW, which only scrolls here. */}
        <a ref={roundRef} className={styles.round} href={`mailto:${site.email}`}>
          EMAIL ME
        </a>
      </div>
      <div ref={formRef} className={`${styles.form} reveal`}>
        <ContactForm />
      </div>
      <p ref={statementRef} className={`${styles.statement} reveal`}>
        AVAILABLE FOR NEW WORK FROM RAWALPINDI / ISLAMABAD, WITH TEAMS ANYWHERE.
      </p>
      <div className={styles.bottom}>
        <div>
          © {site.year} {site.name.toUpperCase()}
        </div>
        <div>
          <a href={site.dribbble} target="_blank" rel="noreferrer">
            DRIBBBLE
          </a>{' '}
          ·{' '}
          <a href={site.resume} download>
            RÉSUMÉ
          </a>
        </div>
        <div>
          <a href="#top">GO BACK TO TOP</a>
        </div>
      </div>
    </footer>
  );
}

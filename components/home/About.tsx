'use client';

import Image from 'next/image';
import { useReveal } from '@/components/hooks/useReveal';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import { SectionTitleRow } from '@/components/shared/SectionTitleRow';
import coverBlur from '@/lib/coverBlur.json';
import { site } from '@/lib/site';
import styles from './About.module.css';

export function About() {
  const portraitRef = useReveal();
  const copyRef = useReveal();

  return (
    <section className="section shell" id="about">
      <SectionTitleRow lines={['MORE ABOUT', site.firstName.toUpperCase()]} />
      <div className={styles.grid}>
        <div ref={portraitRef} className={`${styles.portrait} reveal`}>
          {site.portraitImage ? (
            <Image
              className={styles.portraitMedia}
              src={site.portraitImage}
              alt={site.name}
              data-parallax="0.04"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              placeholder="blur"
              blurDataURL={(coverBlur as Record<string, string>).portrait}
            />
          ) : (
            <PlaceholderImage
              className={styles.portraitMedia}
              label="Portrait — public/images/portrait.jpg"
              parallax="0.04"
            />
          )}
        </div>
        <div ref={copyRef} className="reveal">
          <p className={styles.statement}>
            With years of design experience and proficiency in Adobe Creative Suite,
            Figma, and XD, I&apos;ve contributed to a range of projects in Energy,
            Telecom, Healthcare, Smart Home, Social Ventures, and web applications.
            Previously at Turnotech and MTBC, I&apos;ve handled applications,
            websites, web applications, posters, packaging, and more. My versatile
            portfolio reflects a strong design theory background, and I thrive on
            both client and product-based projects, always eager to explore new
            opportunities.
          </p>

          <div className={styles.info}>
            <h3 className={styles.infoTitle}>Personal Information</h3>
            <dl className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <dt>Name</dt>
                <dd>{site.name}</dd>
              </div>
              <div className={styles.infoItem}>
                <dt>Location</dt>
                <dd>{site.location}</dd>
              </div>
              <div className={styles.infoItem}>
                <dt>Phone</dt>
                <dd>
                  <a className={styles.infoLink} href={site.phoneHref}>
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div className={styles.infoItem}>
                <dt>Email</dt>
                <dd>
                  <a className={styles.infoLink} href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className={styles.links}>
            <a className={styles.textLink} href="#experience">
              View experience
            </a>
            <a className={styles.textLink} href={site.resume} download>
              Download résumé
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

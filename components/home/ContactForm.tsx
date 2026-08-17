'use client';

import { useId, useRef, useState } from 'react';
import { site } from '@/lib/site';
import styles from './ContactForm.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildMailto(name: string, email: string, message: string) {
  const subject = `Portfolio enquiry from ${name}`;
  const body = `${message}\n\n—\n${name}\n${email}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Opens the visitor's mail client with everything filled in. Uses a real
 *  anchor rather than assigning location.href, which some browsers block for
 *  external schemes outside a direct user gesture. */
function openMailto(name: string, email: string, message: string) {
  const link = document.createElement('a');
  link.href = buildMailto(name, email, message);
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function ContactForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement | null>(null);

  const validate = (name: string, email: string, message: string): Errors => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email.trim())) next.email = 'Please enter a valid email address.';
    if (message.trim().length < 10) next.message = 'Please add a little more detail.';
    return next;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Bots fill every field they find, including the hidden one.
    if ((data.get('company') as string)?.trim()) return;

    const name = String(data.get('name') ?? '');
    const email = String(data.get('email') ?? '');
    const message = String(data.get('message') ?? '');

    const found = validate(name, email, message);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Focus by field name, not by querying [aria-invalid]: that attribute is
      // only set on the next render, so the DOM lookup would find nothing here.
      const firstInvalid = (['name', 'email', 'message'] as const).find((key) => found[key]);
      if (firstInvalid) {
        const field = form.elements.namedItem(firstInvalid);
        if (field instanceof HTMLElement) field.focus();
      }
      return;
    }

    // No key configured yet — hand off to the visitor's mail client so the form
    // is still useful rather than silently doing nothing.
    if (!site.contactFormKey) {
      openMailto(name, email, message);
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: site.contactFormKey,
          subject: `Portfolio enquiry from ${name}`,
          from_name: 'Portfolio contact form',
          name,
          email,
          message,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  const clearError = (field: keyof Errors) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${uid}-name`}>
            Name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={errors.name ? `${styles.input} ${styles.invalid}` : styles.input}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            onChange={() => clearError('name')}
          />
          <span className={styles.error} id={`${uid}-name-error`}>
            {errors.name}
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${uid}-email`}>
            Email
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={errors.email ? `${styles.input} ${styles.invalid}` : styles.input}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            onChange={() => clearError('email')}
          />
          <span className={styles.error} id={`${uid}-email-error`}>
            {errors.email}
          </span>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${uid}-message`}>
          Message
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          placeholder="A little about the project, timeline and what you need."
          className={errors.message ? `${styles.textarea} ${styles.invalid}` : styles.textarea}
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? `${uid}-message-error` : undefined}
          onChange={() => clearError('message')}
        />
        <span className={styles.error} id={`${uid}-message-error`}>
          {errors.message}
        </span>
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending' : 'Send message'}
        </button>
        <p className={styles.status} role="status" aria-live="polite">
          {status === 'sent' && (
            <span className={styles.ok}>
              {site.contactFormKey
                ? 'Thanks — your message is on its way.'
                : 'Opening your email app with the message ready to send.'}
            </span>
          )}
          {status === 'error' && (
            <span className={styles.fail}>
              Something went wrong. Email {site.email} directly.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}

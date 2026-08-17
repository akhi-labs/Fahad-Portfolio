export const site = {
  name: 'Fahad Amjad',
  firstName: 'Fahad',
  lastName: 'Amjad',
  role: 'Creative UI/UX & Graphic Designer',
  email: 'fahad.amjad2211@gmail.com',
  // Resume lists 0306-5555639; shown in international form.
  phone: '+92 306 5555639',
  phoneHref: 'tel:+923065555639',
  location: 'Rawalpindi / Islamabad, PK',
  dribbble: 'https://dribbble.com/fahadamjad',
  resume: '/resume.pdf',
  year: '2026',
  url: 'https://fahad-amjad.vercel.app',
  /**
   * Web3Forms access key. Get one free at https://web3forms.com — enter
   * fahad.amjad2211@gmail.com, and the key arrives by email. Paste it here (or
   * set NEXT_PUBLIC_WEB3FORMS_KEY on Vercel) and the contact form starts
   * delivering to that inbox. Until then the form falls back to opening a
   * prefilled email, so it still works. The key is public by design — it only
   * ever posts to the address it was issued for.
   */
  contactFormKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '',
  // Unset until the real files land; every consumer falls back to
  // PlaceholderImage while these are undefined.
  portraitImage: '/images/portrait.jpg' as string | undefined,
} as const;

export const navLinks = [
  { label: 'HOME', href: '/#top', transition: true },
  { label: 'WORK', href: '/#work', transition: true },
  { label: 'BRANDING', href: '/#branding', transition: true },
  { label: 'ABOUT', href: '/#about', transition: false },
  { label: 'CONTACT', href: '/#contact', transition: false },
] as const;

import { About } from '@/components/home/About';
import { Branding } from '@/components/home/Branding';
import { Experience } from '@/components/home/Experience';
import { Expertise } from '@/components/home/Expertise';
import { Hero } from '@/components/home/Hero';
import { HomeFooter } from '@/components/home/HomeFooter';
import { Stack } from '@/components/home/Stack';
import { WorkGrid } from '@/components/home/WorkGrid';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <WorkGrid />
        <Branding />
        <About />
        <Expertise />
        <Experience />
        <Stack />
      </main>
      <HomeFooter />
    </>
  );
}

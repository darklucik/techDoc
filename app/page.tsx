import { getContent } from '@/lib/db';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Services from '@/components/landing/Services';
import HowItWorks from '@/components/landing/HowItWorks';
import WhyUs from '@/components/landing/WhyUs';
import Reviews from '@/components/landing/Reviews';
import Footer from '@/components/landing/Footer';
import BackgroundEffects from '@/components/landing/BackgroundEffects';
import ScrollProgress from '@/components/landing/ScrollProgress';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const content = getContent();
  return (
    <>
      <BackgroundEffects />
      <ScrollProgress />
      <main className="relative z-10 bg-transparent">
        <Navbar />
        <Hero />
        <div className="section-divider" />
        <Services />
        <div className="section-divider" />
        <HowItWorks />
        <div className="section-divider" />
        <WhyUs />
        <div className="section-divider" />
        <Reviews />
        <div className="section-divider" />
        <Footer contacts={content.contacts} />
      </main>
    </>
  );
}

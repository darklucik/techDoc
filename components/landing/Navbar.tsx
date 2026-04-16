'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Wrench, Menu, X, Phone } from 'lucide-react';
import { useLang } from '@/components/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const { lang, setLang, T } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#services',    label: T.nav.services },
    { href: '#how-it-works',label: T.nav.howItWorks },
    { href: '#reviews',     label: T.nav.reviews },
    { href: '#contact',     label: T.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0E1A]/90 backdrop-blur-xl border-b border-white/8 shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center glow-blue">
              <Wrench size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white">
              Tech<span className="text-blue-400">Doc</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-0.5 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['uz', 'ru'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="relative px-2.5 py-1 rounded-lg text-xs font-semibold w-9"
                >
                  {lang === l && (
                    <motion.div
                      layoutId="lang-pill"
                      className="absolute inset-0 rounded-lg bg-blue-600"
                      style={{ boxShadow: '0 0 10px rgba(37,99,235,0.5)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className="relative z-10 transition-colors duration-150"
                    style={{ color: lang === l ? '#fff' : 'rgb(148,163,184)' }}
                  >
                    {l.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>

            <a href={`tel:${T.nav.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
              <Phone size={15} className="text-orange-400" />
              {T.nav.phone}
            </a>
            <a href="#contact"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5">
              {T.nav.cta}
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile lang switcher */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/5 border border-white/10">
              {(['uz', 'ru'] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className="relative px-2 py-0.5 rounded-md text-xs font-semibold w-8">
                  {lang === l && (
                    <motion.div
                      layoutId="lang-pill-mobile"
                      className="absolute inset-0 rounded-md bg-blue-600"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className="relative z-10 transition-colors duration-150"
                    style={{ color: lang === l ? '#fff' : 'rgb(100,116,139)' }}
                  >
                    {l.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
            <button className="p-2 rounded-lg text-slate-400 hover:text-white"
              onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll progress line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-blue-500 origin-left"
        style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
      />

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0A0E1A]/95 backdrop-blur-xl border-t border-white/8 px-4 py-4 space-y-3">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="block text-slate-300 hover:text-white py-2 text-sm"
              onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contact"
            className="block text-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl mt-2"
            onClick={() => setOpen(false)}>
            {T.nav.cta}
          </a>
        </div>
      )}
    </header>
  );
}

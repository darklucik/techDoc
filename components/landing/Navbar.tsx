'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Wrench, Menu, X, Phone, Sun, Moon } from 'lucide-react';
import { useLang } from '@/components/LanguageContext';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const { scrollYProgress }       = useScroll();
  const { lang, setLang, T }      = useLang();
  const { theme, toggle }         = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#services',     label: T.nav.services },
    { href: '#how-it-works', label: T.nav.howItWorks },
    { href: '#reviews',      label: T.nav.reviews },
    { href: '#contact',      label: T.nav.contact },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass shadow-lg dark:shadow-black/30 shadow-black/8 border-b border-[var(--border)]'
          : 'bg-transparent border-b border-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* ── Logo ── */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--teal)] flex items-center justify-center glow-teal transition-transform group-hover:scale-105">
              <Wrench size={17} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-[var(--text-primary)]">
              Repair<span className="text-[var(--teal)]">Master</span>
            </span>
          </a>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="relative text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[var(--teal)] rounded-full transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* ── Right controls ── */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language switcher */}
            <div className="flex items-center gap-0.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              {(['uz', 'ru'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="relative px-2.5 py-1 rounded-lg text-xs font-semibold w-9"
                >
                  {lang === l && (
                    <motion.div
                      layoutId="lang-pill"
                      className="absolute inset-0 rounded-lg bg-[var(--teal)]"
                      style={{ boxShadow: '0 0 10px var(--teal-glow)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className="relative z-10 transition-colors duration-150"
                    style={{ color: lang === l ? '#fff' : 'var(--text-dim)' }}
                  >
                    {l.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
                'border border-[var(--border)] bg-[var(--bg-secondary)]',
                'hover:border-[var(--teal)] hover:text-[var(--teal)] text-[var(--text-muted)]',
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0,   scale: 1   }}
                  exit={{    opacity: 0, rotate:  30, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Phone */}
            <a
              href={`tel:${T.nav.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-2"
            >
              <Phone size={14} className="text-[var(--amber)]" />
              {T.nav.phone}
            </a>

            {/* CTA */}
            <a
              href="#contact"
              className="px-4 py-2 bg-[var(--teal)] hover:bg-[var(--teal-light)] text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            >
              {T.nav.cta}
            </a>
          </div>

          {/* ── Mobile controls ── */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile lang */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
              {(['uz', 'ru'] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className="relative px-2 py-0.5 rounded-md text-xs font-semibold w-8">
                  {lang === l && (
                    <motion.div
                      layoutId="lang-pill-mobile"
                      className="absolute inset-0 rounded-md bg-[var(--teal)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className="relative z-10"
                    style={{ color: lang === l ? '#fff' : 'var(--text-dim)' }}
                  >
                    {l.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)]"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Burger */}
            <button
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Scroll progress line ── */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2.5px] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, var(--teal) 0%, #2DD4BF 40%, var(--amber) 75%, #FCD34D 100%)',
          boxShadow: '0 0 8px var(--teal-glow), 0 0 16px rgba(13,148,136,0.3)',
        }}
      />

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden border-t border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-xl px-4 py-4 space-y-1"
          >
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="block text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] py-2.5 px-3 rounded-xl text-sm font-medium transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="#contact"
                className="block text-center px-4 py-2.5 bg-[var(--teal)] text-white text-sm font-semibold rounded-xl"
                onClick={() => setOpen(false)}
              >
                {T.nav.cta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

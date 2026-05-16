'use client';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Package, Award } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';
import CountUp from './CountUp';
import { useLang } from '@/components/LanguageContext';

const icons = [Zap, ShieldCheck, Package, Award];

const iconColors = [
  { bg: 'rgba(13,148,136,0.12)',  border: 'rgba(13,148,136,0.3)',  text: 'var(--teal)'  },
  { bg: 'rgba(217,119,6,0.12)',   border: 'rgba(217,119,6,0.3)',   text: 'var(--amber)' },
  { bg: 'rgba(13,148,136,0.12)',  border: 'rgba(13,148,136,0.3)',  text: 'var(--teal)'  },
  { bg: 'rgba(217,119,6,0.12)',   border: 'rgba(217,119,6,0.3)',   text: 'var(--amber)' },
];

export default function WhyUs() {
  const { T } = useLang();
  const w = T.whyUs;

  const counterStats = [
    { value: 50000, suffix: '+', label: w.stat1Label },
    { value: 15,    suffix: '+', label: w.stat2Label },
    { value: 98,    suffix: '%', label: w.stat3Label },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--teal-glow), transparent)' }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <AnimateOnScroll direction="right" className="space-y-6">
            <div
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium border"
              style={{ background: 'var(--teal-glow)', borderColor: 'rgba(13,148,136,0.25)', color: 'var(--teal)' }}
            >
              {w.badge}
            </div>
            <h2 className="text-4xl font-bold text-[var(--text-primary)] leading-tight">
              {w.title} <span className="gradient-text">{w.accent}</span>
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed">{w.description}</p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {counterStats.map(s => (
                <div key={s.label} className="text-center glass rounded-xl p-4">
                  <div className="text-2xl font-bold text-[var(--text-primary)]">
                    <CountUp end={s.value} suffix={s.suffix} duration={2.5} />
                  </div>
                  <div className="text-xs text-[var(--text-dim)] mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200"
              style={{ background: 'var(--amber)', boxShadow: '0 4px 20px var(--amber-glow)' }}
              whileHover={{ scale: 1.03, y: -2, background: 'var(--amber-light)' }}
              whileTap={{ scale: 0.97 }}
            >
              {w.cta}
            </motion.a>
          </AnimateOnScroll>

          {/* RIGHT — feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {w.items.map((item, i) => {
              const Icon  = icons[i % icons.length];
              const c     = iconColors[i % iconColors.length];
              const dir   = i % 2 === 0 ? 'right' : 'left' as const;
              return (
                <AnimateOnScroll key={i} delay={i * 0.1} direction={dir}>
                  <motion.div
                    className="glass rounded-2xl p-5 space-y-3 group h-full"
                    whileHover={{ y: -4, boxShadow: '0 12px 36px var(--amber-glow)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                    >
                      <Icon size={18} />
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)] text-sm">{item.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                  </motion.div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

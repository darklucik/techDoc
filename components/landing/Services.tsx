'use client';
import { motion } from 'framer-motion';
import { Refrigerator, WashingMachine, Tv, Wind, Microwave, Laptop, ChevronRight } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';
import { useLang } from '@/components/LanguageContext';

const icons = [Refrigerator, WashingMachine, Tv, Wind, Microwave, Laptop];

const iconColors = [
  { bg: 'rgba(13,148,136,0.12)',  border: 'rgba(13,148,136,0.25)', text: 'var(--teal)' },
  { bg: 'rgba(217,119,6,0.12)',   border: 'rgba(217,119,6,0.25)',  text: 'var(--amber)' },
  { bg: 'rgba(13,148,136,0.12)',  border: 'rgba(13,148,136,0.25)', text: 'var(--teal)' },
  { bg: 'rgba(217,119,6,0.12)',   border: 'rgba(217,119,6,0.25)',  text: 'var(--amber)' },
  { bg: 'rgba(13,148,136,0.12)',  border: 'rgba(13,148,136,0.25)', text: 'var(--teal)' },
  { bg: 'rgba(217,119,6,0.12)',   border: 'rgba(217,119,6,0.25)',  text: 'var(--amber)' },
];

export default function Services() {
  const { T } = useLang();
  const s = T.services;

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center mb-16 space-y-4">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium border"
            style={{ background: 'var(--teal-glow)', borderColor: 'rgba(13,148,136,0.25)', color: 'var(--teal)' }}
          >
            {s.badge}
          </div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)]">
            {s.title} <span className="gradient-text">{s.accent}</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">{s.subtitle}</p>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {s.items.map((svc, i) => {
            const Icon  = icons[i];
            const color = iconColors[i];
            return (
              <AnimateOnScroll key={i} delay={i * 0.08} direction="up">
                <motion.div
                  className="glass rounded-2xl p-6 group cursor-pointer h-full flex flex-col"
                  whileHover={{ y: -4, boxShadow: '0 12px 40px var(--teal-glow)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{ background: color.bg, border: `1px solid ${color.border}` }}
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Icon size={22} style={{ color: color.text }} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-1.5 group-hover:text-[var(--teal)] transition-colors">
                        {svc.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{svc.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs text-[var(--text-dim)] group-hover:text-[var(--teal)] transition-colors">
                    {s.more} <ChevronRight size={12} />
                  </div>
                </motion.div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Package, Award } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';
import CountUp from './CountUp';
import { useLang } from '@/components/LanguageContext';

const icons = [Zap, ShieldCheck, Package, Award];

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
      <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-blue-950/20 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimateOnScroll direction="right" className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm font-medium">
              {w.badge}
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              {w.title} <span className="gradient-text">{w.accent}</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">{w.description}</p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {counterStats.map(s => (
                <div key={s.label} className="text-center glass rounded-xl p-3">
                  <div className="text-2xl font-bold text-white">
                    <CountUp end={s.value} suffix={s.suffix} duration={2.5} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            <motion.a href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-orange-500/25"
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              {w.cta}
            </motion.a>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 gap-4">
            {w.items.map((item, i) => {
              const Icon = icons[i % icons.length];
              const dir = i % 2 === 0 ? 'right' : 'left' as const;
              return (
                <AnimateOnScroll key={i} delay={i * 0.1} direction={dir}>
                  <motion.div
                    className="glass rounded-2xl p-5 space-y-3 group h-full"
                    whileHover={{ y: -4, boxShadow: '0 0 30px rgba(249,115,22,0.15)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center group-hover:bg-orange-500/25 transition-colors">
                      <Icon size={18} className="text-orange-400" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
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

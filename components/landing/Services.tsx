'use client';
import { motion } from 'framer-motion';
import { Refrigerator, WashingMachine, Tv, Wind, Microwave, Laptop, ChevronRight } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';
import { useLang } from '@/components/LanguageContext';

const icons = [Refrigerator, WashingMachine, Tv, Wind, Microwave, Laptop];

export default function Services() {
  const { T } = useLang();
  const s = T.services;

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm font-medium">
            {s.badge}
          </div>
          <h2 className="text-4xl font-bold text-white">
            {s.title} <span className="gradient-text">{s.accent}</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">{s.subtitle}</p>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {s.items.map((svc, i) => {
            const Icon = icons[i];
            return (
              <AnimateOnScroll key={i} delay={i * 0.1} direction="up">
                <motion.div
                  className="glass rounded-2xl p-6 transition-colors duration-300 group cursor-pointer card-glow h-full"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(37,99,235,0.25)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/25 group-hover:border-blue-600/40 transition-all duration-200"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                      <Icon size={22} className="text-blue-400" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1.5 group-hover:text-blue-300 transition-colors">
                        {svc.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{svc.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs text-slate-600 group-hover:text-blue-400 transition-colors">
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

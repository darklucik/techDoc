'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Clock, Wrench, Star } from 'lucide-react';
import CountUp from './CountUp';
import { useLang } from '@/components/LanguageContext';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const { T } = useLang();
  const h = T.hero;

  const stats = [
    { value: 50000, suffix: '+', label: h.stat1Label },
    { value: 15,    suffix: '+', label: h.stat2Label },
    { value: 4.9,   suffix: '',  label: h.stat3Label },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-[-5%] w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }}
        animate={{ x: [0, 60, -20, 0], y: [0, -50, 30, 0], opacity: [0.6, 1, 0.7, 0.6] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
        animate={{ x: [0, -70, 40, 0], y: [0, 60, -40, 0], opacity: [0.5, 0.9, 0.6, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 60%)' }}
        animate={{ scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />

      <motion.div style={{ y }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {h.badge}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
              className="space-y-3"
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
                {h.title}{' '}
                <span className="gradient-text">{h.titleAccent}</span>
              </h1>
              <p className="text-xl font-semibold text-slate-300 tracking-wide">
                {h.subtitle}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
              className="text-lg text-slate-400 leading-relaxed max-w-lg"
            >
              {h.description}{' '}
              <span className="text-orange-400 font-semibold">{h.descAccent}</span>{' '}
              {h.descEnd}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
              className="flex flex-wrap gap-4"
            >
              <motion.a href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-blue-600/30"
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                {h.ctaPrimary}<ArrowRight size={18} />
              </motion.a>
              <motion.a href="tel:+998712001010"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold rounded-xl transition-colors duration-200 border border-white/10 hover:border-white/20"
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                {h.ctaPhone}
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
              className="flex flex-wrap gap-8 pt-4"
            >
              {stats.map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">
                    <CountUp end={s.value} suffix={s.suffix} duration={2.5} />
                  </div>
                  <div className="text-sm text-slate-500">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="relative hidden lg:flex items-center justify-center">
            <motion.div className="absolute w-80 h-80 rounded-full border border-blue-600/20 pointer-events-none"
              animate={{ scale: [1, 1.3, 1.6], opacity: [0.5, 0.2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }} />
            <motion.div className="absolute w-80 h-80 rounded-full border border-blue-600/15 pointer-events-none"
              animate={{ scale: [1, 1.3, 1.6], opacity: [0.4, 0.15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }} />
            <motion.div className="absolute w-80 h-80 rounded-full border border-orange-500/10 pointer-events-none"
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeOut', delay: 0.5 }} />

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="relative w-72 h-72 glass rounded-3xl p-8 flex flex-col items-center justify-center gap-4 animate-float glow-blue"
            >
              <motion.div
                className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center"
                whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 200 }}>
                <Wrench size={36} className="text-blue-400" />
              </motion.div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">TechDoc</div>
                <div className="text-slate-400 text-sm">Service Centre</div>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className="text-orange-400 fill-orange-400" />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute top-4 right-0 glass rounded-2xl px-4 py-3 flex items-center gap-3">
              <Clock size={18} className="text-orange-400" />
              <div>
                <div className="text-xs text-slate-400">Kelish vaqti / Выезд</div>
                <div className="text-sm font-semibold text-white">1 soat / 1 час</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-8 left-0 glass rounded-2xl px-4 py-3 flex items-center gap-3">
              <Shield size={18} className="text-green-400" />
              <div>
                <div className="text-xs text-slate-400">Kafolat / Гарантия</div>
                <div className="text-sm font-semibold text-white">12 oy / 12 мес.</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0E1A] to-transparent pointer-events-none" />
    </section>
  );
}

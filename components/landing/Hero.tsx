'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Clock, Wrench, Star } from 'lucide-react';
import CountUp from './CountUp';
import { useLang } from '@/components/LanguageContext';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const { T } = useLang();
  const h = T.hero;

  const stats = [
    { value: 50000, suffix: '+', label: h.stat1Label },
    { value: 15,    suffix: '+', label: h.stat2Label },
    { value: 4.9,   suffix: '',  label: h.stat3Label },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Ambient blobs */}
      <motion.div
        className="absolute top-1/4 left-[-5%] w-[650px] h-[650px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--teal-glow) 0%, transparent 70%)' }}
        animate={{ x: [0, 55, -20, 0], y: [0, -45, 30, 0], opacity: [0.6, 1, 0.7, 0.6] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-[-8%] w-[560px] h-[560px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--amber-glow) 0%, transparent 70%)' }}
        animate={{ x: [0, -65, 40, 0], y: [0, 55, -35, 0], opacity: [0.5, 0.85, 0.6, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />

      <motion.div
        style={{ y }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="space-y-3"
            >
              <h1 className="text-5xl lg:text-6xl xl:text-[4.25rem] font-bold leading-[1.1] tracking-tight text-[var(--text-primary)]">
                {h.title}{' '}
                <span className="gradient-text">{h.titleAccent}</span>
              </h1>
              <p className="text-xl font-semibold text-[var(--text-muted)] tracking-wide">
                {h.subtitle}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-[var(--text-muted)] leading-relaxed max-w-lg"
            >
              {h.description}{' '}
              <span className="text-[var(--amber)] font-semibold">{h.descAccent}</span>{' '}
              {h.descEnd}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--teal)] hover:bg-[var(--teal-light)] text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg"
                style={{ boxShadow: '0 4px 24px var(--teal-glow)' }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {h.ctaPrimary}<ArrowRight size={18} />
              </motion.a>
              <motion.a
                href="tel:+998712001010"
                className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-xl transition-all duration-200 border text-[var(--text-primary)]"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {h.ctaPhone}
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              {stats.map((s, i) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">
                    <CountUp end={s.value} suffix={s.suffix} duration={2.5} />
                  </div>
                  <div className="text-sm text-[var(--text-dim)]">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — floating card */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Pulse rings */}
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute w-80 h-80 rounded-full border"
                style={{ borderColor: i === 2 ? 'rgba(217,119,6,0.12)' : 'rgba(13,148,136,0.18)' }}
                animate={{ scale: [1, 1.3 + i * 0.1, 1.6 + i * 0.1], opacity: [0.5 - i * 0.05, 0.2, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeOut', delay: i * 0.9 }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative w-72 h-72 glass rounded-3xl p-8 flex flex-col items-center justify-center gap-4 animate-float glow-teal"
            >
              <motion.div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--teal-glow)', border: '1px solid rgba(13,148,136,0.3)' }}
                whileHover={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Wrench size={36} className="text-[var(--teal)]" />
              </motion.div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--text-primary)]">RepairMaster</div>
                <div className="text-sm text-[var(--text-muted)]">Service Centre</div>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className="text-[var(--amber)] fill-[var(--amber)]" />
                ))}
              </div>
            </motion.div>

            {/* Floating chip — time */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute top-4 right-0 glass rounded-2xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--amber-glow)' }}>
                <Clock size={16} className="text-[var(--amber)]" />
              </div>
              <div>
                <div className="text-xs text-[var(--text-dim)]">Kelish vaqti / Выезд</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">1 soat / 1 час</div>
              </div>
            </motion.div>

            {/* Floating chip — guarantee */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-8 left-0 glass rounded-2xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.15)' }}>
                <Shield size={16} className="text-emerald-500" />
              </div>
              <div>
                <div className="text-xs text-[var(--text-dim)]">Kafolat / Гарантия</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">12 oy / 12 мес.</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--bg-primary), transparent)' }}
      />
    </section>
  );
}

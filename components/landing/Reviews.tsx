'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '@/components/LanguageContext';

const AUTOPLAY_MS = 5000;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={13}
          className={s <= rating ? 'text-orange-400 fill-orange-400' : 'text-slate-700'}
        />
      ))}
    </div>
  );
}

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export default function Reviews() {
  const { T } = useLang();
  const r = T.reviews;

  const [[index, dir], setPage] = useState([0, 0]);
  const total = r.items.length;

  const go = useCallback((newDir: number) => {
    setPage(([prev]) => [(prev + newDir + total) % total, newDir]);
  }, [total]);

  // autoplay
  useEffect(() => {
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [go]);

  const rev = r.items[index];

  return (
    <section id="reviews" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-14 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
            {r.badge}
          </div>
          <h2 className="text-4xl font-bold text-white">
            {r.title} <span className="gradient-text">{r.accent}</span>
          </h2>
        </motion.div>

        {/* Slider */}
        <div className="flex flex-col items-center gap-8">

          {/* Card area */}
          <div className="relative w-full max-w-2xl mx-auto" style={{ minHeight: 220 }}>

            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-blue-600/5 blur-2xl pointer-events-none" />

            <AnimatePresence initial={false} custom={dir} mode="wait">
              <motion.div
                key={index}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
                className="glass rounded-3xl p-8 sm:p-10 space-y-6"
              >
                <Quote size={28} className="text-blue-600/40" />

                <p className="text-slate-200 text-base sm:text-lg leading-relaxed italic">
                  &ldquo;{rev.text}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-300 font-bold">
                      {rev.name[0]}
                    </div>
                    <span className="font-semibold text-white">{rev.name}</span>
                  </div>
                  <Stars rating={rev.rating} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => go(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 border border-white/10 bg-white/4 hover:text-white hover:border-white/25 hover:bg-white/8 transition-all duration-150"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {r.items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(([prev]) => [i, i > prev ? 1 : -1])}
                  className="relative h-1.5 rounded-full transition-all duration-300 overflow-hidden"
                  style={{ width: i === index ? 24 : 6, background: 'rgba(255,255,255,0.12)' }}
                >
                  {i === index && (
                    <motion.div
                      layoutId="dot-fill"
                      className="absolute inset-0 rounded-full bg-blue-500"
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 border border-white/10 bg-white/4 hover:text-white hover:border-white/25 hover:bg-white/8 transition-all duration-150"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

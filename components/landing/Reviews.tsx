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
          style={{
            color:       s <= rating ? 'var(--amber)' : 'var(--border)',
            fill:        s <= rating ? 'var(--amber)' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

const variants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ?  60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 :  60 }),
};

export default function Reviews() {
  const { T } = useLang();
  const r = T.reviews;

  const [[index, dir], setPage] = useState([0, 0]);
  const total = r.items.length;

  const go = useCallback((newDir: number) => {
    setPage(([prev]) => [(prev + newDir + total) % total, newDir]);
  }, [total]);

  useEffect(() => {
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [go]);

  const rev = r.items[index];

  return (
    <section id="reviews" className="py-24 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--teal-glow), transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium border"
            style={{ background: 'var(--amber-glow)', borderColor: 'rgba(217,119,6,0.25)', color: 'var(--amber)' }}
          >
            {r.badge}
          </div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)]">
            {r.title} <span className="gradient-text">{r.accent}</span>
          </h2>
        </motion.div>

        <div className="flex flex-col items-center gap-8">
          <div className="relative w-full max-w-2xl mx-auto" style={{ minHeight: 220 }}>
            {/* Ambient glow */}
            <div
              className="absolute inset-0 rounded-3xl blur-2xl pointer-events-none"
              style={{ background: 'var(--teal-glow)' }}
            />

            <AnimatePresence initial={false} custom={dir} mode="wait">
              <motion.div
                key={index}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.32, 0, 0.67, 0] }}
                className="glass rounded-3xl p-8 sm:p-10 space-y-6"
              >
                <Quote size={26} style={{ color: 'var(--teal)', opacity: 0.5 }} />

                <p className="text-[var(--text-primary)] text-base sm:text-lg leading-relaxed italic">
                  &ldquo;{rev.text}&rdquo;
                </p>

                <div
                  className="flex items-center justify-between pt-2"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{ background: 'var(--teal-glow)', border: '1px solid rgba(13,148,136,0.3)', color: 'var(--teal)' }}
                    >
                      {rev.name[0]}
                    </div>
                    <span className="font-semibold text-[var(--text-primary)]">{rev.name}</span>
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
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-105"
              style={{
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-muted)',
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {r.items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(([prev]) => [i, i > prev ? 1 : -1])}
                  className="relative h-1.5 rounded-full transition-all duration-300 overflow-hidden"
                  style={{ width: i === index ? 24 : 6, background: 'var(--border)' }}
                >
                  {i === index && (
                    <motion.div
                      layoutId="dot-fill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'var(--teal)' }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-105"
              style={{
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-muted)',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

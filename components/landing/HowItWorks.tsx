'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion, useMotionValue, useTransform, animate, useInView,
  type MotionValue,
} from 'framer-motion';
import { PhoneCall, MapPin, Wrench, CheckCircle } from 'lucide-react';
import { useLang } from '@/components/LanguageContext';

const LIFT   = 18;
const SPRING = { type: 'spring', stiffness: 280, damping: 24 } as const;

function seg(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
}

const stepsMeta = [
  { icon: PhoneCall,   color: 'teal'  },
  { icon: MapPin,      color: 'amber' },
  { icon: Wrench,      color: 'teal'  },
  { icon: CheckCircle, color: 'green' },
] as const;

const colorCls: Record<string, { bg: string; border: string; text: string }> = {
  teal:  { bg: 'rgba(13,148,136,0.12)',  border: 'rgba(13,148,136,0.3)',  text: 'var(--teal)'  },
  amber: { bg: 'rgba(217,119,6,0.12)',   border: 'rgba(217,119,6,0.3)',   text: 'var(--amber)' },
  green: { bg: 'rgba(22,163,74,0.12)',   border: 'rgba(22,163,74,0.3)',   text: '#22C55E'      },
};

function ConnectorSVG({
  yMVs, xs, baseY, visible,
}: {
  yMVs:    MotionValue<number>[];
  xs:      number[];
  baseY:   number;
  visible: boolean;
}) {
  const ready = xs.length === 4 && baseY > 0;

  const dotY0 = useTransform(yMVs[0], (dy: number) => baseY + dy);
  const dotY1 = useTransform(yMVs[1], (dy: number) => baseY + dy);
  const dotY2 = useTransform(yMVs[2], (dy: number) => baseY + dy);
  const dotY3 = useTransform(yMVs[3], (dy: number) => baseY + dy);
  const dotYs = [dotY0, dotY1, dotY2, dotY3];

  const d01 = useTransform([yMVs[0], yMVs[1]], ([a, b]: number[]) =>
    ready ? seg(xs[0], baseY + a, xs[1], baseY + b) : '');
  const d12 = useTransform([yMVs[1], yMVs[2]], ([a, b]: number[]) =>
    ready ? seg(xs[1], baseY + a, xs[2], baseY + b) : '');
  const d23 = useTransform([yMVs[2], yMVs[3]], ([a, b]: number[]) =>
    ready ? seg(xs[2], baseY + a, xs[3], baseY + b) : '');

  const paths = [d01, d12, d23];

  if (!ready) return null;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none hidden lg:block overflow-visible"
      aria-hidden
    >
      <defs>
        <filter id="lineGlow" x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {paths.map((d, i) => (
        <g key={i}>
          <motion.path
            d={d} fill="none"
            stroke="rgba(13,148,136,0.22)" strokeWidth={6} strokeLinecap="round"
            filter="url(#lineGlow)"
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
          />
          <motion.path
            d={d} fill="none"
            stroke="rgba(13,148,136,0.5)" strokeWidth={1.5} strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{
              pathLength: { duration: 0.8, delay: 0.3 + i * 0.15, ease: 'easeInOut' },
              opacity:    { duration: 0.2, delay: 0.3 + i * 0.15 },
            }}
          />
        </g>
      ))}

      {ready && dotYs.map((dotY, i) => (
        <motion.circle
          key={i} cx={xs[i]} cy={dotY} r={3}
          fill="var(--teal)"
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.4 + i * 0.12 }}
        />
      ))}
    </svg>
  );
}

export default function HowItWorks() {
  const yMV0 = useMotionValue(0);
  const yMV1 = useMotionValue(0);
  const yMV2 = useMotionValue(0);
  const yMV3 = useMotionValue(0);
  const yMVs = [yMV0, yMV1, yMV2, yMV3];

  const iconRef0 = useRef<HTMLDivElement>(null);
  const iconRef1 = useRef<HTMLDivElement>(null);
  const iconRef2 = useRef<HTMLDivElement>(null);
  const iconRef3 = useRef<HTMLDivElement>(null);
  const iconRefs = [iconRef0, iconRef1, iconRef2, iconRef3];

  const rowRef     = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: '-80px' });

  const [xs,    setXs]    = useState<number[]>([]);
  const [baseY, setBaseY] = useState(0);

  const measure = useCallback(() => {
    const container = rowRef.current;
    if (!container) return;
    const base = container.getBoundingClientRect();
    const newXs: number[] = [];
    let newY = 0;
    iconRefs.forEach((r, i) => {
      if (!r.current) return;
      const b = r.current.getBoundingClientRect();
      newXs[i] = b.left + b.width  / 2 - base.left;
      if (i === 0) newY = b.top + b.height / 2 - base.top;
    });
    if (newXs.length === 4) { setXs(newXs); setBaseY(newY); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = setTimeout(measure, 900);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, [measure]);

  const { T } = useLang();
  const hw    = T.howItWorks;

  const onEnter = (i: number) => animate(yMVs[i], -LIFT, SPRING);
  const onLeave = (i: number) => animate(yMVs[i], 0, SPRING);

  return (
    <section id="how-it-works" className="py-24 relative" ref={sectionRef}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, var(--teal-glow), transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium border"
            style={{ background: 'var(--amber-glow)', borderColor: 'rgba(217,119,6,0.25)', color: 'var(--amber)' }}
          >
            {hw.badge}
          </div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)]">
            {hw.title} <span className="gradient-text">{hw.accent}</span>
          </h2>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">{hw.subtitle}</p>
        </motion.div>

        <div ref={rowRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <ConnectorSVG yMVs={yMVs} xs={xs} baseY={baseY} visible={isInView} />

          {stepsMeta.map((meta, i) => {
            const Icon    = meta.icon;
            const iconRef = iconRefs[i];
            const yMV     = yMVs[i];
            const step    = hw.steps[i];
            const c       = colorCls[meta.color];

            return (
              <motion.div
                key={i}
                className="relative text-center glass rounded-2xl p-6 cursor-default"
                style={{ y: yMV }}
                onHoverStart={() => onEnter(i)}
                onHoverEnd={()   => onLeave(i)}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                whileHover={{ boxShadow: '0 0 40px var(--teal-glow)' }}
              >
                {/* Step number */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}
                >
                  {i + 1}
                </div>

                <div
                  ref={iconRef}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                >
                  <Icon size={24} />
                </div>

                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

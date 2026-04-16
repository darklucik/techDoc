'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion, useMotionValue, useTransform, animate, useInView,
  type MotionValue,
} from 'framer-motion';
import { PhoneCall, MapPin, Wrench, CheckCircle } from 'lucide-react';
import { useLang } from '@/components/LanguageContext';

/* ── tune these ── */
const LIFT   = 18;   // px card lifts on hover
const SPRING = { type: 'spring', stiffness: 280, damping: 24 } as const;

/* ────────────────────────────────────────────────────────
   Smooth bezier segment between two points.
   When y1 === y2  →  visually a straight line.
   When y1 ≠  y2  →  smooth single-direction curve
   (tangent is horizontal at both endpoints).
──────────────────────────────────────────────────────── */
function seg(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  // C mx,y1  mx,y2  x2,y2 — horizontal tangents at both ends
  return `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
}

/* ────────────────────────────────────────────────────────
   STEPS DATA
──────────────────────────────────────────────────────── */
const steps = [
  {
    icon:  PhoneCall,
    title: 'Ariza qoldiring',
    desc:  "Bizga qo'ng'iroq qiling yoki saytdagi formani to'ldiring — bir daqiqadan kam vaqt oladi",
    color: 'blue',
  },
  {
    icon:  MapPin,
    title: 'Usta kelishi',
    desc:  "Usta qulay vaqtda, aksariyat hollarda murojaat kuni o'zida yetib keladi",
    color: 'orange',
  },
  {
    icon:  Wrench,
    title: "Diagnostika va ta'mirlash",
    desc:  "Uyingizda bepul diagnostika, ehtiyot qismlar mavjud bo'lsa shu kuni ta'mirlash",
    color: 'blue',
  },
  {
    icon:  CheckCircle,
    title: 'Kafolat',
    desc:  "Barcha turdagi ishlarga 12 oygacha yozma kafolat beramiz",
    color: 'green',
  },
] as const;

const colorCls: Record<string, string> = {
  blue:   'bg-blue-600/15   border-blue-600/30   text-blue-400',
  orange: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
  green:  'bg-green-500/15  border-green-500/30  text-green-400',
};

/* ────────────────────────────────────────────────────────
   SVG LAYER
   Receives 4 MotionValues (card Y-offsets) and static
   icon positions. Updates the path d-attribute every
   animation frame with zero lag via useTransform.
──────────────────────────────────────────────────────── */
function ConnectorSVG({
  yMVs, xs, baseY, visible,
}: {
  yMVs:    MotionValue<number>[];
  xs:      number[];
  baseY:   number;
  visible: boolean;
}) {
  const ready = xs.length === 4 && baseY > 0;

  // All 4 dot Y positions — declared unconditionally at top level (Rules of Hooks)
  const dotY0 = useTransform(yMVs[0], (dy: number) => baseY + dy);
  const dotY1 = useTransform(yMVs[1], (dy: number) => baseY + dy);
  const dotY2 = useTransform(yMVs[2], (dy: number) => baseY + dy);
  const dotY3 = useTransform(yMVs[3], (dy: number) => baseY + dy);
  const dotYs = [dotY0, dotY1, dotY2, dotY3];

  // Three path d-strings, each derived from its two MotionValues.
  // useTransform is reactive — no polling, no re-renders.
  const d01 = useTransform(
    [yMVs[0], yMVs[1]],
    ([a, b]: number[]) => ready
      ? seg(xs[0], baseY + a, xs[1], baseY + b)
      : '',
  );
  const d12 = useTransform(
    [yMVs[1], yMVs[2]],
    ([a, b]: number[]) => ready
      ? seg(xs[1], baseY + a, xs[2], baseY + b)
      : '',
  );
  const d23 = useTransform(
    [yMVs[2], yMVs[3]],
    ([a, b]: number[]) => ready
      ? seg(xs[2], baseY + a, xs[3], baseY + b)
      : '',
  );

  const paths = [d01, d12, d23];

  if (!ready) return null;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none hidden lg:block overflow-visible"
      aria-hidden
    >
      <defs>
        {/* soft glow filter */}
        <filter id="lineGlow" x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {paths.map((d, i) => (
        <g key={i}>
          {/* glow shadow */}
          <motion.path
            d={d}
            fill="none"
            stroke="rgba(96,165,250,0.25)"
            strokeWidth={6}
            strokeLinecap="round"
            filter="url(#lineGlow)"
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
          />
          {/* main line — draws in left-to-right on first appear */}
          <motion.path
            d={d}
            fill="none"
            stroke="rgba(148,163,184,0.35)"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={visible
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
            }
            transition={{
              pathLength: { duration: 0.8, delay: 0.3 + i * 0.15, ease: 'easeInOut' },
              opacity:    { duration: 0.2, delay: 0.3 + i * 0.15 },
            }}
          />
        </g>
      ))}

      {/* anchor dot at each icon — dotY derived at top level, used here */}
      {ready && dotYs.map((dotY, i) => (
        <motion.circle
          key={i}
          cx={xs[i]}
          cy={dotY}
          r={3}
          fill="rgba(148,163,184,0.5)"
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.4 + i * 0.12 }}
        />
      ))}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────── */
export default function HowItWorks() {
  // One MotionValue per card — controls its Y lift
  const yMV0 = useMotionValue(0);
  const yMV1 = useMotionValue(0);
  const yMV2 = useMotionValue(0);
  const yMV3 = useMotionValue(0);
  const yMVs = [yMV0, yMV1, yMV2, yMV3];

  // Icon DOM refs for one-time position measurement
  const iconRef0 = useRef<HTMLDivElement>(null);
  const iconRef1 = useRef<HTMLDivElement>(null);
  const iconRef2 = useRef<HTMLDivElement>(null);
  const iconRef3 = useRef<HTMLDivElement>(null);
  const iconRefs = [iconRef0, iconRef1, iconRef2, iconRef3];

  const rowRef    = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: '-80px' });

  // Static icon positions (measured once, never change during hover)
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
      if (i === 0) newY = b.top  + b.height / 2 - base.top;
    });

    if (newXs.length === 4) {
      setXs(newXs);
      setBaseY(newY);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Wait for entrance animations to finish before measuring
    const id = setTimeout(measure, 900);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, [measure]);

  const { T } = useLang();
  const hw = T.howItWorks;

  const onEnter = (i: number) => animate(yMVs[i], -LIFT, SPRING);
  const onLeave = (i: number) => animate(yMVs[i], 0, SPRING);

  return (
    <section id="how-it-works" className="py-24 relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
            {hw.badge}
          </div>
          <h2 className="text-4xl font-bold text-white">
            {hw.title} <span className="gradient-text">{hw.accent}</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">{hw.subtitle}</p>
        </motion.div>

        {/* Grid + SVG overlay */}
        <div ref={rowRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">

          <ConnectorSVG
            yMVs={yMVs}
            xs={xs}
            baseY={baseY}
            visible={isInView}
          />

          {steps.map((step, i) => {
            const Icon    = step.icon;
            const iconRef = iconRefs[i];
            const yMV     = yMVs[i];

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
                whileHover={{ boxShadow: '0 0 40px rgba(37,99,235,0.18)' }}
              >
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0A0E1A] border border-white/15 flex items-center justify-center text-xs font-bold text-slate-500 z-10">
                  {i + 1}
                </div>

                {/* Icon — LINE ANCHOR */}
                <div
                  ref={iconRef}
                  className={`w-14 h-14 rounded-2xl border ${colorCls[step.color]} flex items-center justify-center mx-auto mb-4 mt-2 transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon size={24} />
                </div>

                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

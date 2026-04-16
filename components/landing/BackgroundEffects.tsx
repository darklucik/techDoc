'use client';
import { motion } from 'framer-motion';

const orbs = [
  {
    className: 'w-[600px] h-[600px] top-[-10%] left-[-10%]',
    color: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
    animate: { x: [0, 60, -30, 0], y: [0, -40, 50, 0], scale: [1, 1.1, 0.95, 1] },
    duration: 18,
  },
  {
    className: 'w-[500px] h-[500px] top-[30%] right-[-5%]',
    color: 'radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)',
    animate: { x: [0, -80, 40, 0], y: [0, 60, -20, 0], scale: [1, 1.15, 0.9, 1] },
    duration: 22,
  },
  {
    className: 'w-[700px] h-[700px] bottom-[-15%] left-[20%]',
    color: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
    animate: { x: [0, 50, -40, 0], y: [0, 80, -30, 0] },
    duration: 15,
  },
  {
    className: 'w-[400px] h-[400px] top-[60%] left-[-5%]',
    color: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)',
    animate: { x: [0, 40, -20, 0], y: [0, -50, 30, 0], scale: [1, 1.08, 0.97, 1] },
    duration: 20,
  },
  {
    className: 'w-[450px] h-[450px] top-[10%] right-[25%]',
    color: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
    animate: { x: [0, -30, 60, 0], y: [0, 40, -60, 0], scale: [1, 0.92, 1.12, 1] },
    duration: 25,
  },
];

export default function BackgroundEffects() {
  return (
    <div
      className="grid-bg"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${orb.className}`}
          style={{ background: orb.color }}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Noise overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: 0.4,
        }}
      />
    </div>
  );
}

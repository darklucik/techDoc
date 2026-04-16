'use client';
import { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimateOnScrollProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export default function AnimateOnScroll({
  children,
  delay = 0,
  direction = 'up',
  className,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const getInitial = () => {
    switch (direction) {
      case 'up':    return { opacity: 0, y: 40, x: 0 };
      case 'down':  return { opacity: 0, y: -40, x: 0 };
      case 'left':  return { opacity: 0, x: 40, y: 0 };
      case 'right': return { opacity: 0, x: -40, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitial()}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : getInitial()}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

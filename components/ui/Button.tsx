'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none',
  {
    variants: {
      variant: {
        primary:   'text-white hover:-translate-y-0.5 active:translate-y-0',
        secondary: 'text-white hover:-translate-y-0.5 active:translate-y-0',
        ghost:     'border hover:-translate-y-0.5 active:translate-y-0',
        danger:    'border',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-7 py-3.5 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  size    = 'md',
  children,
  loading,
  className = '',
  disabled,
  style,
  ...props
}: ButtonProps) {
  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(variant === 'primary'   && { background: 'var(--teal)',   boxShadow: '0 4px 20px var(--teal-glow)' }),
    ...(variant === 'secondary' && { background: 'var(--amber)',  boxShadow: '0 4px 20px var(--amber-glow)' }),
    ...(variant === 'ghost'     && { background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }),
    ...(variant === 'danger'    && { background: 'rgba(220,38,38,0.1)', borderColor: 'rgba(220,38,38,0.3)', color: 'var(--red)' }),
  };

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      style={inlineStyles}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

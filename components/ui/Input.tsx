'use client';
import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-3 rounded-xl transition-all duration-200 outline-none',
          'placeholder:text-[var(--text-dim)]',
          error
            ? 'border-red-500/50 focus:border-red-500'
            : 'focus:border-[var(--teal)]',
          className,
        )}
        style={{
          background:  'var(--bg-secondary)',
          border:      `1px solid ${error ? 'rgba(220,38,38,0.4)' : 'var(--border)'}`,
          color:       'var(--text-primary)',
        }}
        {...props}
      />
      {error && <p className="text-xs" style={{ color: 'var(--red)' }}>{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-3 rounded-xl resize-none transition-all duration-200 outline-none',
          'placeholder:text-[var(--text-dim)]',
          error
            ? 'border-red-500/50 focus:border-red-500'
            : 'focus:border-[var(--teal)]',
          className,
        )}
        style={{
          background: 'var(--bg-secondary)',
          border:     `1px solid ${error ? 'rgba(220,38,38,0.4)' : 'var(--border)'}`,
          color:      'var(--text-primary)',
        }}
        {...props}
      />
      {error && <p className="text-xs" style={{ color: 'var(--red)' }}>{error}</p>}
    </div>
  );
}

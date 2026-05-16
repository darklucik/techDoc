'use client';
import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useLang } from '@/components/LanguageContext';

export default function RequestForm() {
  const { T } = useLang();
  const f = T.form;

  const [form, setForm]     = useState({ name: '', device: '', phone: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())        e.name        = f.errorRequired;
    if (!form.device.trim())      e.device      = f.errorRequired;
    if (!form.phone.trim())       e.phone       = f.errorRequired;
    if (!form.description.trim()) e.description = f.errorRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || f.errorServer });
        setStatus('error');
      }
    } catch {
      setStatus('error');
      setErrors({ submit: f.errorServer });
    }
  };

  return (
    <div className="glass rounded-2xl p-8 max-w-xl w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{f.subtitle}</p>
      </div>

      {status === 'success' ? (
        <div className="text-center py-8 space-y-4">
          <CheckCircle size={48} className="mx-auto" style={{ color: 'var(--green)' }} />
          <div>
            <h4 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{f.successTitle}</h4>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{f.successSubtitle}</p>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="text-sm transition-colors"
            style={{ color: 'var(--teal)' }}
          >
            {f.sendAnother}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={f.nameLbl}   placeholder={f.namePh}   value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} error={errors.name} />
          <Input label={f.deviceLbl} placeholder={f.devicePh} value={form.device}
            onChange={e => setForm(p => ({ ...p, device: e.target.value }))} error={errors.device} />
          <Input label={f.phoneLbl}  placeholder={f.phonePh}  value={form.phone} type="tel"
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} error={errors.phone} />
          <Textarea label={f.descLbl} placeholder={f.descPh}  value={form.description} rows={3}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))} error={errors.description} />

          {errors.submit && (
            <div
              className="flex items-center gap-2 text-sm rounded-xl p-3"
              style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: 'var(--red)' }}
            >
              <AlertCircle size={16} />{errors.submit}
            </div>
          )}

          <Button type="submit" variant="primary" loading={status === 'loading'} className="w-full" size="lg">
            <Send size={16} />{f.submit}
          </Button>
          <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>{f.policy}</p>
        </form>
      )}
    </div>
  );
}

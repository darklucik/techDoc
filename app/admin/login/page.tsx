'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [form, setForm] = useState({ login: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка входа');
      }
    } catch {
      setError('Сервер недоступен');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] grid-bg flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto glow-blue">
            <Wrench size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Tech<span className="text-blue-400">Doc</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Панель управления</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Вход в систему</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Введите данные для доступа к панели
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Логин"
              placeholder="admin"
              value={form.login}
              onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
              autoComplete="username"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-400">Пароль</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all duration-200"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Войти
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}

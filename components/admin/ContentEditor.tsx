'use client';
import { useState } from 'react';
import { SiteContent } from '@/lib/types';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

export default function ContentEditor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'hero' | 'contacts'>('hero');

  const save = async () => {
    setStatus('saving');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      setStatus(res.ok ? 'saved' : 'error');
      if (res.ok) setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
    }
  };

  const tabs = [
    { key: 'hero', label: 'Главный экран' },
    { key: 'contacts', label: 'Контакты' },
  ] as const;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Tabs header */}
      <div className="flex border-b border-white/8">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === t.key
                ? 'text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.label}
            {activeTab === t.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6 space-y-5">
        {activeTab === 'hero' && (
          <>
            <Input
              label="Заголовок"
              value={content.hero.title}
              onChange={e => setContent(c => ({ ...c, hero: { ...c.hero, title: e.target.value } }))}
            />
            <Input
              label="Подзаголовок"
              value={content.hero.subtitle}
              onChange={e => setContent(c => ({ ...c, hero: { ...c.hero, subtitle: e.target.value } }))}
            />
            <Textarea
              label="Описание"
              rows={3}
              value={content.hero.description}
              onChange={e => setContent(c => ({ ...c, hero: { ...c.hero, description: e.target.value } }))}
            />
          </>
        )}

        {activeTab === 'contacts' && (
          <>
            <Input
              label="Телефон"
              value={content.contacts.phone}
              onChange={e => setContent(c => ({ ...c, contacts: { ...c.contacts, phone: e.target.value } }))}
            />
            <Input
              label="Email"
              value={content.contacts.email}
              onChange={e => setContent(c => ({ ...c, contacts: { ...c.contacts, email: e.target.value } }))}
            />
            <Input
              label="Адрес"
              value={content.contacts.address}
              onChange={e => setContent(c => ({ ...c, contacts: { ...c.contacts, address: e.target.value } }))}
            />
            <Input
              label="Режим работы"
              value={content.contacts.hours}
              onChange={e => setContent(c => ({ ...c, contacts: { ...c.contacts, hours: e.target.value } }))}
            />
          </>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={save} loading={status === 'saving'}>
            <Save size={15} />
            Сохранить изменения
          </Button>
          {status === 'saved' && (
            <div className="flex items-center gap-1.5 text-sm text-green-400">
              <CheckCircle size={15} /> Сохранено
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-1.5 text-sm text-red-400">
              <AlertCircle size={15} /> Ошибка сохранения
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SiteContent } from '@/lib/types';
import ContentEditor from '@/components/admin/ContentEditor';
import { RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/content')
      .then(res => {
        if (res.status === 401) {
          router.push('/admin/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setContent(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Контент сайта</h1>
        <p className="text-slate-500 text-sm mt-1">
          Редактирование текстов и контактной информации
        </p>
      </div>

      {loading ? (
        <div className="glass rounded-2xl p-12 flex items-center justify-center">
          <div className="text-slate-500 text-sm flex items-center gap-2">
            <RefreshCw size={16} className="animate-spin" />
            Загрузка...
          </div>
        </div>
      ) : content ? (
        <ContentEditor initial={content} />
      ) : null}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceRequest } from '@/lib/types';
import RequestsTable from '@/components/admin/RequestsTable';
import { RefreshCw } from 'lucide-react';

export default function RequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRequests = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/requests');
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    const data = await res.json();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, status: ServiceRequest['status']) => {
    const res = await fetch('/api/admin/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, status } : r))
      );
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Заявки</h1>
          <p className="text-slate-500 text-sm mt-1">Управление заявками клиентов</p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Обновить
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-2xl p-12 flex items-center justify-center">
          <div className="text-slate-500 text-sm flex items-center gap-2">
            <RefreshCw size={16} className="animate-spin" />
            Загрузка...
          </div>
        </div>
      ) : (
        <RequestsTable requests={requests} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}

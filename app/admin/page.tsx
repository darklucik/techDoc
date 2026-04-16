import { redirect } from 'next/navigation';
import { getStats, getRequests } from '@/lib/db';
import { checkAuth } from '@/lib/checkAuth';
import StatsCards from '@/components/admin/StatsCards';
import ActivityChart from '@/components/admin/ActivityChart';
import { ClipboardList, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  if (!(await checkAuth())) {
    redirect('/admin/login');
  }

  const stats = getStats();
  const requests = getRequests();

  const summary = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Дашборд</h1>
        <p className="text-slate-500 text-sm mt-1">
          Добро пожаловать в панель управления TechDoc
        </p>
      </div>

      {/* Stats */}
      <StatsCards summary={summary} />

      {/* Chart */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-slate-500" />
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
            Аналитика
          </h2>
        </div>
        <ActivityChart data={stats} />
      </div>

      {/* Recent requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-slate-500" />
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              Последние заявки
            </h2>
          </div>
          <a
            href="/admin/requests"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Все заявки →
          </a>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Клиент', 'Устройство', 'Дата', 'Статус'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentRequests.map(r => (
                <tr key={r.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3.5 text-white font-medium">{r.name}</td>
                  <td className="px-5 py-3.5 text-slate-400">{r.device}</td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {new Date(r.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      r.status === 'new' ? 'badge-new' :
                      r.status === 'in_progress' ? 'badge-progress' : 'badge-done'
                    }`}>
                      {r.status === 'new' ? 'Новая' : r.status === 'in_progress' ? 'В работе' : 'Выполнено'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

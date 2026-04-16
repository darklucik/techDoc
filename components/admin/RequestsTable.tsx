'use client';
import { useState } from 'react';
import { ServiceRequest } from '@/lib/types';
import { Search, ChevronRight, EyeOff, Eye } from 'lucide-react';
import RequestModal from './RequestModal';

const STATUS_CLASSES: Record<string, string> = {
  new:         'badge-new',
  in_progress: 'badge-progress',
  completed:   'badge-done',
};
const STATUS_LABELS: Record<string, string> = {
  new:         'Yangi',
  in_progress: 'Jarayonda',
  completed:   'Bajarildi',
};

export default function RequestsTable({
  requests,
  onStatusChange,
}: {
  requests: ServiceRequest[];
  onStatusChange: (id: string, status: ServiceRequest['status']) => void;
}) {
  const [search,         setSearch]         = useState('');
  const [filter,         setFilter]         = useState<string>('all');
  const [selected,       setSelected]       = useState<ServiceRequest | null>(null);
  const [hideCompleted,  setHideCompleted]  = useState(true);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch =
      r.name.toLowerCase().includes(q) ||
      r.device.toLowerCase().includes(q) ||
      r.phone.includes(q);
    const matchFilter = filter === 'all' || r.status === filter;
    const matchHide   = hideCompleted ? r.status !== 'completed' : true;
    return matchSearch && matchFilter && matchHide;
  });

  return (
    <>
      <div className="glass rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-white/8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Ism, qurilma yoki telefon bo'yicha qidirish..."
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none appearance-none cursor-pointer"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all"         className="bg-[#0F1628]">Barcha statuslar</option>
            <option value="new"         className="bg-[#0F1628]">Yangi</option>
            <option value="in_progress" className="bg-[#0F1628]">Jarayonda</option>
            <option value="completed"   className="bg-[#0F1628]">Bajarildi</option>
          </select>
          <button
            onClick={() => setHideCompleted(p => !p)}
            title={hideCompleted ? 'Bajarilganlarni ko\'rsatish' : 'Bajarilganlarni yashirish'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all duration-150 whitespace-nowrap
              ${hideCompleted
                ? 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
                : 'bg-green-500/10 border-green-500/25 text-green-400 hover:bg-green-500/15'
              }`}
          >
            {hideCompleted ? <EyeOff size={14} /> : <Eye size={14} />}
            {hideCompleted ? 'Bajarilganlar yashirilgan' : 'Barchasi ko\'rsatilmoqda'}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Mijoz', 'Qurilma', 'Telefon', 'Tavsif', 'Sana', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-600">
                    Arizalar topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr
                    key={r.id}
                    className="border-b border-white/5 hover:bg-white/4 transition-colors cursor-pointer group"
                    onClick={() => setSelected(r)}
                  >
                    <td className="px-5 py-4 font-medium text-white group-hover:text-blue-300 transition-colors">
                      {r.name}
                    </td>
                    <td className="px-5 py-4 text-slate-400">{r.device}</td>
                    <td className="px-5 py-4 text-slate-400">{r.phone}</td>
                    <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">{r.description}</td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="px-5 py-4">
                      {/* Stop propagation so clicking the select doesn't open modal */}
                      <select
                        value={r.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                          e.stopPropagation();
                          onStatusChange(r.id, e.target.value as ServiceRequest['status']);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer focus:outline-none appearance-none ${STATUS_CLASSES[r.status]}`}
                        style={{ background: 'transparent' }}
                      >
                        <option value="new"         className="bg-[#0F1628] text-white">Yangi</option>
                        <option value="in_progress" className="bg-[#0F1628] text-white">Jarayonda</option>
                        <option value="completed"   className="bg-[#0F1628] text-white">Bajarildi</option>
                      </select>
                    </td>
                    <td className="px-3 py-4">
                      <ChevronRight
                        size={15}
                        className="text-slate-700 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-150"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-white/8 text-xs text-slate-600 flex items-center gap-3">
          <span>{filtered.length} / {requests.length} ta ariza ko&apos;rsatilmoqda</span>
          {hideCompleted && requests.filter(r => r.status === 'completed').length > 0 && (
            <span className="text-slate-700">
              · {requests.filter(r => r.status === 'completed').length} ta bajarilgan yashirilgan
            </span>
          )}
        </div>
      </div>

      {/* Modal */}
      <RequestModal
        request={selected}
        onClose={() => setSelected(null)}
        onStatusChange={(id, status) => {
          onStatusChange(id, status);
          // Update local copy so modal reflects change immediately
          setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
        }}
      />
    </>
  );
}

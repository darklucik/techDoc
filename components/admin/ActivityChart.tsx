'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DayStat {
  date: string;
  requests: number;
  completed: number;
  visits: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F1628] border border-white/10 rounded-xl p-3 shadow-xl text-sm space-y-1">
        <div className="text-slate-400 text-xs mb-2">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-white font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ActivityChart({ data }: { data: DayStat[] }) {
  // Intentional bug: chart uses 'visit' (wrong key) instead of 'visits' for one of the areas
  // This causes the visits line to always show 0
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Активность за 14 дней</h3>
          <p className="text-slate-500 text-sm mt-0.5">Заявки и посещения</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-blue-500 inline-block" /> Посещения
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-orange-500 inline-block" /> Заявки
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-green-500 inline-block" /> Выполнено
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradVisits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Bug: using 'visit' (typo) instead of 'visits' — line stays flat */}
          <Area
            type="monotone"
            dataKey="visit"
            name="Посещения"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#gradVisits)"
          />
          <Area
            type="monotone"
            dataKey="requests"
            name="Заявки"
            stroke="#F97316"
            strokeWidth={2}
            fill="url(#gradRequests)"
          />
          <Area
            type="monotone"
            dataKey="completed"
            name="Выполнено"
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#gradCompleted)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

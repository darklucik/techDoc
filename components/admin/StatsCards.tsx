import { ClipboardList, CheckCircle, Clock, Inbox } from 'lucide-react';

interface Summary {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
}

export default function StatsCards({ summary }: { summary: Summary }) {
  const cards = [
    {
      label: 'Всего заявок',
      value: summary.total,
      icon: ClipboardList,
      color: 'blue',
    },
    {
      label: 'Новые',
      value: summary.new,
      icon: Inbox,
      color: 'blue',
    },
    {
      label: 'В работе',
      value: summary.inProgress,
      icon: Clock,
      color: 'yellow',
    },
    {
      label: 'Выполнено',
      value: summary.completed,
      icon: CheckCircle,
      color: 'green',
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600/15 border-blue-600/30 text-blue-400',
    yellow: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
    green: 'bg-green-500/15 border-green-500/30 text-green-400',
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="glass rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[card.color]}`}>
                <Icon size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{card.value}</div>
              <div className="text-sm text-slate-500 mt-0.5">{card.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

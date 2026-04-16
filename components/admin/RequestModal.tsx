'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Smartphone, Phone, FileText,
  Calendar, Clock, CheckCircle, Loader, Inbox, AlertTriangle,
} from 'lucide-react';
import { ServiceRequest } from '@/lib/types';

const STATUS_META = {
  new:         { label: 'Yangi',      cls: 'badge-new',      Icon: Inbox,       color: '#60A5FA' },
  in_progress: { label: 'Jarayonda', cls: 'badge-progress', Icon: Loader,      color: '#FDE047' },
  completed:   { label: 'Bajarildi', cls: 'badge-done',     Icon: CheckCircle, color: '#86EFAC' },
} as const;

interface Props {
  request: ServiceRequest | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ServiceRequest['status']) => void;
}

export default function RequestModal({ request, onClose, onStatusChange }: Props) {
  const [confirmComplete, setConfirmComplete] = useState(false);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmComplete) setConfirmComplete(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, confirmComplete]);

  // Reset confirm state when modal opens/closes
  useEffect(() => { setConfirmComplete(false); }, [request]);

  // Lock body scroll while open
  useEffect(() => {
    if (request) document.body.style.overflow = 'hidden';
    else         document.body.style.overflow  = '';
    return ()  => { document.body.style.overflow = ''; };
  }, [request]);

  const meta = request ? STATUS_META[request.status] : null;

  return (
    <AnimatePresence>
      {request && meta && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              className="relative w-full max-w-lg pointer-events-auto"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.94, y: 16  }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            >
              {/* Glow halo */}
              <div
                className="absolute -inset-px rounded-2xl opacity-30 blur-lg pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top, ${meta.color}40, transparent 70%)` }}
              />

              {/* Card */}
              <div className="relative rounded-2xl overflow-hidden"
                style={{ background: 'rgba(15,22,40,0.97)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Top accent line */}
                <div className="h-px w-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${meta.color}60, transparent)` }}
                />

                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-white/6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
                    >
                      <meta.Icon size={18} style={{ color: meta.color }} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">Ariza #{request.id.slice(-6)}</div>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${meta.cls}`}>
                        {meta.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/8 transition-all duration-150"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                  {/* Client + date row */}
                  <div className="grid grid-cols-2 gap-3">
                    <InfoBlock icon={User} label="Mijoz" value={request.name} color="#60A5FA" />
                    <InfoBlock
                      icon={Calendar}
                      label="Sana"
                      value={new Date(request.createdAt).toLocaleDateString('uz-UZ', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })}
                      color="#A78BFA"
                    />
                  </div>

                  {/* Device + phone row */}
                  <div className="grid grid-cols-2 gap-3">
                    <InfoBlock icon={Smartphone} label="Qurilma" value={request.device} color="#F97316" />
                    <InfoBlock icon={Phone}      label="Telefon" value={request.phone}  color="#34D399" />
                  </div>

                  {/* Time */}
                  <InfoBlock
                    icon={Clock}
                    label="Ariza vaqti"
                    value={new Date(request.createdAt).toLocaleTimeString('uz-UZ', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                    color="#94A3B8"
                    wide
                  />

                  {/* Description */}
                  <div
                    className="rounded-xl p-4 space-y-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide">
                      <FileText size={12} />
                      Muammo tavsifi
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {request.description}
                    </p>
                  </div>

                  {/* Status changer */}
                  <div
                    className="rounded-xl p-4 space-y-3"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Statusni o&apos;zgartirish</div>

                    <AnimatePresence mode="wait">
                      {confirmComplete ? (
                        /* ── Confirmation mini-panel ── */
                        <motion.div
                          key="confirm"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18 }}
                          className="rounded-xl p-4 space-y-3"
                          style={{ background: 'rgba(134,239,172,0.06)', border: '1px solid rgba(134,239,172,0.2)' }}
                        >
                          <div className="flex items-center gap-2 text-sm font-medium text-green-300">
                            <AlertTriangle size={15} className="text-yellow-400 flex-shrink-0" />
                            Buyurtmani bajarildi deb belgilaysizmi?
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Bu amal bajarilgandan keyin buyurtma ro&apos;yxatdan yashiriladi.
                          </p>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => {
                                onStatusChange(request.id, 'completed');
                                onClose();
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 transition-all duration-150"
                            >
                              <CheckCircle size={12} /> Ha, bajarildi
                            </button>
                            <button
                              onClick={() => setConfirmComplete(false)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 border border-white/8 hover:text-slate-300 hover:border-white/15 transition-all duration-150"
                            >
                              Bekor qilish
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        /* ── Normal status buttons ── */
                        <motion.div
                          key="buttons"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="flex gap-2 flex-wrap"
                        >
                          {(Object.keys(STATUS_META) as ServiceRequest['status'][]).map(s => {
                            const m   = STATUS_META[s];
                            const act = request.status === s;
                            return (
                              <button
                                key={s}
                                onClick={() => {
                                  if (s === 'completed' && request.status !== 'completed') {
                                    setConfirmComplete(true);
                                  } else {
                                    onStatusChange(request.id, s);
                                    onClose();
                                  }
                                }}
                                className={`
                                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                  border transition-all duration-150
                                  ${act
                                    ? m.cls + ' scale-105 shadow-sm'
                                    : 'text-slate-500 border-white/8 hover:border-white/15 hover:text-slate-300'
                                  }
                                `}
                              >
                                <m.Icon size={12} />
                                {m.label}
                                {act && <span className="w-1.5 h-1.5 rounded-full bg-current ml-0.5" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoBlock({
  icon: Icon, label, value, color, wide,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  value: string;
  color: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 space-y-1.5 ${wide ? 'col-span-2' : ''}`}
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wide">
        <Icon size={11} style={{ color }} />
        {label}
      </div>
      <div className="text-sm font-medium text-slate-100 truncate">{value}</div>
    </div>
  );
}

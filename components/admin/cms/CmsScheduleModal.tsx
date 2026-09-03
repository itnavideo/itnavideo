'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Globe, Check } from 'lucide-react';

interface CmsScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (scheduledIsoString: string) => void;
}

export default function CmsScheduleModal({ isOpen, onClose, onSchedule }: CmsScheduleModalProps) {
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('09:00');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!date || !time) return;
    const scheduledDateTime = new Date(`${date}T${time}:00`);
    onSchedule(scheduledDateTime.toISOString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold tracking-wide text-zinc-100">Schedule Automatic Publication</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Calendar size={14} className="text-amber-400" /> Publication Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-400" /> Publication Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400">
            <Globe size={14} className="text-zinc-500 flex-shrink-0" />
            <span>Timezone: Local System / IST (Auto-published via background cron)</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-900/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
          >
            <Check size={14} /> Schedule Post
          </button>
        </div>
      </div>
    </div>
  );
}


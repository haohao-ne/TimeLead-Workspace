import React from 'react';
import { Layout, CheckCircle2, Circle, TrendingUp, Clock } from 'lucide-react';
import { cn } from '../utils';

export function Dashboard({ tasks }: any) {
  const total = tasks.length;
  const done = tasks.filter((t: any) => t.status === 'Done').length;
  const progress = total ? Math.round((done/total)*100) : 0;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {[
        { label: 'TỔNG VIỆC', value: total, icon: Layout, color: 'text-blue-600' },
        { label: 'HOÀN THÀNH', value: done, icon: CheckCircle2, color: 'text-emerald-600' },
        { label: 'CHƯA XONG', value: total - done, icon: Circle, color: 'text-amber-600' },
        { label: 'TIẾN ĐỘ', value: progress + '%', icon: TrendingUp, color: 'text-indigo-600' },
        { label: 'THỜI GIAN', value: 'LIVE', icon: Clock, color: 'text-rose-600' },
      ].map((s, i) => (
        <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
          <s.icon className={cn("w-6 h-6 mb-2", s.color)} />
          <span className="text-2xl font-black text-neutral-800">{s.value}</span>
          <span className="text-[10px] font-black text-neutral-400 tracking-widest">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
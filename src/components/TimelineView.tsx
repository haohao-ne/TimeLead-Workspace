import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../utils';

export function TimelineView({ tasks }: { tasks: any[] }) {
  // Sắp xếp task theo giờ
  const sortedTasks = [...tasks].sort((a, b) => (a.starttime || '00:00').localeCompare(b.starttime || '00:00'));

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-6 border-b border-neutral-50 pb-4">
        <Clock className="w-4 h-4 text-[#00a9e0]" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-800">Task hôm nay</h3>
      </div>

      <div className="relative ml-2 border-l-2 border-neutral-50 pl-6 space-y-8">
        {sortedTasks.length > 0 ? sortedTasks.map((task, index) => (
          <div key={task.id} className="relative group">
            {/* Điểm mốc thời gian (Dot) */}
            <div className={cn(
              "absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-colors",
              task.status === 'Done' ? "bg-emerald-400" : "bg-[#00a9e0]"
            )} />
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#00a9e0] font-mono tracking-wider">
                {task.starttime || '09:00'}
              </span>
              <div className={cn(
                "p-3 rounded-[6px] border transition-all",
                task.status === 'Done' ? "bg-neutral-50 border-neutral-100" : "bg-white border-neutral-100 shadow-sm"
              )}>
                <p className={cn(
                  "text-[12px] font-medium leading-tight",
                  task.status === 'Done' ? "text-neutral-400 line-through" : "text-neutral-700"
                )}>
                  {task.title}
                </p>
                {task.client && (
                  <span className="text-[8px] font-bold uppercase text-amber-500 mt-1 block">
                    {task.client}
                  </span>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="py-10 text-center text-neutral-300 text-[10px] uppercase tracking-widest leading-relaxed">
            Chưa có mốc<br/>thời gian cụ thể
          </div>
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { cn } from '../utils';

export function WeeklyView({ allTasks, selectedDate, onDateChange, setView, filterStatus, filterPic, filterClient, filterPriority }: any) {
  const startDate = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3 h-[calc(100vh-250px)] animate-in fade-in duration-500">
      {weekDays.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        
        // LOGIC LỌC TỔNG HỢP: Đã nhận đủ 4 tham số
        const dayTasks = allTasks.filter((t: any) => 
          t.duedate === dateStr &&
          (filterStatus === 'All' || t.status === filterStatus) &&
          (filterPic === 'All' || (t.pics && t.pics.includes(filterPic))) &&
          (filterClient === 'All' || t.client === filterClient) &&
          (filterPriority === 'All' || t.priority === filterPriority)
        );

        return (
          <div key={dateStr} className={cn("bg-white rounded-[10px] border p-4 flex flex-col transition-all", selectedDate === dateStr ? "border-[#00a9e0] ring-1 ring-[#00a9e0]/20 shadow-sm" : "border-neutral-100")}>
            <div className="cursor-pointer mb-4" onClick={() => onDateChange(dateStr)}>
              <span className="text-[9px] font-normal text-neutral-400 uppercase tracking-widest">{format(day, 'EEE')}</span>
              <p className="text-[16px] font-medium text-neutral-700">{format(day, 'dd/MM')}</p>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
              {dayTasks.map((t: any) => (
                <div key={t.id} onClick={() => { onDateChange(dateStr); setView('timeline'); }} className={cn("text-[9px] font-normal p-2.5 rounded-[4px] border truncate hover:border-[#00a9e0]/40 transition-all cursor-pointer bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]", t.priority === 'High' ? "text-rose-500 border-rose-100" : "text-[#00a9e0] border-[#00a9e0]/10")}>
                  <div className="opacity-50 text-[7px] mb-0.5 font-mono">{t.starttime}</div>
                  {t.title}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
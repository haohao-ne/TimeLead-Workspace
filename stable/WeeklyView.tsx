import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { cn } from '../utils';

export function WeeklyView({ allTasks, selectedDate, onDateChange, setView, filterStatus, filterPic, filterClient, filterPriority, filterProject }: any) {
  const startDate = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 h-[calc(100vh-250px)] animate-in fade-in duration-500">
      {weekDays.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        
        // Logic lọc tổng hợp
        const dayTasks = allTasks.filter((t: any) => 
          t.duedate === dateStr &&
          (filterStatus === 'All' || t.status === filterStatus) &&
          (filterPic === 'All' || t.pic === filterPic) &&
          (filterClient === 'All' || t.client === filterClient) &&
          (filterPriority === 'All' || t.priority === filterPriority) &&
          (filterProject === 'All' || t.project === filterProject)
        );

        return (
          <div key={dateStr} className={cn("bg-white rounded-[24px] border p-4 flex flex-col transition-all", selectedDate === dateStr ? "border-indigo-500 ring-4 ring-indigo-50" : "border-neutral-100")}>
            <div className="cursor-pointer mb-4" onClick={() => onDateChange(dateStr)}>
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{format(day, 'EEE')}</span>
              <p className="text-lg font-black">{format(day, 'dd/MM')}</p>
            </div>
            
            <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {dayTasks.map((t: any) => (
                <div 
                  key={t.id} 
                  onClick={(e) => { e.stopPropagation(); onDateChange(dateStr); setView('daily'); }}
                  className={cn(
                    "text-[10px] font-black p-2.5 rounded-xl border truncate shadow-sm cursor-pointer hover:scale-105 transition-all",
                    t.priority === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-indigo-50 text-indigo-700 border-indigo-100"
                  )}
                >
                  <div className="opacity-50 text-[8px]">{t.starttime}</div>
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
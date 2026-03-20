import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils';

export function MonthlyView({ allTasks, selectedDate, onDateChange, setView }: any) {
  const currentMonth = new Date(selectedDate);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tighter">
          Tháng {format(currentMonth, 'MM / yyyy')}
        </h2>
        <div className="flex gap-2 bg-neutral-100 p-1.5 rounded-2xl">
          <button onClick={() => onDateChange(format(subMonths(currentMonth, 1), 'yyyy-MM-dd'))} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm hover:text-indigo-600"><ChevronLeft className="w-5 h-5"/></button>
          <button onClick={() => onDateChange(format(new Date(), 'yyyy-MM-dd'))} className="px-4 text-[10px] font-black uppercase tracking-widest">Hôm nay</button>
          <button onClick={() => onDateChange(format(addMonths(currentMonth, 1), 'yyyy-MM-dd'))} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm hover:text-indigo-600"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-neutral-100 border border-neutral-100 rounded-3xl overflow-hidden shadow-inner">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-neutral-50 py-4 text-center text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayTasks = allTasks.filter((t: any) => t.duedate === dateStr);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, new Date(selectedDate));

          return (
            <div 
              key={idx} 
              onClick={() => { onDateChange(dateStr); setView('timeline'); }}
              className={cn(
                "min-h-[140px] bg-white p-3 cursor-pointer transition-all hover:bg-indigo-50/30 group relative",
                !isSameMonth(day, monthStart) && "bg-neutral-50/50 opacity-40"
              )}
            >
              <div className={cn(
                "w-8 h-8 flex items-center justify-center text-xs font-black rounded-xl mb-2 transition-all",
                isToday ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : isSelected ? "bg-indigo-100 text-indigo-600" : "text-neutral-900",
                "group-hover:scale-110"
              )}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                {dayTasks.slice(0, 3).map((t: any) => (
                  <div key={t.id} className={cn(
                    "text-[9px] font-bold px-2 py-1 rounded-lg truncate border",
                    t.status === 'Done' ? "bg-neutral-50 text-neutral-400 border-neutral-100" : "bg-white border-indigo-100 text-indigo-700 shadow-sm"
                  )}>
                    {t.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[8px] font-black text-indigo-400 pl-2 uppercase">+{dayTasks.length - 3} tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
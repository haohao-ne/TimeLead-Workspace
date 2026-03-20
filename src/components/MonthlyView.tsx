import React, { useMemo } from 'react';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils';

export function MonthlyView({ allTasks, selectedDate, onDateChange, setView }: any) {
  const currentMonth = new Date(selectedDate);
  const monthStart = startOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="flex flex-col w-full bg-white relative">
      {/* HEADER CỐ ĐỊNH: Đứng yên bên trái, không slide theo grid */}
      <div className="sticky left-0 right-0 top-0 z-30 bg-white pb-3 pt-1 border-b border-neutral-50 md:border-none">
        <div className="flex items-center gap-3 px-2">
          {/* Nút Về Hôm Nay bên trái */}
          <button 
            onClick={() => onDateChange(format(new Date(), 'yyyy-MM-dd'))} 
            className="px-4 py-2 bg-[#00a9e0]/10 border border-[#00a9e0]/20 text-[#00a9e0] text-[9px] font-bold uppercase rounded-full shadow-sm active:scale-95 flex-shrink-0"
          >
            VỀ HÔM NAY
          </button>

          {/* Cụm điều hướng Tháng sát bên cạnh */}
          <div className="flex items-center gap-2 bg-neutral-50 p-0.5 rounded-full border border-neutral-100">
            <button onClick={() => onDateChange(format(subMonths(currentMonth, 1), 'yyyy-MM-dd'))} className="p-1.5 active:scale-90 transition-transform">
              <ChevronLeft className="w-3.5 h-3.5 text-neutral-400" />
            </button>
            <h2 className="text-[14px] md:text-[18px] font-bold text-neutral-800 uppercase tracking-tighter px-1 min-w-[75px] text-center">
              {format(currentMonth, 'MM / yyyy')}
            </h2>
            <button onClick={() => onDateChange(format(addMonths(currentMonth, 1), 'yyyy-MM-dd'))} className="p-1.5 active:scale-90 transition-transform">
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* GRID LỊCH: Ép 7 cột vừa khít 100% Device */}
      <div className="grid grid-cols-7 w-full border-l border-neutral-50 overflow-hidden" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className={cn(
            "py-1.5 border-r border-b border-neutral-50 text-center text-[9px] font-bold bg-neutral-50/20",
            i === 5 && "text-emerald-500", // T7 Emerald
            i === 6 && "text-amber-600"    // CN Coffee Gold
          )}>
            {d}
          </div>
        ))}
        
        {calendarDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate === dateStr;
          const dayTasks = allTasks.filter((t: any) => t.duedate === dateStr);
          const dayOfWeek = getDay(day);

          return (
            <div 
              key={dateStr}
              onClick={() => { onDateChange(dateStr); if (window.innerWidth < 768) setView('daily'); }}
              className={cn(
                "h-[70px] md:h-[130px] border-r border-b border-neutral-50 transition-all cursor-pointer relative overflow-hidden",
                !isCurrentMonth ? "bg-neutral-50/10 opacity-20" : "bg-white",
                isSelected && "bg-[#00a9e0]/5 ring-1 ring-[#00a9e0] ring-inset z-10",
                isCurrentMonth && dayOfWeek === 6 && !isSelected && "bg-emerald-50/5",
                isCurrentMonth && dayOfWeek === 0 && !isSelected && "bg-amber-50/5"
              )}
            >
              <span className={cn(
                "text-[10px] md:text-[14px] font-bold block p-1 leading-none",
                isToday ? "text-[#00a9e0]" : "text-neutral-500"
              )}>
                {format(day, 'd')}
              </span>

              <div className="flex flex-col gap-0.5 px-0.5">
                {dayTasks.slice(0, 2).map((t: any) => (
                  <div key={t.id} className="text-[6px] md:text-[9px] px-1 py-0.5 rounded-[1px] truncate bg-[#00a9e0]/5 text-[#00a9e0] border border-[#00a9e0]/10">
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
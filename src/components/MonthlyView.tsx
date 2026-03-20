import React from 'react';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils';

export function MonthlyView({ allTasks, selectedDate, onDateChange, setView }: any) {
  const currentMonth = new Date(selectedDate);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="space-y-8">
      {/* UI NAV MỚI: Mũi tên nằm sát Tháng */}
      <div className="flex items-center justify-between border-b border-neutral-50 pb-6">
        <div className="flex items-center gap-6">
          <h2 className="text-[26px] font-medium tracking-tighter text-neutral-800 uppercase">
            Tháng {format(currentMonth, 'MM / yyyy')}
          </h2>
          <div className="flex items-center gap-1 bg-neutral-100/50 p-1 rounded-[6px]">
            <button 
              onClick={() => onDateChange(format(subMonths(currentMonth, 1), 'yyyy-MM-dd'))}
              className="p-1.5 hover:bg-white hover:text-[#00a9e0] rounded-[4px] text-neutral-400 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDateChange(format(addMonths(currentMonth, 1), 'yyyy-MM-dd'))}
              className="p-1.5 hover:bg-white hover:text-[#00a9e0] rounded-[4px] text-neutral-400 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button 
          onClick={() => onDateChange(format(new Date(), 'yyyy-MM-dd'))}
          className="px-6 py-2 bg-neutral-50 border border-neutral-100 rounded-[4px] text-[11px] font-medium uppercase tracking-widest text-neutral-500 hover:text-[#00a9e0] transition-all"
        >
          Hôm nay
        </button>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-neutral-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="p-4 border-r border-b border-neutral-50 text-center text-[10px] font-medium text-neutral-300 uppercase tracking-widest bg-neutral-50/30">
            {d}
          </div>
        ))}
        
        {calendarDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const dayTasks = allTasks.filter((t: any) => t.duedate === dateStr);

          return (
            <div 
              key={dateStr}
              onClick={() => onDateChange(dateStr)}
              className={cn(
                "min-h-[140px] p-4 border-r border-b border-neutral-50 transition-all cursor-pointer",
                !isCurrentMonth ? "bg-neutral-50/20 opacity-30" : "bg-white hover:bg-[#00a9e0]/5",
                selectedDate === dateStr && "ring-1 ring-inset ring-[#00a9e0]"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={cn(
                  "text-[14px] font-medium w-8 h-8 flex items-center justify-center rounded-[4px]",
                  isToday ? "bg-[#00a9e0] text-white" : "text-neutral-500"
                )}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="space-y-1.5">
                {dayTasks.slice(0, 3).map((t: any) => (
                  <div key={t.id} className="text-[9px] font-normal px-2 py-1 rounded-[2px] truncate bg-[#00a9e0]/5 text-[#00a9e0] border border-[#00a9e0]/10">
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
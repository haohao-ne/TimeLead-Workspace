import React, { useMemo } from 'react';
import { format, addDays, subDays, getDay } from 'date-fns';
import { cn } from '../utils';
import { Clock, Coffee, Sparkles } from 'lucide-react';

export function WeeklyView({ allTasks, selectedDate, onDateChange, setView, filterStatus, filterPic, filterClient, filterPriority, filterCreator, teamMembers, clients }: any) {
  
  // LOGIC 1-1-5: Hôm qua (1) - Hôm nay (1) - 5 ngày tới (5)
  const weekDays = useMemo(() => {
    const anchorDate = new Date(selectedDate);
    const startDate = subDays(anchorDate, 1); 
    return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3 h-auto md:h-[calc(100vh-250px)] animate-in fade-in duration-500 pb-10 md:pb-0">
      {weekDays.map((day, index) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const isSelected = selectedDate === dateStr;
        
        // Xác định thứ (0: CN, 6: T7)
        const dayOfWeek = getDay(day);
        const isSaturday = dayOfWeek === 6;
        const isSunday = dayOfWeek === 0;

        const dayTasks = allTasks.filter((t: any) => 
          t.duedate === dateStr &&
          (filterStatus === 'All' || t.status === filterStatus) &&
          (filterPic === 'All' || (t.pics && t.pics.includes(filterPic))) &&
          (filterClient === 'All' || t.client === filterClient) &&
          (filterPriority === 'All' || t.priority === filterPriority) &&
          (filterCreator === 'All' || t.user_email === filterCreator || t.creator_name === filterCreator)
        );

        return (
          <div 
            key={dateStr} 
            className={cn(
              "bg-white rounded-[10px] border p-4 flex flex-col transition-all shadow-sm min-h-[160px] md:min-h-0", 
              // Hệ thống màu sắc Multimedia
              isSelected ? "border-[#00a9e0] ring-1 ring-[#00a9e0]/10 shadow-md z-10 scale-[1.01] md:scale-100" : 
              isSaturday ? "border-emerald-100 bg-emerald-50/20" : 
              isSunday ? "border-amber-100 bg-amber-50/20" : // Coffee Gold Background
              "border-neutral-100"
            )}
          >
            <div className="cursor-pointer mb-4 flex justify-between items-start" onClick={() => onDateChange(dateStr)}>
              <div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-[0.2em]",
                  isSelected ? "text-[#00a9e0]" : 
                  isSaturday ? "text-emerald-500" : 
                  isSunday ? "text-amber-600" : // Coffee Gold Text
                  "text-neutral-400"
                )}>
                  {format(day, 'EEE')}
                </span>
                <p className={cn(
                  "text-[16px] md:text-[18px] font-semibold tracking-tight",
                  isSelected ? "text-[#00a9e0]" : 
                  isSaturday ? "text-emerald-600" : 
                  isSunday ? "text-amber-700" : // Đậm hơn một chút để dễ đọc
                  "text-neutral-700"
                )}>
                  {format(day, 'dd/MM')}
                </p>
              </div>
              
              {/* Decor Icons */}
              {isSelected ? (
                 <div className="w-1.5 h-1.5 bg-[#00a9e0] rounded-full animate-pulse mt-1" />
              ) : isSaturday ? (
                <Sparkles className="w-3 h-3 text-emerald-300" />
              ) : isSunday ? (
                <Coffee className="w-4 h-4 text-amber-500" /> // Coffee Icon màu Gold
              ) : null}
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
              {dayTasks.map((t: any) => (
                <div 
                  key={t.id} 
                  onClick={() => { onDateChange(dateStr); setView('timeline'); }} 
                  className={cn(
                    "text-[9px] font-normal p-2.5 rounded-[4px] border truncate hover:border-[#00a9e0]/40 transition-all cursor-pointer bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:scale-95", 
                    t.priority === 'High' ? "text-rose-500 border-rose-100 bg-rose-50/10" : 
                    isSaturday ? "text-emerald-600 border-emerald-100/50" :
                    isSunday ? "text-amber-700 border-amber-200/50" : // Task border Gold
                    "text-[#00a9e0] border-[#00a9e0]/10"
                  )}
                >
                  <div className="opacity-60 text-[7px] mb-0.5 font-mono font-bold tracking-tighter">
                    {t.starttime || '09:00'}
                  </div>
                  <div className="truncate font-medium">{t.title}</div>
                </div>
              ))}
              
              {dayTasks.length === 0 && (
                <div className="h-full min-h-[60px] flex items-center justify-center opacity-10 text-neutral-400 grayscale">
                  <Clock className={cn("w-6 h-6", isSaturday && "text-emerald-400", isSunday && "text-amber-400")} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
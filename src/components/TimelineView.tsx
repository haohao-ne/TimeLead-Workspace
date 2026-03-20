import React from 'react';
import { cn } from '../utils';

const HOURS = Array.from({ length: 14 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

export function TimelineView({ tasks }: { tasks: any[] }) {
  return (
    <div className="flex flex-col h-full bg-white relative">
      {HOURS.map((hour) => {
        // Lọc các task bắt đầu vào đúng khung giờ này
        const tasksInHour = tasks.filter(t => t.starttime?.startsWith(hour.split(':')[0]));

        return (
          <div key={hour} className="flex border-b border-neutral-50 min-h-[60px] relative group">
            <div className="w-16 py-2 px-3 text-[10px] font-bold text-neutral-300 border-r border-neutral-50 bg-neutral-50/30">
              {hour}
            </div>
            <div className="flex-1 p-1 flex flex-col gap-1">
              {tasksInHour.map((task) => (
                <div 
                  key={task.id} 
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[9px] font-bold truncate shadow-sm border animate-in slide-in-from-left-2",
                    task.priority === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                  )}
                >
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
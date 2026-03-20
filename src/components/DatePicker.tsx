import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export function DatePicker({ selectedDate, onDateChange }: any) {
  const dateObj = new Date(selectedDate);
  return (
    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-sm">
      <button onClick={() => onDateChange(format(subDays(dateObj, 1), 'yyyy-MM-dd'))} className="p-1 hover:bg-neutral-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
      <span className="text-sm font-bold text-neutral-700 min-w-[100px] text-center">{format(dateObj, 'dd/MM/yyyy')}</span>
      <button onClick={() => onDateChange(format(addDays(dateObj, 1), 'yyyy-MM-dd'))} className="p-1 hover:bg-neutral-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
    </div>
  );
}

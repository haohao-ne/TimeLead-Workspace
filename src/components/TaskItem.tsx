import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Clock, Play, Square, Trash2, Copy, ChevronDown, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils';

export function TaskItem({ task, onUpdate, onDelete, onDuplicate, teamMembers, clients }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(task.actualtime || 0);
  const [isPicDropdownOpen, setIsPicDropdownOpen] = useState(false);
  const picDropdownRef = useRef<HTMLDivElement>(null);
  
  // Logic Fix lỗi gõ tiếng Việt: Dùng state nội bộ
  const [localTitle, setLocalTitle] = useState(task.title || '');
  const [localDesc, setLocalDesc] = useState(task.description || '');

  useEffect(() => { setElapsed(task.actualtime || 0); }, [task.actualtime]);
  useEffect(() => { 
    setLocalTitle(task.title || ''); 
    setLocalDesc(task.description || ''); 
  }, [task.title, task.description]);

  useEffect(() => {
    let timer: any;
    if (isRunning) timer = setInterval(() => setElapsed((p: number = 0) => p + 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (picDropdownRef.current && !picDropdownRef.current.contains(event.target as Node)) {
        setIsPicDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDone = task.status === 'Done';
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sc = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sc}`;
  };

  const togglePic = (name: string) => {
    const currentPics = task.pics || [];
    const newPics = currentPics.includes(name) ? currentPics.filter((p: string) => p !== name) : [...currentPics, name];
    onUpdate({ pics: newPics });
  };

  return (
    <div className={cn(
      "bg-white rounded-[7px] border transition-all duration-300 shadow-sm overflow-hidden mb-3", 
      isExpanded ? "border-[#00a9e0] shadow-md ring-1 ring-[#00a9e0]/10" : "border-neutral-100 hover:border-[#00a9e0]/20"
    )}>
      {/* HEADER */}
      <div className="flex items-center justify-between p-3 md:p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (isRunning) onUpdate({ actualtime: elapsed }); 
              onUpdate({ status: isDone ? 'Not Started' : 'Done' }); 
            }} 
            className={cn("flex-shrink-0 transition-colors", isDone ? "text-emerald-400" : "text-neutral-200")}
          >
            {isDone ? <CheckCircle2 className="w-6 h-6 md:w-5 md:h-5" /> : <Circle className="w-6 h-6 md:w-5 md:h-5" />}
          </button>
          
          <div className="flex flex-col truncate">
            <span className={cn("text-[14px] md:text-[15px] font-medium text-neutral-700 truncate", isDone && "line-through text-neutral-300")}>
              {task.title || 'Việc mới'}
            </span>
            <div className="flex gap-2 mt-1">
              <span className="bg-[#00a9e0]/10 text-[#00a9e0] px-1.5 py-0.5 rounded-[2px] text-[8px] md:text-[9px] font-bold uppercase tracking-wider">{task.starttime || '09:00'}</span>
              <span className={cn("px-1.5 py-0.5 rounded-[2px] border text-[8px] md:text-[9px] font-bold uppercase tracking-wider", isDone ? "bg-neutral-50 text-neutral-400 border-neutral-100" : "bg-amber-50 text-amber-500 border-amber-100")}>{task.status}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 ml-2">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (isRunning) onUpdate({ actualtime: elapsed }); 
              setIsRunning(!isRunning); 
            }} 
            className={cn("flex flex-col items-center justify-center min-w-[70px] md:min-w-[75px] px-2 py-2 md:py-1.5 rounded-[4px] border transition-all active:scale-95", isRunning ? "bg-rose-500 text-white border-rose-600 animate-pulse" : "bg-neutral-50 text-neutral-400 border-neutral-100")}
          >
            {isRunning ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span className="font-mono tabular-nums text-[9px] md:text-[10px] font-bold mt-0.5 leading-none">{formatTime(elapsed)}</span>
          </button>
          <ChevronDown className={cn("w-5 h-5 md:w-4 md:h-4 text-neutral-300 transition-transform", isExpanded && "rotate-180")} />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 md:p-6 pt-0 bg-white border-t border-neutral-50 space-y-5 animate-in fade-in duration-300">
          <div className="space-y-5 pt-5">
            <div className="space-y-1.5">
              <label className="text-[10px] md:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Tên công việc</label>
              <input type="text" value={localTitle} onChange={(e) => setLocalTitle(e.target.value)} onBlur={() => onUpdate({ title: localTitle })} className="w-full bg-neutral-50/30 border border-neutral-100 rounded-[4px] px-4 py-3 md:py-2.5 font-medium text-[16px] md:text-[17px] text-neutral-700 outline-none focus:border-[#00a9e0]" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] md:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Mô tả & Brief chi tiết</label>
              <textarea rows={4} value={localDesc} onChange={(e) => setLocalDesc(e.target.value)} onBlur={() => onUpdate({ description: localDesc })} className="w-full bg-neutral-50/30 border border-neutral-100 rounded-[4px] p-4 text-[15px] md:text-[16px] font-normal outline-none focus:border-[#00a9e0] resize-none" placeholder="Mô tả chi tiết công việc..." />
            </div>

            <div className="space-y-5 border-t border-dashed border-neutral-100 pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative" ref={picDropdownRef}>
                  <label className="text-[10px] md:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Nhân sự (Multi-PIC)</label>
                  <div onClick={() => setIsPicDropdownOpen(!isPicDropdownOpen)} className="w-full bg-neutral-50 border border-neutral-100 rounded-[4px] px-3 py-3 md:py-2.5 text-[13px] font-medium text-neutral-600 cursor-pointer flex justify-between items-center">
                    <span className="truncate">{task.pics?.length > 0 ? task.pics.join(', ') : 'Chọn PIC'}</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </div>
                  {isPicDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-neutral-100 shadow-2xl rounded-[4px] max-h-[200px] overflow-y-auto">
                      {teamMembers?.map((m: string) => (
                        <div key={m} onClick={() => togglePic(m)} className="flex items-center justify-between px-4 py-3 hover:bg-[#00a9e0]/5 cursor-pointer">
                          <span className={cn("text-[13px]", task.pics?.includes(m) ? "text-[#00a9e0] font-bold" : "text-neutral-600")}>{m}</span>
                          {task.pics?.includes(m) && <Check className="w-4 h-4 text-[#00a9e0]" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] md:text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Client / Dự án</label>
                  <select value={task.client || ''} onChange={(e) => onUpdate({ client: e.target.value })} className="w-full bg-neutral-50 border border-neutral-100 rounded-[4px] px-3 py-3 md:py-2.5 text-[13px] font-medium outline-none">
                    <option value="">Chọn Client</option>
                    {clients?.map((c: any) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] md:text-[11px] font-bold text-[#00a9e0] uppercase tracking-widest">Giờ hoàn thành</label>
                   <input type="time" value={task.starttime || ''} onChange={(e) => onUpdate({ starttime: e.target.value })} className="w-full bg-neutral-50 border border-neutral-100 rounded-[4px] px-2 py-3 md:py-2 text-[13px] font-bold text-[#00a9e0]" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] md:text-[11px] font-bold text-rose-400 uppercase italic tracking-widest">Ngày hoàn thành</label>
                   <input type="date" required value={task.duedate || ''} onChange={(e) => onUpdate({ duedate: e.target.value })} className="w-full bg-white border border-rose-100 rounded-[4px] px-2 py-3 md:py-2 text-[12px] md:text-[13px] font-bold text-rose-500" />
                </div>
              </div>
            </div>

            {/* Footer: Giữ nguyên Created by: you cho bản Clone */}
            <div className="flex justify-between items-center text-[10px] font-medium text-neutral-300 uppercase border-t pt-4">
                <span>Created by: <span className="text-[#00a9e0] font-medium lowercase">you</span></span>
                <span>{task.created_at ? format(new Date(task.created_at), 'HH:mm - dd/MM/yyyy') : '--:--'}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4 pb-2">
            <button onClick={onDuplicate} className="p-4 md:p-3 bg-white border border-neutral-100 text-neutral-300 hover:text-[#00a9e0] rounded-[4px]"><Copy className="w-5 h-5 md:w-4 md:h-4 mx-auto" /></button>
            <button onClick={onDelete} className="p-4 md:p-3 bg-white border border-neutral-100 text-neutral-300 hover:text-rose-400 rounded-[4px]"><Trash2 className="w-5 h-5 md:w-4 md:h-4 mx-auto" /></button>
            <button onClick={() => { onUpdate({ actualtime: elapsed }); setIsExpanded(false); }} className="flex-1 bg-[#00a9e0] text-white py-4 rounded-[4px] text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#00a9e0]/10">Cập nhật</button>
          </div>
        </div>
      )}
    </div>
  );
}
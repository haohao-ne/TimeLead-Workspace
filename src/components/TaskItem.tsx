import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Clock, Play, Square, Trash2, Copy, ChevronDown, User
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils';

export function TaskItem({ task, onUpdate, onDelete, onDuplicate, teamMembers, clients }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(task.actualtime || 0);
  const [localDesc, setLocalDesc] = useState(task.description || '');

  // Đồng bộ thời gian từ Database khi có thay đổi từ bên ngoài
  useEffect(() => { 
    setElapsed(task.actualtime || 0); 
  }, [task.actualtime]);

  useEffect(() => { setLocalDesc(task.description || ''); }, [task.description]);

  // Logic đếm giây Stopwatch
  useEffect(() => {
    let timer: any;
    if (isRunning) {
      timer = setInterval(() => setElapsed((p: number) => p + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const isDone = task.status === 'Done';
  const createdTime = task.created_at ? format(new Date(task.created_at), 'HH:mm - dd/MM/yyyy') : 'N/A';
  
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sc = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sc}`;
  };

  const handleStopwatchToggle = () => {
    if (isRunning) {
      // Khi nhấn STOP: Lưu ngay lập tức vào Database
      onUpdate({ actualtime: elapsed });
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className={cn(
      "bg-white rounded-[7px] border transition-all duration-300 shadow-sm overflow-hidden mb-3",
      isExpanded ? "border-[#00a9e0] shadow-md ring-1 ring-[#00a9e0]/10" : "border-neutral-100 hover:border-[#00a9e0]/20"
    )}>
      {/* 1. HEADER (Font 14px Regular) */}
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (isRunning) handleStopwatchToggle();
              onUpdate({ status: isDone ? 'Not Started' : 'Done' }); 
            }} 
            className={isDone ? "text-emerald-400" : "text-neutral-200"}
          >
            {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          </button>
          <div className="flex flex-col truncate">
            <span className={cn("text-[14px] font-medium text-neutral-700", isDone && "line-through text-neutral-300")}>{task.title || 'Việc mới'}</span>
            <div className="flex gap-2 mt-1 text-[8px] font-medium uppercase">
              <span className="bg-[#00a9e0]/10 text-[#00a9e0] px-1.5 py-0.5 rounded-[2px]">{task.starttime} - {task.endtime}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
          {/* Nút Stopwatch: Fix logic nhấn là chạy/lưu */}
          <button 
            onClick={handleStopwatchToggle}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[11px] font-medium transition-all border",
              isRunning ? "bg-rose-500 text-white animate-pulse border-rose-600" : "bg-neutral-50 text-neutral-400 border-neutral-100 font-mono"
            )}
          >
            {isRunning ? <Square className="w-2.5 h-2.5 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{formatTime(elapsed)}</span>
          </button>
          <ChevronDown className={cn("w-4 h-4 text-neutral-300 transition-transform", isExpanded && "rotate-180")} />
        </div>
      </div>

      {/* 2. DETAIL PANEL (Font Size +30% & Vertical Stack) */}
      {isExpanded && (
        <div className="p-6 pt-0 bg-white border-t border-neutral-50 space-y-6 animate-in fade-in duration-300">
          <div className="space-y-5 pt-6">
            <div className="space-y-2">
              <label className="text-[12px] font-normal text-neutral-400 uppercase tracking-widest">Tên công việc</label>
              <input type="text" value={task.title} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full bg-neutral-50/30 border border-neutral-100 rounded-[4px] px-4 py-3 font-medium text-[17px] text-neutral-700 outline-none focus:border-[#00a9e0]" />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-normal text-neutral-400 uppercase tracking-widest">Mô tả & Brief chi tiết</label>
              <textarea rows={5} value={localDesc} onChange={(e) => setLocalDesc(e.target.value)} onBlur={() => onUpdate({ description: localDesc })} className="w-full bg-neutral-50/30 border border-neutral-100 rounded-[4px] p-4 text-[16px] font-normal text-neutral-600 outline-none focus:border-[#00a9e0] resize-none" placeholder="Nhập yêu cầu tại đây..." />
            </div>

            <div className="space-y-5 border-t border-dashed border-neutral-100 pt-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-normal text-neutral-400 uppercase tracking-widest">Nhân sự (PIC)</label>
                  <select value={task.pics?.[0] || ''} onChange={(e) => onUpdate({ pics: [e.target.value] })} className="w-full bg-neutral-50 border-none rounded-[4px] px-2 py-2.5 text-[13px] font-medium text-neutral-600 outline-none"><option value="">Chọn PIC</option>{teamMembers?.map((m: any) => <option key={m} value={m}>{m}</option>)}</select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-normal text-neutral-400 uppercase tracking-widest">Client / Dự án</label>
                  <select value={task.client || ''} onChange={(e) => onUpdate({ client: e.target.value })} className="w-full bg-neutral-50 border-none rounded-[4px] px-2 py-2.5 text-[13px] font-medium text-neutral-600 outline-none"><option value="">Chọn Client</option>{clients?.map((c: any) => <option key={c} value={c}>{c}</option>)}</select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[11px] font-medium text-[#00a9e0] uppercase">Giờ làm việc</label>
                   <div className="flex gap-2">
                      <input type="time" value={task.starttime || ''} onChange={(e) => onUpdate({ starttime: e.target.value })} className="flex-1 bg-neutral-50 rounded-[4px] px-2 py-2 text-[13px] font-medium outline-none" />
                      <input type="time" value={task.endtime || ''} onChange={(e) => onUpdate({ endtime: e.target.value })} className="flex-1 bg-neutral-50 rounded-[4px] px-2 py-2 text-[13px] font-medium outline-none" />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-medium text-rose-400 uppercase italic">Hạn chót</label>
                   <input type="date" required value={task.duedate || ''} onChange={(e) => onUpdate({ duedate: e.target.value })} className="w-full bg-white border border-rose-100 rounded-[4px] px-3 py-2 text-[13px] font-medium outline-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] font-normal text-neutral-300 uppercase pt-2">
                <span>Created by: <span className="text-[#00a9e0] font-medium">Hạo Manager</span></span>
                <span>{createdTime}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4 pb-2">
            <button onClick={onDuplicate} className="p-3 bg-white border border-neutral-100 text-neutral-300 hover:text-[#00a9e0] rounded-[4px] transition-all"><Copy className="w-4 h-4 mx-auto" /></button>
            <button onClick={onDelete} className="p-3 bg-white border border-neutral-100 text-neutral-300 hover:text-rose-400 rounded-[4px] transition-all"><Trash2 className="w-4 h-4 mx-auto" /></button>
            <button 
              onClick={() => {
                onUpdate({ actualtime: elapsed }); // Chốt số giây trước khi đóng
                setIsExpanded(false);
              }} 
              className="flex-1 bg-[#00a9e0] text-white py-4 rounded-[4px] text-[13px] font-medium uppercase tracking-[0.2em] shadow-lg shadow-[#00a9e0]/10 hover:bg-[#0088b5] transition-all"
            >
              Cập nhật
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
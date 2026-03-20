import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Clock, Play, Square, Trash2, Copy, 
  ChevronDown, ChevronUp, User
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils';

export function TaskItem({ task, onUpdate, onDelete, onDuplicate, teamMembers, clients }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(task.actualtime || 0);

  useEffect(() => {
    let timer: any;
    if (isRunning) {
      timer = setInterval(() => setElapsed((p: number) => p + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const isDone = task.status === 'Done';
  const createdTime = task.created_at ? format(new Date(task.created_at), 'HH:mm - dd/MM/yyyy') : 'N/A';

  // Helper format thời gian HH:mm:ss
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Logic màu sắc Trạng thái
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Not Started': return "text-amber-600 border-amber-200 bg-amber-50"; 
      case 'In Progress': return "text-emerald-600 border-emerald-200 bg-emerald-50"; 
      case 'Done': return "text-neutral-400 border-neutral-200 bg-neutral-50"; 
      default: return "text-neutral-600 border-neutral-200 bg-white";
    }
  };

  // Logic màu sắc Ưu tiên
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Low': return "text-emerald-600 border-emerald-200 bg-emerald-50"; 
      case 'Medium': return "text-amber-600 border-amber-200 bg-amber-50"; 
      case 'High': return "text-rose-600 border-rose-200 bg-rose-50"; 
      default: return "text-neutral-600 border-neutral-200 bg-white";
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-[32px] border transition-all duration-300 shadow-sm overflow-hidden mb-4",
      isExpanded ? "border-indigo-500 shadow-xl" : "border-neutral-100 hover:border-indigo-200"
    )}>
      
      {/* 1. HEADER TÓM TẮT */}
      <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-5 flex-1 overflow-hidden">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              // Tự động dừng Timer nếu bấm Done
              if (!isDone && isRunning) {
                setIsRunning(false);
                onUpdate({ actualtime: elapsed, status: 'Done' });
              } else {
                onUpdate({ status: isDone ? 'Not Started' : 'Done' });
              }
            }} 
            className={isDone ? "text-emerald-500" : "text-neutral-200"}
          >
            {isDone ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
          </button>
          
          <div className="flex flex-col truncate">
            <span className={cn("text-[16px] font-black", isDone && "line-through text-neutral-400")}>
              {task.title || 'Việc mới'}
            </span>
            <div className="flex gap-2 mt-1 text-[10px] font-black uppercase">
              <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg">{task.starttime} - {task.endtime}</span>
              <span className={cn("px-2.5 py-1 rounded-lg border", getStatusStyle(task.status))}>{task.status}</span>
              <span className={cn("px-2.5 py-1 rounded-lg border", getPriorityStyle(task.priority))}>{task.priority}</span>
            </div>
          </div>
        </div>

        {/* CỤM TIMER NÂNG CẤP */}
        <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
          <button 
            onClick={() => { 
              if (isRunning) onUpdate({ actualtime: elapsed }); 
              setIsRunning(!isRunning); 
            }}
            className={cn(
              "flex items-center gap-3 px-5 py-2.5 rounded-2xl font-black text-[13px] transition-all border-2 shadow-sm min-w-[140px] justify-center",
              isRunning 
                ? "bg-rose-600 border-rose-700 text-white animate-pulse ring-4 ring-rose-100" 
                : "bg-white border-neutral-100 text-neutral-600 hover:border-indigo-400 hover:text-indigo-600"
            )}
          >
            {isRunning ? (
              <Square className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            
            <span className="font-mono tracking-wider text-[14px]">
              {formatTime(elapsed)}
            </span>
          </button>
          
          <div className="p-2 text-neutral-300">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* 2. DETAIL PANEL */}
      {isExpanded && (
        <div className="p-8 pt-4 bg-neutral-50/40 border-t space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Tên công việc</label>
                <input type="text" value={task.title} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full bg-white border border-neutral-200 rounded-2xl px-5 py-3.5 font-black text-sm outline-none shadow-sm focus:border-indigo-500" placeholder="Tên công việc" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Brief chi tiết công việc</label>
                <textarea rows={8} value={task.description || ''} onChange={(e) => onUpdate({ description: e.target.value })} className="w-full bg-white border border-neutral-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none resize-none shadow-sm focus:border-indigo-500" placeholder="Điền thông tin chi tiết hoặc link thiết kế tại đây..." />
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-indigo-50/50 rounded-2xl border border-dashed border-indigo-100">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">Created by: <span className="text-indigo-600">{task.user_email?.split('@')[0] || 'Admin'}</span></span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter ml-auto flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {createdTime}
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm space-y-5">
                <div>
                  <label className="text-[9px] font-black text-neutral-400 mb-2 block uppercase tracking-widest">Nhân sự thực hiện</label>
                  <select value={task.pics?.[0] || ''} onChange={(e) => onUpdate({ pics: [e.target.value] })} className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-[11px] font-black outline-none cursor-pointer">
                    <option value="">Chọn PIC</option>
                    {teamMembers?.map((m: any) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black text-neutral-400 mb-2 block uppercase tracking-widest">Client / Dự án</label>
                  <select value={task.client || ''} onChange={(e) => onUpdate({ client: e.target.value })} className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-[11px] font-black outline-none cursor-pointer">
                    <option value="">Chọn Client</option>
                    {clients?.map((c: any) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-neutral-300 uppercase">Status</label>
                    <select 
                      value={task.status} 
                      onChange={(e) => onUpdate({ status: e.target.value })} 
                      className={cn("w-full border rounded-xl px-2 py-3 text-[10px] font-black uppercase transition-colors outline-none", getStatusStyle(task.status))}
                    >
                      <option value="Not Started">To Do</option>
                      <option value="In Progress">Doing</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-neutral-300 uppercase">Priority</label>
                    <select 
                      value={task.priority} 
                      onChange={(e) => onUpdate({ priority: e.target.value })} 
                      className={cn("w-full border rounded-xl px-2 py-3 text-[10px] font-black uppercase transition-colors outline-none", getPriorityStyle(task.priority))}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Hạn chót (Due Date)</label>
                  <input type="date" value={task.duedate || ''} onChange={(e) => onUpdate({ duedate: e.target.value })} className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-[11px] font-black outline-none cursor-pointer" />
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <button onClick={onDuplicate} title="Nhân bản" className="flex-1 bg-white border border-neutral-200 text-neutral-400 hover:text-indigo-600 p-3 rounded-2xl transition-all"><Copy className="w-5 h-5 mx-auto"/></button>
                <button onClick={onDelete} title="Xóa" className="flex-1 bg-white border border-neutral-200 text-neutral-400 hover:text-rose-600 p-3 rounded-2xl transition-all"><Trash2 className="w-5 h-5 mx-auto"/></button>
              </div>
              <button onClick={() => setIsExpanded(false)} className="w-full bg-neutral-900 text-white py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black active:scale-95 transition-all">CẬP NHẬT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { TaskItem } from './TaskItem';
import { cn } from '../utils';
import { LayoutGrid, Clock, CheckCircle2, Palette, Rocket, PartyPopper } from 'lucide-react';

export function DailyView({ allTasks, teamMembers, onUpdate, onDelete, onDuplicate, clients }: any) {
  // State quản lý Tab đang chọn trên Mobile (Mặc định mở Doing)
  const [activeTab, setActiveTab] = useState('In Progress');

  const buckets = [
    { 
      id: 'Not Started', 
      title: 'To Do', 
      icon: Palette, // Icon Creative mới
      tasks: allTasks.filter((t: any) => t.status === 'Not Started'),
      bgClass: 'bg-neutral-50/50 border-neutral-100',
      colorClass: 'bg-white text-neutral-300 border border-neutral-100',
      activeColor: 'text-neutral-500',
      activeBg: 'bg-neutral-100'
    },
    { 
      id: 'In Progress', 
      title: 'Doing', 
      icon: Rocket, // Icon Creative mới
      tasks: allTasks.filter((t: any) => t.status === 'In Progress'),
      bgClass: 'bg-[#00a9e0]/5 border-[#00a9e0]/10',
      colorClass: 'bg-[#00a9e0] text-white',
      activeColor: 'text-[#00a9e0]',
      activeBg: 'bg-[#00a9e0]/10'
    },
    { 
      id: 'Done', 
      title: 'Done', 
      icon: PartyPopper, // Icon Creative mới
      tasks: allTasks.filter((t: any) => t.status === 'Done'),
      bgClass: 'bg-emerald-50/5 border-emerald-100/50',
      colorClass: 'bg-emerald-500 text-white',
      activeColor: 'text-emerald-600',
      activeBg: 'bg-emerald-50'
    }
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => { 
    e.dataTransfer.setData("taskId", taskId); 
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) onUpdate(taskId, { status: newStatus });
  };

  const Column = ({ bucket, isHiddenOnMobile }: any) => {
    const { title, icon: Icon, tasks, id, bgClass, colorClass } = bucket;
    return (
      <div 
        className={cn(
          "flex flex-col rounded-[10px] p-4 border transition-all duration-300", 
          bgClass,
          isHiddenOnMobile ? "hidden lg:flex" : "flex" // Chỉ hiện bucket đang chọn trên mobile
        )} 
        onDragOver={(e) => e.preventDefault()} 
        onDrop={(e) => handleDrop(e, id)}
      >
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-[4px]", colorClass)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{title}</span>
          </div>
          <span className="text-[9px] font-bold text-neutral-400 px-2 py-0.5 bg-white border border-neutral-50 rounded-[2px]">
            {tasks.length}
          </span>
        </div>

        <div className="flex-1 space-y-3 min-h-[200px]">
          {tasks.length > 0 ? (
            tasks.map((task: any) => (
              <div 
                key={task.id} 
                draggable 
                onDragStart={(e) => handleDragStart(e, task.id)} 
                className="cursor-grab active:cursor-grabbing"
              >
                <TaskItem 
                  task={task} 
                  teamMembers={teamMembers} 
                  clients={clients}
                  onUpdate={(u:any) => onUpdate(task.id, u)} 
                  onDelete={() => onDelete(task.id)} 
                  onDuplicate={() => onDuplicate(task.id, task)} 
                />
              </div>
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-20 grayscale">
              <Icon className="w-12 h-12 mb-2 text-neutral-300" />
              <p className="text-[10px] uppercase tracking-widest text-neutral-400">Trống</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 🚀 MOBILE TABS NAVIGATION - Chỉ hiện trên màn hình nhỏ */}
      <div className="lg:hidden sticky top-[64px] z-30 bg-[#FBFBFD]/95 backdrop-blur-sm pt-2 pb-1 border-b border-neutral-100">
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-neutral-100 shadow-sm">
          {buckets.map((bucket) => {
            const isActive = activeTab === bucket.id;
            const Icon = bucket.icon;
            return (
              <button
                key={bucket.id}
                onClick={() => setActiveTab(bucket.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full transition-all active:scale-95",
                  isActive 
                    ? `${bucket.activeBg} ${bucket.activeColor} shadow-sm font-bold` 
                    : "text-neutral-400 font-medium"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "" : "opacity-40")} />
                <span className="text-[11px] uppercase tracking-wider">{bucket.title}</span>
                <span className="text-[9px] opacity-50 font-mono">({bucket.tasks.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🖥 GRID SYSTEM: 1 cột trên Mobile (dựa vào tab), 3 cột trên Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[calc(100vh-250px)] animate-in fade-in duration-500">
        {buckets.map((bucket) => (
          <Column 
            key={bucket.id} 
            bucket={bucket} 
            isHiddenOnMobile={activeTab !== bucket.id} 
          />
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { TaskItem } from './TaskItem';
import { cn } from '../utils';
import { LayoutGrid, Clock, CheckCircle2 } from 'lucide-react';

export function DailyView({ allTasks, teamMembers, onUpdate, onDelete, onDuplicate }: any) {
  const buckets = {
    todo: allTasks.filter((t: any) => t.status === 'Not Started'),
    doing: allTasks.filter((t: any) => t.status === 'In Progress'),
    done: allTasks.filter((t: any) => t.status === 'Done')
  };
  const handleDragStart = (e: React.DragEvent, taskId: string) => { e.dataTransfer.setData("taskId", taskId); };
  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) onUpdate(taskId, { status: newStatus });
  };
  const Column = ({ title, icon: Icon, tasks, status, bgClass, colorClass }: any) => (
    <div className={cn("flex flex-col rounded-[10px] p-4 border transition-colors", bgClass)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, status)}>
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-[4px]", colorClass)}><Icon className="w-3.5 h-3.5" /></div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">{title}</span>
        </div>
        <span className="text-[9px] font-normal text-neutral-400 px-2 py-0.5 bg-white border border-neutral-50 rounded-[2px]">{tasks.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-[200px]">
        {tasks.map((task: any) => (
          <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)} className="cursor-grab active:cursor-grabbing">
            <TaskItem task={task} teamMembers={teamMembers} onUpdate={(u:any) => onUpdate(task.id, u)} onDelete={() => onDelete(task.id)} onDuplicate={() => onDuplicate(task.id, task)} />
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)] animate-in fade-in duration-500">
      <Column title="To Do" icon={LayoutGrid} tasks={buckets.todo} status="Not Started" bgClass="bg-neutral-50/50 border-neutral-100" colorClass="bg-white text-neutral-300 border border-neutral-100" />
      <Column title="Doing" icon={Clock} tasks={buckets.doing} status="In Progress" bgClass="bg-[#00a9e0]/5 border-[#00a9e0]/10" colorClass="bg-[#00a9e0] text-white" />
      <Column title="Done" icon={CheckCircle2} tasks={buckets.done} status="Done" bgClass="bg-emerald-50/5 border-emerald-100/50" colorClass="bg-emerald-500 text-white" />
    </div>
  );
}
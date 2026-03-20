import React, { useMemo } from 'react';
import { TaskItem } from './TaskItem';
import { cn } from '../utils';
import { LayoutGrid, Clock, CheckCircle2 } from 'lucide-react';

export function DailyView({ allTasks, teamMembers, onUpdate, onDelete, onDuplicate }: any) {
  
  // 1. Sắp xếp tất cả task theo ngày gần hiện tại nhất (Tăng dần theo duedate)
  const sortedTasks = useMemo(() => {
    return [...allTasks].sort((a, b) => {
      const dateA = new Date(a.duedate || 0).getTime();
      const dateB = new Date(b.duedate || 0).getTime();
      return dateA - dateB;
    });
  }, [allTasks]);

  // 2. Phân chia task vào 3 Bucket (Cột)
  const buckets = {
    todo: sortedTasks.filter(t => t.status === 'Not Started'),
    doing: sortedTasks.filter(t => t.status === 'In Progress'),
    done: sortedTasks.filter(t => t.status === 'Done')
  };

  const ColumnHeader = ({ title, icon: Icon, count, colorClass }: any) => (
    <div className="flex items-center justify-between mb-4 px-2">
      <div className="flex items-center gap-2">
        <div className={cn("p-2 rounded-lg", colorClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-black uppercase tracking-widest text-neutral-600">{title}</span>
      </div>
      <span className="bg-neutral-200 text-neutral-500 text-[10px] font-black px-2 py-0.5 rounded-full">{count}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
      
      {/* CỘT 1: TO DO */}
      <div className="flex flex-col bg-neutral-100/50 rounded-[32px] p-4 border border-neutral-200/50">
        <ColumnHeader title="To Do" icon={LayoutGrid} count={buckets.todo.length} colorClass="bg-white text-neutral-400 shadow-sm" />
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {buckets.todo.map(task => (
            <TaskItem key={task.id} task={task} teamMembers={teamMembers} onUpdate={(u:any) => onUpdate(task.id, u)} onDelete={() => onDelete(task.id)} onDuplicate={() => onDuplicate(task.id, task)} />
          ))}
        </div>
      </div>

      {/* CỘT 2: DOING */}
      <div className="flex flex-col bg-indigo-50/30 rounded-[32px] p-4 border border-indigo-100/50">
        <ColumnHeader title="Doing" icon={Clock} count={buckets.doing.length} colorClass="bg-indigo-600 text-white shadow-lg shadow-indigo-100" />
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {buckets.doing.map(task => (
            <TaskItem key={task.id} task={task} teamMembers={teamMembers} onUpdate={(u:any) => onUpdate(task.id, u)} onDelete={() => onDelete(task.id)} onDuplicate={() => onDuplicate(task.id, task)} />
          ))}
        </div>
      </div>

      {/* CỘT 3: DONE */}
      <div className="flex flex-col bg-emerald-50/30 rounded-[32px] p-4 border border-emerald-100/50">
        <ColumnHeader title="Done" icon={CheckCircle2} count={buckets.done.length} colorClass="bg-emerald-500 text-white shadow-lg shadow-emerald-100" />
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {buckets.done.map(task => (
            <TaskItem key={task.id} task={task} teamMembers={teamMembers} onUpdate={(u:any) => onUpdate(task.id, u)} onDelete={() => onDelete(task.id)} onDuplicate={() => onDuplicate(task.id, task)} />
          ))}
        </div>
      </div>

    </div>
  );
}
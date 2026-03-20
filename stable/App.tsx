import React, { useState, useMemo } from 'react';
import { 
  Filter, Plus, Settings, LogOut, User, LayoutGrid, Clock, Calendar as CalendarIcon, List, Search
} from 'lucide-react';

import { useTaskStore } from './useTaskStore';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import { DatePicker } from './components/DatePicker';
import { TaskItem } from './components/TaskItem';
import { TimelineView } from './components/TimelineView';
import { WeeklyView } from './components/WeeklyView';
import { MonthlyView } from './components/MonthlyView'; // KHÔI PHỤC
import { DailyView } from './components/DailyView';
import { MasterCategoryModal } from './components/MasterCategoryModal';
import { cn } from './utils';

export default function App() {
  const { 
    user, allTasks, selectedDate, setSelectedDate, addTask, updateTask, deleteTask, isLoaded,
    teamMembers, clients, taskTypes, addTeamMember, removeTeamMember, addClient, removeClient, addTaskType, removeTaskType 
  } = useTaskStore();

  const [view, setView] = useState<'daily' | 'timeline' | 'weekly' | 'monthly'>('timeline'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // BỘ LỌC 4 LỚP
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPic, setFilterPic] = useState('All');
  const [filterClient, setFilterClient] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  // LOGIC LỌC TỔNG HỢP
  const filteredTasksForDay = useMemo(() => {
    return allTasks
      .filter(t => t.duedate === selectedDate)
      .filter(t => filterStatus === 'All' || t.status === filterStatus)
      .filter(t => filterPic === 'All' || (t.pics && t.pics.includes(filterPic)))
      .filter(t => filterClient === 'All' || t.client === filterClient)
      .filter(t => filterPriority === 'All' || t.priority === filterPriority);
  }, [allTasks, selectedDate, filterStatus, filterPic, filterClient, filterPriority]);

  if (!isLoaded) return <div className="h-screen flex items-center justify-center font-black text-[10px] uppercase tracking-widest text-indigo-600">Khởi tạo Workspace...</div>;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg"><LayoutGrid className="w-5 h-5 text-white" /></div>
          <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">CREATIVE WORKSPACE</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl">
            {[
              { id: 'daily', icon: List }, { id: 'timeline', icon: Clock }, 
              { id: 'weekly', icon: CalendarIcon }, { id: 'monthly', icon: LayoutGrid }
            ].map((v) => (
              <button key={v.id} onClick={() => setView(v.id as any)} className={cn("p-2 rounded-xl transition-all", view === v.id ? "bg-white text-indigo-600 shadow-sm" : "text-neutral-400")}>
                <v.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          <div className="h-8 w-[1px] bg-neutral-200 mx-2" />
          <div className="bg-indigo-50 px-3 py-1.5 rounded-full flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-indigo-600" /><span className="text-[11px] font-bold text-indigo-700">{user.email?.split('@')[0]}</span>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-neutral-300 hover:text-rose-500 transition-colors"><LogOut className="w-4 h-4" /></button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* TOOLBAR BỘ LỌC HOÀN CHỈNH */}
        <div className="flex flex-wrap items-center bg-white p-3 px-6 rounded-3xl border mb-8 gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-400 font-black text-[10px] uppercase tracking-widest border-r pr-4 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter
          </div>
          
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-neutral-50 border rounded-xl px-3 py-2 text-[10px] font-black outline-none focus:border-indigo-500 transition-all">
            <option value="All">TRẠNG THÁI</option><option value="Not Started">To Do</option><option value="In Progress">Doing</option><option value="Done">Done</option>
          </select>

          <select value={filterPic} onChange={(e) => setFilterPic(e.target.value)} className="bg-indigo-50/50 border border-indigo-100 text-indigo-600 rounded-xl px-3 py-2 text-[10px] font-black outline-none">
            <option value="All">NHÂN SỰ (PIC)</option>{teamMembers.map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="bg-amber-50/50 border border-amber-100 text-amber-600 rounded-xl px-3 py-2 text-[10px] font-black outline-none">
            <option value="All">CLIENT</option>{clients.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="bg-rose-50/50 border border-rose-100 text-rose-600 rounded-xl px-3 py-2 text-[10px] font-black outline-none">
            <option value="All">ƯU TIÊN</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
          </select>

          <div className="flex-1" />
          
          <div className="flex gap-3">
            <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <button onClick={() => setIsModalOpen(true)} className="p-2.5 bg-white border rounded-xl text-neutral-400 hover:text-indigo-600 transition-all"><Settings className="w-4 h-4"/></button>
            <button onClick={() => addTask(selectedDate)} className="bg-indigo-600 text-white px-8 py-2.5 rounded-2xl text-[11px] font-black shadow-lg shadow-indigo-100 flex items-center gap-2 active:scale-95 transition-all">
              <Plus className="w-4 h-4" /> ADD TASK
            </button>
          </div>
        </div>

        {/* CÁC CHẾ ĐỘ XEM */}
        <div className="relative">
          {view === 'daily' && <DailyView allTasks={allTasks} teamMembers={teamMembers} onUpdate={updateTask} onDelete={deleteTask} onDuplicate={(id:any, t:any) => addTask(selectedDate, {...t, id: undefined})} />}
          
          {view === 'timeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden min-h-[600px]"><TimelineView tasks={filteredTasksForDay} /></div>
              <div className="lg:col-span-2 space-y-4">
                {filteredTasksForDay.length > 0 ? filteredTasksForDay.map(task => (
                  <TaskItem key={task.id} task={task} teamMembers={teamMembers} clients={clients} onUpdate={(u:any) => updateTask(task.id, u)} onDelete={() => deleteTask(task.id)} onDuplicate={() => addTask(selectedDate, {...task, id: undefined})} />
                )) : (
                  <div className="text-center py-32 text-neutral-300 font-black uppercase text-[10px] tracking-widest bg-white rounded-[32px] border border-dashed border-neutral-200">Không có việc phù hợp bộ lọc</div>
                )}
              </div>
            </div>
          )}

          {view === 'weekly' && <WeeklyView allTasks={allTasks} selectedDate={selectedDate} onDateChange={setSelectedDate} setView={setView} />}
          
          {/* KHÔI PHỤC MONTHLY VIEW */}
          {view === 'monthly' && (
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-xl overflow-hidden p-8">
              <MonthlyView allTasks={allTasks} selectedDate={selectedDate} onDateChange={setSelectedDate} setView={setView} />
            </div>
          )}
        </div>
      </main>

      <MasterCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} teamMembers={teamMembers} onAddTeam={addTeamMember} onRemoveTeam={removeTeamMember} clients={clients} onAddClient={addClient} onRemoveClient={removeClient} taskTypes={taskTypes} onAddTaskType={addTaskType} onRemoveTaskType={removeTaskType} />
    </div>
  );
}
import React, { useState, useMemo } from 'react';
import { 
  Filter, Plus, Settings, LogOut, LayoutGrid, Clock, Calendar as CalendarIcon, List 
} from 'lucide-react';
import { useTaskStore } from './useTaskStore';
import { DatePicker } from './components/DatePicker';
import { TaskItem } from './components/TaskItem';
import { TimelineView } from './components/TimelineView';
import { WeeklyView } from './components/WeeklyView';
import { MonthlyView } from './components/MonthlyView'; 
import { DailyView } from './components/DailyView';
import { MasterCategoryModal } from './components/MasterCategoryModal';
import { cn } from './utils';

export default function App() {
  const { 
    userName, loginAsUser, logout, allTasks, selectedDate, setSelectedDate, 
    addTask, updateTask, deleteTask, isLoaded, teamMembers, clients, 
    taskTypes, addTeamMember, removeTeamMember, addClient, removeClient, 
    addTaskType, removeTaskType 
  } = useTaskStore();

  const [view, setView] = useState<'daily' | 'timeline' | 'weekly' | 'monthly'>('timeline'); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // BỘ LỌC 5 LỚP
  const [fStatus, setFStatus] = useState('All');
  const [fPic, setFPic] = useState('All');
  const [fClient, setFClient] = useState('All');
  const [fPriority, setFPriority] = useState('All');
  const [fCreator, setFCreator] = useState('All');

  const creators = useMemo(() => {
    return [...new Set(allTasks.map(t => t.creator_name).filter(Boolean))];
  }, [allTasks]);

  const filteredTasksForDay = useMemo(() => {
    return allTasks.filter(t => {
      if (t.title === 'Việc mới' && t.duedate === selectedDate) return true;
      const matchS = fStatus === 'All' || t.status === fStatus;
      const matchP = fPic === 'All' || (t.pics && t.pics.includes(fPic));
      const matchC = fClient === 'All' || t.client === fClient;
      const matchPr = fPriority === 'All' || t.priority === fPriority;
      const matchCr = fCreator === 'All' || t.creator_name === fCreator;
      return t.duedate === selectedDate && matchS && matchP && matchC && matchPr && matchCr;
    });
  }, [allTasks, selectedDate, fStatus, fPic, fClient, fPriority, fCreator]);

  // 1. MÀN HÌNH KHỞI TẠO
  if (!isLoaded) return (
    <div className="h-screen flex items-center justify-center font-bold text-[10px] uppercase tracking-[0.3em] text-[#00a9e0]">
      Khởi tạo Workspace...
    </div>
  );

  // 2. MÀN HÌNH NHẬP TÊN (WELCOME)
  if (!userName) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FBFBFD] px-4">
        <div className="w-full max-w-[320px] bg-white p-8 rounded-[20px] shadow-xl border border-neutral-100 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-12 h-12 bg-[#00a9e0] rounded-[10px] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00a9e0]/20">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-[18px] font-bold uppercase tracking-tighter mb-1">My Workspace</h2>
          <p className="text-[10px] text-neutral-400 mb-6 uppercase tracking-[0.2em]">Nhập tên định danh dữ liệu</p>
          <input 
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && loginAsUser((e.currentTarget as HTMLInputElement).value)}
            placeholder="Ví dụ: HAO PHUC..."
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-[8px] text-[14px] text-center outline-none focus:ring-2 ring-[#00a9e0]/20 mb-4 transition-all"
          />
          <button 
            onClick={(e) => {
              const input = (e.currentTarget.previousSibling as HTMLInputElement).value;
              if (input) loginAsUser(input);
            }}
            className="w-full bg-[#00a9e0] text-white py-3 rounded-[8px] text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
          >
            BẮT ĐẦU NGAY
          </button>
        </div>
      </div>
    );
  }

  // 3. GIAO DIỆN CHÍNH
  return (
    <div className="min-h-screen bg-[#FBFBFD] font-sans pb-20 text-[#1D1D1F]">
      {/* HEADER SLIM (h-12) */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-100 px-3 md:px-8 h-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#00a9e0] rounded-[4px] flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-[12px] md:text-[14px] font-bold tracking-tighter uppercase text-neutral-800">Workspace</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-neutral-100 p-0.5 rounded-[6px]">
            {[{ id: 'daily', icon: List }, { id: 'timeline', icon: Clock }, { id: 'weekly', icon: CalendarIcon }, { id: 'monthly', icon: LayoutGrid }].map((v) => (
              <button key={v.id} onClick={() => setView(v.id as any)} className={cn("p-1.5 rounded-[4px] transition-all", view === v.id ? "bg-white text-[#00a9e0] shadow-sm" : "text-neutral-400")}>
                <v.icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
          <button onClick={logout} className="text-neutral-300 hover:text-rose-500 p-1">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-3 md:px-8 py-4 md:py-6">
        {/* FILTER BAR 5 LỚP */}
        <div className="bg-white p-3 rounded-[10px] border border-neutral-100 mb-4 shadow-sm space-y-3">
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3">
             <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="bg-neutral-50 border-none rounded-[4px] px-2 py-2 text-[10px] font-bold text-neutral-800 outline-none"><option value="All">TRẠNG THÁI</option><option value="Not Started">To Do</option><option value="In Progress">Doing</option><option value="Done">Done</option></select>
             <select value={fPic} onChange={(e) => setFPic(e.target.value)} className="bg-[#00a9e0]/5 border-none text-[#0077a1] rounded-[4px] px-2 py-2 text-[10px] font-bold outline-none"><option value="All">PIC</option>{teamMembers.map(n => <option key={n} value={n}>{n}</option>)}</select>
             <select value={fClient} onChange={(e) => setFClient(e.target.value)} className="bg-amber-50/50 border-none text-[#92400e] rounded-[4px] px-2 py-2 text-[10px] font-bold outline-none"><option value="All">CLIENT</option>{clients.map(c => <option key={c} value={c}>{c}</option>)}</select>
             <select value={fPriority} onChange={(e) => setFPriority(e.target.value)} className="bg-rose-50/50 border-none text-[#be123c] rounded-[4px] px-2 py-2 text-[10px] font-bold outline-none"><option value="All">ƯU TIÊN</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select>
             <select value={fCreator} onChange={(e) => setFCreator(e.target.value)} className="bg-emerald-50/50 border-none text-[#065f46] rounded-[4px] px-2 py-2 text-[10px] font-bold outline-none col-span-2 md:col-span-1"><option value="All">NGƯỜI TẠO</option>{creators.map(c => <option key={c} value={c}>{c}</option>)}</select>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-neutral-50">
            <div className="flex-1">
              <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setIsModalOpen(true)} className="p-2 bg-white border border-neutral-100 rounded-[4px] text-neutral-300 hover:text-[#00a9e0]">
                <Settings className="w-3.5 h-3.5"/>
              </button>
              <button 
                onClick={() => addTask(selectedDate)} 
                className="bg-[#00a9e0] text-white px-5 py-2 rounded-[4px] text-[10px] font-bold shadow-md flex items-center gap-1.5 uppercase tracking-widest active:scale-95 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" /> Task
              </button>
            </div>
          </div>
        </div>

        {/* VIEW RENDERER */}
        <div className="relative">
          {view === 'daily' && <DailyView allTasks={allTasks} teamMembers={teamMembers} clients={clients} onUpdate={updateTask} onDelete={deleteTask} onDuplicate={(id:any, t:any) => addTask(selectedDate, {...t, id: undefined})} />}
          
          {view === 'timeline' && (
            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-8">
              <div className="lg:col-span-1 bg-white rounded-[10px] border border-neutral-100 shadow-sm min-h-[300px] lg:min-h-[600px]">
                <TimelineView tasks={filteredTasksForDay} />
              </div>
              <div className="lg:col-span-3 space-y-3">
                {filteredTasksForDay.length > 0 ? filteredTasksForDay.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    teamMembers={teamMembers} 
                    clients={clients} 
                    onUpdate={(u:any) => updateTask(task.id, u)} 
                    onDelete={() => deleteTask(task.id)} 
                    onDuplicate={() => addTask(selectedDate, {...task, id: undefined})} 
                  />
                )) : (
                  <div className="text-center py-20 text-neutral-300 font-bold uppercase text-[9px] tracking-[0.3em] bg-white rounded-[10px] border border-dashed border-neutral-100">
                    Không có việc phù hợp
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'weekly' && <WeeklyView allTasks={allTasks} selectedDate={selectedDate} onDateChange={setSelectedDate} setView={setView} teamMembers={teamMembers} clients={clients} filterStatus={fStatus} filterPic={fPic} filterClient={fClient} filterPriority={fPriority} filterCreator={fCreator} />}
          
          {view === 'monthly' && (
            <div className="bg-white md:rounded-[10px] md:border border-neutral-100 shadow-sm p-0 md:p-8 animate-in fade-in duration-500 overflow-hidden -mx-3 md:mx-0">
                <MonthlyView 
                  allTasks={allTasks} 
                  selectedDate={selectedDate} 
                  onDateChange={setSelectedDate} 
                  setView={setView} 
                />
            </div>
          )}
        </div>
      </main>

      <MasterCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} teamMembers={teamMembers} onAddTeam={addTeamMember} onRemoveTeam={removeTeamMember} clients={clients} onAddClient={addClient} onRemoveClient={removeClient} taskTypes={taskTypes} onAddTaskType={addTaskType} onRemoveTaskType={removeTaskType} />
    </div>
  );
}
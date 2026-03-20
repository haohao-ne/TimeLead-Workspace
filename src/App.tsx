import React, { useState, useMemo } from 'react';
import { 
  Filter, Plus, Settings, LogOut, User, LayoutGrid, Clock, Calendar as CalendarIcon, List
} from 'lucide-react';
import { useTaskStore } from './useTaskStore';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import { DatePicker } from './components/DatePicker';
import { TaskItem } from './components/TaskItem';
import { TimelineView } from './components/TimelineView';
import { WeeklyView } from './components/WeeklyView';
import { MonthlyView } from './components/MonthlyView'; 
import { DailyView } from './components/DailyView';
import { MasterCategoryModal } from './components/MasterCategoryModal';
import { cn } from './utils';

// ... (giữ nguyên các import)

export default function App() {
  const { userName, loginAsUser, logout, allTasks, selectedDate, setSelectedDate, addTask, updateTask, deleteTask, isLoaded, teamMembers, clients } = useTaskStore();
  const [view, setView] = useState<'daily' | 'timeline' | 'weekly' | 'monthly'>('timeline');

  // Logic Filter giữ nguyên (fStatus, fPic, ...)
  // ...

  if (!isLoaded) return <div className="h-screen flex items-center justify-center font-bold text-[10px] text-[#00a9e0]">KHỞI TẠO...</div>;

  // MÀN HÌNH NHẬP TÊN CHO BẢN CLONE
  if (!userName) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FBFBFD] px-4">
        <div className="w-full max-w-[320px] bg-white p-8 rounded-[20px] shadow-xl border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-[#00a9e0] rounded-[10px] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00a9e0]/20">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-[18px] font-bold uppercase tracking-tighter mb-2">My Workspace</h2>
          <p className="text-[11px] text-neutral-400 mb-6 uppercase tracking-widest">Nhập tên để kích hoạt dữ liệu</p>
          <input 
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && loginAsUser((e.target as HTMLInputElement).value)}
            placeholder="Ví dụ: HAO PHUC..."
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-[8px] text-[14px] text-center outline-none focus:ring-2 ring-[#00a9e0]/20 mb-4 transition-all"
          />
          <button 
            onClick={(e) => {
              const input = (e.currentTarget.previousSibling as HTMLInputElement).value;
              loginAsUser(input);
            }}
            className="w-full bg-[#00a9e0] text-white py-3 rounded-[8px] text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
          >
            BẮT ĐẦU NGAY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] font-sans pb-20 text-[#1D1D1F]">
       {/* HEADER SLIM (h-12) & FILTER BAR 5 LỚP (Bản đã tối ưu của Hạo) */}
       {/* ... (Copy phần Header và Main từ bản App.tsx tối ưu của bạn qua) */}
    </div>
  );
}
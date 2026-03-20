import React, { useState } from 'react';
import { X, Users, Building2, Tag, Trash2, Settings, Plus, Sparkles } from 'lucide-react';
import { cn } from '../utils';

export function MasterCategoryModal({ 
  isOpen, onClose, 
  teamMembers, onAddTeam, onRemoveTeam,
  clients, onAddClient, onRemoveClient,
  taskTypes, onAddTaskType, onRemoveTaskType
}: any) {
  const [activeTab, setActiveTab] = useState<'Team' | 'Client' | 'Type'>('Team');
  const [newName, setNewName] = useState('');

  if (!isOpen) return null;

  // Cấu hình dữ liệu hiển thị theo Tab đang chọn
  const config = {
    Team: { 
      items: teamMembers, onAdd: onAddTeam, onRemove: onRemoveTeam, 
      label: 'Nhân sự Team', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' 
    },
    Client: { 
      items: clients, onAdd: onAddClient, onRemove: onRemoveClient, 
      label: 'Đối tác & Khách hàng', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50' 
    },
    Type: { 
      items: taskTypes || [], onAdd: onAddTaskType, onRemove: onRemoveTaskType, 
      label: 'Hạng mục Video/Design', icon: Tag, color: 'text-purple-600', bg: 'bg-purple-50' 
    }
  };

  const current = config[activeTab];

  const handleAdd = () => {
    if (newName.trim()) {
      current.onAdd(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl shadow-indigo-200/50 animate-in zoom-in-95 duration-300 border border-neutral-100">
        
        {/* HEADER */}
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
              <Settings className="w-6 h-6 text-indigo-600 animate-spin-slow"/> DANH MỤC
            </h2>
            <p className="text-[10px] font-black text-neutral-400 mt-1 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400"/> Personalize your workspace
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400">
            <X className="w-6 h-6"/>
          </button>
        </div>

        <div className="px-8 pb-8">
          {/* TABS SWITCHER */}
          <div className="flex bg-neutral-100 p-1 rounded-[20px] mb-8 border border-neutral-100">
            {(['Team', 'Client', 'Type'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={cn(
                  "flex-1 py-2.5 text-[10px] font-black rounded-[16px] transition-all duration-300 uppercase tracking-wider",
                  activeTab === tab ? "bg-white text-indigo-600 shadow-lg shadow-indigo-100/50 scale-100" : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* INPUT FIELD */}
          <div className="flex gap-3 mb-8 group">
            <div className="relative flex-1">
              <input 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder={`Thêm \${current.label.toLowerCase()}...`} 
                className="w-full bg-neutral-50 border-2 border-transparent rounded-[20px] px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all placeholder:text-neutral-300" 
              />
            </div>
            <button 
              onClick={handleAdd} 
              className="bg-neutral-900 text-white p-4 rounded-[20px] hover:bg-indigo-600 active:scale-90 transition-all shadow-lg shadow-neutral-200"
            >
              <Plus className="w-6 h-6"/>
            </button>
          </div>

          {/* LIST ITEMS */}
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {current.items.length > 0 ? current.items.map((item: string) => (
              <div 
                key={item} 
                className="flex justify-between items-center p-4 bg-white border border-neutral-100 rounded-[22px] group hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/50 transition-all animate-in slide-in-from-bottom-2 duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-xl", current.bg)}>
                    <current.icon className={cn("w-4 h-4", current.color)} />
                  </div>
                  <span className="font-black text-[13px] text-neutral-700 tracking-tight">{item}</span>
                </div>
                <button 
                  onClick={() => current.onRemove(item)} 
                  className="opacity-0 group-hover:opacity-100 p-2 text-neutral-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            )) : (
              <div className="text-center py-10 border-2 border-dashed border-neutral-100 rounded-[32px]">
                <p className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Danh sách trống</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-8 pt-0">
          <button 
            onClick={onClose} 
            className="w-full py-4 bg-neutral-900 hover:bg-black text-white text-[11px] font-black rounded-[20px] shadow-xl shadow-neutral-200 active:scale-[0.98] transition-all uppercase tracking-[0.2em]"
          >
            Save & Update
          </button>
        </div>
      </div>
    </div>
  );
}
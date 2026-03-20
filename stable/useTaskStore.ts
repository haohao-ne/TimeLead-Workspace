import React, { useState, useEffect, useCallback } from 'react'; // THÊM React VÀO ĐÂY
// ... giữ nguyên các dòng code phía dưới
import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { format } from 'date-fns';

export function useTaskStore() {
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any>(null); 
  
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [clients, setClients] = useState<string[]>([]);
  const [taskTypes, setTaskTypes] = useState<string[]>([]);

  // 1. Quản lý trạng thái Đăng nhập (Authentication)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // SỬA LỖI: Nếu không có session, vẫn phải báo là load xong để hiện Login
      if (!session) setIsLoaded(true); 
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoaded(true); // Đã xác định được user hay chưa, báo load xong
      if (!session) setAllTasks([]); 
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Hàm load dữ liệu
  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const { data: tasks } = await supabase.from('tasks').select('*').order('starttime', { ascending: true });
      setAllTasks(tasks || []);

      const { data: cats } = await supabase.from('categories').select('type, name');
      if (cats) {
        setTeamMembers(cats.filter(c => c.type === 'team').map(c => c.name));
        setClients(cats.filter(c => c.type === 'client').map(c => c.name));
        setTaskTypes(cats.filter(c => c.type === 'task_type').map(c => c.name));
      }
    } catch (err) {
      console.error("Lỗi load dữ liệu:", err);
    } finally {
      setIsLoaded(true);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addTask = useCallback(async (date: string, template?: any) => {
    if (!user) return;
    const newTask = { 
      title: 'Việc mới', starttime: '09:00', endtime: '10:00', duedate: date, 
      status: 'Not Started', priority: 'Medium', completed: false, actualtime: 0, 
      pics: [], project: '', client: '', created_by: user.id, ...template 
    };
    const { data, error } = await supabase.from('tasks').insert([newTask]).select();
    if (!error && data) setAllTasks(prev => [...data, ...prev]);
  }, [user]);

  const updateTask = async (id: string, updates: any) => {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (!error) setAllTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    setAllTasks(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = async (type: string, name: string, setter: any) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const { error } = await supabase.from('categories').insert([{ type, name: cleanName }]);
    if (!error) setter((prev: any) => [...new Set([...prev, cleanName])]);
  };

  const removeCategory = async (type: string, name: string, setter: any) => {
    const { error } = await supabase.from('categories').delete().match({ type, name });
    if (!error) setter((prev: any) => prev.filter((i: string) => i !== name));
  };

  return { 
    user, allTasks, selectedDate, setSelectedDate, addTask, updateTask, deleteTask, isLoaded,
    teamMembers, addTeamMember: (n:string) => addCategory('team', n, setTeamMembers),
    removeTeamMember: (n:string) => removeCategory('team', n, setTeamMembers),
    clients, addClient: (n:string) => addCategory('client', n, setClients),
    removeClient: (n:string) => removeCategory('client', n, setClients),
    taskTypes, addTaskType: (n:string) => addCategory('task_type', n, setTaskTypes),
    removeTaskType: (n:string) => removeCategory('task_type', n, setTaskTypes)
  };
}
import { create } from 'zustand';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { format } from 'date-fns';

export function useTaskStore() {
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Lấy tên từ LocalStorage
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('workspace_user')); 

  const loginAsUser = (name: string) => {
    const cleanName = name.trim().toUpperCase();
    if (!cleanName) return;
    localStorage.setItem('workspace_user', cleanName);
    setUserName(cleanName);
  };

  const logout = () => {
    localStorage.removeItem('workspace_user');
    setUserName(null);
    setAllTasks([]);
  };

  const fetchData = useCallback(async () => {
    if (!userName) return;
    try {
      // Chỉ lấy task có creator_name khớp với tên người dùng
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('creator_name', userName) 
        .order('starttime', { ascending: true });
      
      setAllTasks(tasks || []);
    } catch (err) { console.error("Lỗi:", err); }
    finally { setIsLoaded(true); }
  }, [userName]);

  useEffect(() => { 
    if (userName) fetchData(); 
    else setIsLoaded(true);
  }, [userName, fetchData]);

  const addTask = useCallback(async (date: string, template?: any) => {
    if (!userName) return;
    const newTask = { 
      title: 'Việc mới', 
      starttime: '09:00', 
      duedate: date, 
      status: 'Not Started', 
      priority: 'Medium', 
      creator_name: userName,
      pics: [userName], 
      ...template 
    };
    const { data, error } = await supabase.from('tasks').insert([newTask]).select();
    if (!error && data) setAllTasks(prev => [data[0], ...prev]);
  }, [userName]);

  const updateTask = async (id: string, updates: any) => {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (!error) setAllTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    setAllTasks(prev => prev.filter(t => t.id !== id));
  };

  return { 
    userName, loginAsUser, logout, allTasks, selectedDate, setSelectedDate, 
    addTask, updateTask, deleteTask, isLoaded,
    teamMembers: userName ? [userName] : [],
    clients: ['Personal', 'Work', 'Project'], 
    taskTypes: ['Design', 'Meeting', 'Social']
  };
}
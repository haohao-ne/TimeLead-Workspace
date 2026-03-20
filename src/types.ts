export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Not Started' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  client?: string;
  pic?: string; 
  project?: string;     
  taskType?: string; 
  dueDate: string;   
  startTime: string; 
  endTime: string;   
  completed: boolean;
  status: Status;
  priority: Priority;
  estimatedTime: number; 
  actualTime: number; 
}
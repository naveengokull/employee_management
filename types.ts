
export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'In Progress',
  Done = 'Done',
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  employee_id: number | null;
  created_at: string;
  employee?: Employee; // Optional: for displaying employee name in task list
}

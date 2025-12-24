import { Employee, Task, TaskStatus } from '../types';

let employees: Employee[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Frontend Developer', created_at: new Date().toISOString() },
  { id: 2, name: 'Bob Williams', email: 'bob.w@example.com', role: 'Backend Developer', created_at: new Date().toISOString() },
  { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Project Manager', created_at: new Date().toISOString() },
];

let tasks: Task[] = [
  { id: 1, title: 'Design Homepage UI', description: 'Create mockups for the new homepage.', status: TaskStatus.Done, employee_id: 1, created_at: new Date().toISOString() },
  { id: 2, title: 'Develop Authentication API', description: 'Implement JWT authentication endpoints.', status: TaskStatus.InProgress, employee_id: 2, created_at: new Date().toISOString() },
  { id: 3, title: 'Setup CI/CD Pipeline', description: 'Configure GitHub Actions for deployment.', status: TaskStatus.InProgress, employee_id: 2, created_at: new Date().toISOString() },
  { id: 4, title: 'Plan Q3 Roadmap', description: 'Outline key features for the next quarter.', status: TaskStatus.Todo, employee_id: 3, created_at: new Date().toISOString() },
  { id: 5, title: 'Refactor Button Component', description: 'Update the shared Button component with new styles.', status: TaskStatus.Todo, employee_id: 1, created_at: new Date().toISOString() },
];

let nextEmployeeId = 4;
let nextTaskId = 6;

const simulateDelay = <T,>(data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), 300));

// Employee API
export const getEmployees = async (search?: string): Promise<Employee[]> => {
    let filteredEmployees = [...employees];
    if (search) {
        const lowercasedSearch = search.toLowerCase();
        filteredEmployees = filteredEmployees.filter(e => 
            e.name.toLowerCase().includes(lowercasedSearch) ||
            e.email.toLowerCase().includes(lowercasedSearch) ||
            e.role.toLowerCase().includes(lowercasedSearch)
        );
    }
    return simulateDelay(filteredEmployees);
};
export const getEmployeeById = async (id: number): Promise<Employee | undefined> => simulateDelay(employees.find(e => e.id === id));
export const createEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at'>): Promise<Employee> => {
  if (employees.some(e => e.email === employeeData.email)) {
    throw new Error("Email already exists.");
  }
  const newEmployee: Employee = { ...employeeData, id: nextEmployeeId++, created_at: new Date().toISOString() };
  employees.push(newEmployee);
  return simulateDelay(newEmployee);
};
export const updateEmployee = async (id: number, employeeData: Partial<Omit<Employee, 'id' | 'created_at'>>): Promise<Employee> => {
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) throw new Error("Employee not found.");
  const existingEmail = employees.find(e => e.email === employeeData.email && e.id !== id);
  if (existingEmail) throw new Error("Email already exists.");
  employees[index] = { ...employees[index], ...employeeData };
  return simulateDelay(employees[index]);
};
export const deleteEmployee = async (id: number): Promise<{ message: string }> => {
  const initialLength = employees.length;
  employees = employees.filter(e => e.id !== id);
  // ON DELETE CASCADE for tasks
  tasks = tasks.filter(t => t.employee_id !== id);
  if (employees.length === initialLength) throw new Error("Employee not found.");
  return simulateDelay({ message: "Employee deleted successfully" });
};

// Task API
export const getTasks = async (search?: string, status?: TaskStatus | 'All'): Promise<Task[]> => {
    let filteredTasks = [...tasks];

    if (status && status !== 'All') {
        filteredTasks = filteredTasks.filter(t => t.status === status);
    }

    if (search) {
        const lowercasedSearch = search.toLowerCase();
        filteredTasks = filteredTasks.filter(t => 
            t.title.toLowerCase().includes(lowercasedSearch) ||
            t.description.toLowerCase().includes(lowercasedSearch)
        );
    }

    const tasksWithEmployees = filteredTasks.map(task => {
        const employee = employees.find(e => e.id === task.employee_id);
        return { ...task, employee };
    });
    return simulateDelay(tasksWithEmployees);
};

export const getTaskById = async (id: number): Promise<Task | undefined> => simulateDelay(tasks.find(t => t.id === id));

export const createTask = async (taskData: Omit<Task, 'id' | 'created_at'>): Promise<Task> => {
  const newTask: Task = { ...taskData, id: nextTaskId++, created_at: new Date().toISOString() };
  tasks.push(newTask);
  return simulateDelay(newTask);
};

export const updateTask = async (id: number, taskData: Partial<Omit<Task, 'id' | 'created_at'>>): Promise<Task> => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error("Task not found.");
  tasks[index] = { ...tasks[index], ...taskData };
  return simulateDelay(tasks[index]);
};

export const deleteTask = async (id: number): Promise<{ message: string }> => {
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === initialLength) throw new Error("Task not found.");
  return simulateDelay({ message: "Task deleted successfully" });
};
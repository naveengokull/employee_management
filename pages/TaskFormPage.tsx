
import React, { useEffect, useState, useCallback } from 'react';
// Fix: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { getTaskById, createTask, updateTask, getEmployees } from '../services/api';
import { Task, Employee } from '../types';
import { useToast } from '../hooks/useToast';
import TaskForm from '../components/TaskForm';
import Spinner from '../components/Spinner';

const TaskFormPage: React.FC = () => {
  const { id } = ReactRouterDOM.useParams<{ id: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { addToast } = useToast();
  
  const [task, setTask] = useState<Omit<Task, 'id' | 'created_at'> | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const isEditing = Boolean(id);

  const fetchData = useCallback(async () => {
    try {
      const employeesData = await getEmployees();
      setEmployees(employeesData);

      if (isEditing && id) {
        const taskData = await getTaskById(parseInt(id, 10));
        if (taskData) {
          setTask(taskData);
        } else {
          addToast('Task not found', 'error');
          navigate('/tasks');
        }
      }
    } catch (error) {
      addToast('Failed to load required data', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, isEditing, addToast, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
    try {
      if (isEditing && id) {
        await updateTask(parseInt(id, 10), taskData);
        addToast('Task updated successfully', 'success');
      } else {
        await createTask(taskData);
        addToast('Task created successfully', 'success');
      }
      navigate('/tasks');
    } catch (error) {
      const err = error as Error;
      addToast(err.message || 'An error occurred', 'error');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        {isEditing ? 'Edit Task' : 'Add Task'}
      </h2>
      <TaskForm onSubmit={handleSubmit} initialData={task} employees={employees} />
    </div>
  );
};

export default TaskFormPage;

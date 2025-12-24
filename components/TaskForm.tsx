import React, { useState, useEffect } from 'react';
// Fix: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { Task, Employee, TaskStatus } from '../types';
import Spinner from './Spinner';

interface TaskFormProps {
  onSubmit: (taskData: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  initialData?: Omit<Task, 'id' | 'created_at'> | null;
  employees: Employee[];
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, employees }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.Todo,
    employee_id: null as number | null,
  });
  const [errors, setErrors] = useState({ title: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = ReactRouterDOM.useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
        employee_id: initialData.employee_id,
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors = { title: '' };
    let isValid = true;
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'employee_id' ? (value ? parseInt(value, 10) : null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      await onSubmit(formData);
      setIsSubmitting(false);
    }
  };
  
  const commonInputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";


  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text" name="title" id="title" value={formData.title} onChange={handleChange}
            className={commonInputClasses}
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            name="description" id="description" value={formData.description} onChange={handleChange} rows={4}
            className={commonInputClasses}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              name="status" id="status" value={formData.status} onChange={handleChange}
              className={commonInputClasses}
            >
              {Object.values(TaskStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign to Employee</label>
            <select
              name="employee_id" id="employee_id" value={formData.employee_id ?? ''} onChange={handleChange}
              className={commonInputClasses}
            >
              <option value="">Unassigned</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? <Spinner small /> : 'Save Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
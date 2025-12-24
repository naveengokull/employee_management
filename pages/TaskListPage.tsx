import React, { useState, useEffect, useCallback } from 'react';
// Fix: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { getTasks, deleteTask } from '../services/api';
import { Task, TaskStatus } from '../types';
import { useToast } from '../hooks/useToast';
import ConfirmationModal from '../components/ConfirmationModal';
import { PlusIcon, PencilIcon, TrashIcon, UserCircleIcon, ClockIcon, MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/solid';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const statusStyles: { [key in TaskStatus]: { badge: string; border: string; } } = {
  [TaskStatus.Todo]: {
    badge: 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200',
    border: 'border-gray-400',
  },
  [TaskStatus.InProgress]: {
    badge: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100',
    border: 'border-yellow-500',
  },
  [TaskStatus.Done]: {
    badge: 'bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-100',
    border: 'border-green-500',
  },
};

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const { addToast } = useToast();

  const fetchTasks = useCallback(async (search: string, status: TaskStatus | 'All') => {
    try {
      if (tasks.length === 0) {
        setLoading(true);
      }
      const data = await getTasks(search, status);
      setTasks(data);
    } catch (error) {
      addToast('Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, tasks.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks(searchTerm, statusFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, fetchTasks]);


  const handleDeleteClick = (id: number) => {
    setTaskToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete !== null) {
      try {
        await deleteTask(taskToDelete);
        addToast('Task deleted successfully', 'success');
        fetchTasks(searchTerm, statusFilter);
      } catch (error) {
        const err = error as Error;
        addToast(err.message || 'Failed to delete task', 'error');
      } finally {
        setTaskToDelete(null);
      }
    }
  };
  
  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader type="task" count={5} />;
    }
    
    if (tasks.length === 0) {
      return (
        <EmptyState
          title="No Tasks Found"
          message={searchTerm || statusFilter !== 'All' ? "No tasks match your current filters." : "Get started by adding a new task."}
          buttonText="Add Task"
          buttonLink="/tasks/new"
        />
      );
    }

    return (
        <div className="space-y-4">
            {tasks.map((task, index) => (
              <div 
                key={task.id} 
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-5 border-l-4 ${statusStyles[task.status].border} flex items-center justify-between transition-all duration-300 hover:shadow-md animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                  <div className="flex-1 min-w-0">
                    <p className="text-md font-semibold text-gray-800 dark:text-white truncate">{task.title}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status].badge}`}>
                        {task.status}
                      </span>
                      <span className="flex items-center">
                        <UserCircleIcon className="h-4 w-4 mr-1.5" />
                        {task.employee ? task.employee.name : 'Unassigned'}
                      </span>
                       <span className="flex items-center">
                         <ClockIcon className="h-4 w-4 mr-1.5" />
                         {new Date(task.created_at).toLocaleDateString()}
                       </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-1">
                    <ReactRouterDOM.Link to={`/tasks/edit/${task.id}`} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <PencilIcon className="h-5 w-5" />
                    </ReactRouterDOM.Link>
                    <button onClick={() => handleDeleteClick(task.id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
              </div>
            ))}
        </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Tasks</h2>
        <ReactRouterDOM.Link
          to="/tasks/new"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Task
        </ReactRouterDOM.Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div>
            <select
                id="status"
                name="status"
                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'All')}
            >
                <option value="All">All Statuses</option>
                {Object.values(TaskStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
        </div>
      </div>

      {renderContent()}
      
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default TaskListPage;
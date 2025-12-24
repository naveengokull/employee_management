import React, { useState, useEffect, useCallback } from 'react';
// Fix: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../services/api';
import { Employee } from '../types';
import { useToast } from '../hooks/useToast';
import ConfirmationModal from '../components/ConfirmationModal';
import { PlusIcon, PencilIcon, TrashIcon, BriefcaseIcon, MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/solid';
import Avatar from '../components/Avatar';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';


const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const { addToast } = useToast();

  const fetchEmployees = useCallback(async (search: string) => {
    try {
      // Don't set loading to true on subsequent fetches for a smoother search experience
      if (employees.length === 0) {
        setLoading(true);
      }
      const data = await getEmployees(search);
      setEmployees(data);
    } catch (error) {
      addToast('Failed to fetch employees', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, employees.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchEmployees]);

  const handleDeleteClick = (id: number) => {
    setEmployeeToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete !== null) {
      try {
        await deleteEmployee(employeeToDelete);
        addToast('Employee deleted successfully', 'success');
        fetchEmployees(searchTerm); // Refetch with current search term
      } catch (error) {
        const err = error as Error;
        addToast(err.message || 'Failed to delete employee', 'error');
      } finally {
        setEmployeeToDelete(null);
      }
    }
  };
  
  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader type="employee" count={6} />;
    }
    
    if (employees.length === 0) {
        return (
            <EmptyState
              title="No Employees Found"
              message={searchTerm ? `Your search for "${searchTerm}" did not return any results.` : "Get started by adding a new employee."}
              buttonText="Add Employee"
              buttonLink="/employees/new"
            />
        );
    }

    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee, index) => (
          <div key={employee.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col transition-transform transform hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex-grow">
               <div className="flex items-center space-x-4">
                  <Avatar name={employee.name} />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{employee.name}</h3>
                    <p className="text-sm text-blue-500 dark:text-blue-400">{employee.email}</p>
                  </div>
                </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-4">
                <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
                {employee.role}
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <ReactRouterDOM.Link to={`/employees/edit/${employee.id}`} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <PencilIcon className="h-5 w-5" />
              </ReactRouterDOM.Link>
              <button onClick={() => handleDeleteClick(employee.id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Employees</h2>
        <ReactRouterDOM.Link
          to="/employees/new"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Employee
        </ReactRouterDOM.Link>
      </div>

      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {renderContent()}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This will also remove all associated tasks. This action cannot be undone."
      />
    </div>
  );
};

export default EmployeeListPage;

import React, { useEffect, useState, useCallback } from 'react';
// Fix: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { getEmployeeById, createEmployee, updateEmployee } from '../services/api';
import { Employee } from '../types';
import { useToast } from '../hooks/useToast';
import EmployeeForm from '../components/EmployeeForm';
import Spinner from '../components/Spinner';

const EmployeeFormPage: React.FC = () => {
  const { id } = ReactRouterDOM.useParams<{ id: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { addToast } = useToast();
  const [employee, setEmployee] = useState<Omit<Employee, 'id' | 'created_at'> | null>(null);
  const [loading, setLoading] = useState(false);
  
  const isEditing = Boolean(id);

  const fetchEmployee = useCallback(async () => {
    if (isEditing && id) {
      setLoading(true);
      try {
        const data = await getEmployeeById(parseInt(id, 10));
        if (data) {
          setEmployee(data);
        } else {
          addToast('Employee not found', 'error');
          navigate('/employees');
        }
      } catch (error) {
        addToast('Failed to fetch employee details', 'error');
      } finally {
        setLoading(false);
      }
    }
  }, [id, isEditing, addToast, navigate]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleSubmit = async (employeeData: Omit<Employee, 'id' | 'created_at'>) => {
    try {
      if (isEditing && id) {
        await updateEmployee(parseInt(id, 10), employeeData);
        addToast('Employee updated successfully', 'success');
      } else {
        await createEmployee(employeeData);
        addToast('Employee created successfully', 'success');
      }
      navigate('/employees');
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
        {isEditing ? 'Edit Employee' : 'Add Employee'}
      </h2>
      <EmployeeForm onSubmit={handleSubmit} initialData={employee} />
    </div>
  );
};

export default EmployeeFormPage;

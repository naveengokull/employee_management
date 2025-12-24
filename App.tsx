
import React from 'react';
// Fix: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import TaskListPage from './pages/TaskListPage';
import TaskFormPage from './pages/TaskFormPage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ReactRouterDOM.HashRouter>
          <ReactRouterDOM.Routes>
            <ReactRouterDOM.Route path="/login" element={<LoginPage />} />
            <ReactRouterDOM.Route element={<ProtectedRoute />}>
              <ReactRouterDOM.Route element={<Layout />}>
                <ReactRouterDOM.Route path="/" element={<ReactRouterDOM.Navigate to="/employees" replace />} />
                <ReactRouterDOM.Route path="/employees" element={<EmployeeListPage />} />
                <ReactRouterDOM.Route path="/employees/new" element={<EmployeeFormPage />} />
                <ReactRouterDOM.Route path="/employees/edit/:id" element={<EmployeeFormPage />} />
                <ReactRouterDOM.Route path="/tasks" element={<TaskListPage />} />
                <ReactRouterDOM.Route path="/tasks/new" element={<TaskFormPage />} />
                <ReactRouterDOM.Route path="/tasks/edit/:id" element={<TaskFormPage />} />
              </ReactRouterDOM.Route>
            </ReactRouterDOM.Route>
          </ReactRouterDOM.Routes>
        </ReactRouterDOM.HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

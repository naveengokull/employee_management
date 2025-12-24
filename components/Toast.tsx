import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon as XIcon } from '@heroicons/react/24/solid';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-400',
  },
  error: {
    icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-400',
  },
  info: {
    icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-800 dark:text-blue-200',
    border: 'border-blue-400',
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const config = toastConfig[type];

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`flex items-center p-4 rounded-lg shadow-lg border-l-4 ${config.bg} ${config.border} animate-fade-in-right w-full max-w-sm`}>
      <div className="flex-shrink-0">{config.icon}</div>
      <div className={`ml-3 text-sm font-medium ${config.text}`}>{message}</div>
      <button
        onClick={onClose}
        className={`ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex h-8 w-8 ${config.text} hover:bg-gray-200 dark:hover:bg-gray-700`}
      >
        <span className="sr-only">Close</span>
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;
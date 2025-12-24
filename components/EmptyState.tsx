import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { DocumentMagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, buttonText, buttonLink }) => {
  return (
    <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-fade-in">
      <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
      {buttonText && buttonLink && (
        <div className="mt-6">
          <ReactRouterDOM.Link
            to={buttonLink}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {buttonText}
          </ReactRouterDOM.Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
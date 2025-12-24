import React from 'react';

interface SkeletonLoaderProps {
  type: 'employee' | 'task';
  count: number;
}

const EmployeeSkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div className="animate-pulse flex flex-col h-full">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
        </div>
      </div>
      <div className="mt-4 h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

const TaskSkeletonCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border-l-4 border-gray-300 dark:border-gray-700">
        <div className="animate-pulse flex flex-col space-y-3">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <div className="flex space-x-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            </div>
        </div>
    </div>
);


const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count }) => {
  const skeletons = Array.from({ length: count });

  if (type === 'employee') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((_, index) => <EmployeeSkeletonCard key={index} />)}
      </div>
    );
  }
  
  if (type === 'task') {
      return (
          <div className="space-y-4">
              {skeletons.map((_, index) => <TaskSkeletonCard key={index} />)}
          </div>
      );
  }

  return null;
};

export default SkeletonLoader;
import React from 'react';

const Spinner: React.FC<{ small?: boolean }> = ({ small }) => {
  const size = small ? 'h-5 w-5' : 'h-12 w-12';
  return (
    <div className={`flex justify-center items-center ${small ? '' : 'p-8'}`}>
      <div className={`animate-spin rounded-full ${size} border-b-2 border-t-2 border-blue-500`}></div>
    </div>
  );
};

export default Spinner;
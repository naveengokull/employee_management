import React from 'react';

interface AvatarProps {
  name: string;
}

const colors = [
  'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 
  'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'
];

// Simple hash function to get a consistent color for a name
const nameToColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.slice(0, 2).toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({ name }) => {
  const color = nameToColor(name);
  const initials = getInitials(name);

  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${color}`}>
      {initials}
    </div>
  );
};

export default Avatar;
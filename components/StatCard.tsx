
import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 text-center flex flex-col justify-center items-center h-full transition-colors duration-300 hover:bg-neutral-800 hover:border-neutral-700">
      <p className="text-3xl font-bold text-cyan-400">{value}</p>
      <p className="text-sm text-neutral-400 mt-1">{label}</p>
    </div>
  );
};

export default StatCard;
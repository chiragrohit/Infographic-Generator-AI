
import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 text-center flex flex-col justify-center items-center h-full transform transition-transform duration-300 hover:scale-105 hover:border-cyan-500">
      <p className="text-3xl font-bold text-cyan-400">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
};

export default StatCard;

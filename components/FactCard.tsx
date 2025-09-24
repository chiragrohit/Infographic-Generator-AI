import React from 'react';
import { IconCheckCircle } from './icons/IconCheckCircle';

interface FactCardProps {
  fact: string;
}

const FactCard: React.FC<FactCardProps> = ({ fact }) => {
  return (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 flex items-start gap-4 transition-colors duration-300 hover:bg-slate-800">
       <div className="flex-shrink-0 mt-1">
        <IconCheckCircle className="w-5 h-5 text-cyan-400" />
       </div>
      <p className="text-slate-300 text-sm">{fact}</p>
    </div>
  );
};

export default FactCard;
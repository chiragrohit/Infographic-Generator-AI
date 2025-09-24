import React from 'react';
import { UPSCInsight } from '../types';
import { IconCheckCircle } from './icons/IconCheckCircle';

interface UPSCInsightCardProps {
  insight: UPSCInsight;
}

const UPSCInsightCard: React.FC<UPSCInsightCardProps> = ({ insight }) => {
  const { category, syllabusDescription, points } = insight;

  if (!points || points.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
      <h4 className="font-semibold text-cyan-400">{category}</h4>
      <p className="text-xs text-slate-500 mb-3 italic">({syllabusDescription})</p>
      <ul className="space-y-4">
        {points.map((pointItem, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <IconCheckCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-slate-300 text-sm mb-1">{pointItem.point}</p>
              <span className="inline-block bg-purple-500/20 text-purple-300 text-xs font-medium px-2 py-0.5 rounded-full">
                {pointItem.syllabusTopic}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UPSCInsightCard;
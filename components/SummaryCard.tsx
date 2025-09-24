
import React from 'react';
import { IconDocumentText } from './icons/IconDocumentText';

interface SummaryCardProps {
  summary: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <div className="bg-slate-900/70 p-6 rounded-lg border border-slate-700">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
            <IconDocumentText className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-1">Summary</h3>
          <p className="text-slate-400 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;

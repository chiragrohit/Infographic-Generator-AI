import React from 'react';
import type { InfographicData } from '../types';
import SummaryCard from './SummaryCard';
import StatCard from './StatCard';
import FactCard from './FactCard';
import { IconChartBar } from './icons/IconChartBar';
import { IconClipboardList } from './icons/IconClipboardList';
import { IconBookOpen } from './icons/IconBookOpen';
import UPSCInsightCard from './UPSCInsightCard';

interface InfographicDisplayProps {
  data: InfographicData;
}

const InfographicDisplay: React.FC<InfographicDisplayProps> = ({ data }) => {
  const { title, summary, keyStats, keyFacts, upscInsights } = data;

  const hasKeyFacts = keyFacts && keyFacts.length > 0;
  const hasUPSCInsights = upscInsights && upscInsights.some(insight => insight.points.length > 0);

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 md:p-8 shadow-2xl ring-1 ring-white/10">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text">
        {title}
      </h2>

      <SummaryCard summary={summary} />

      {keyStats && keyStats.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <IconChartBar className="w-6 h-6 text-cyan-400" />
            Key Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyStats.map((stat, index) => (
              <StatCard key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {hasKeyFacts && (
          <div>
            <h3 className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <IconClipboardList className="w-6 h-6 text-cyan-400" />
              Key Facts
            </h3>
            <div className="space-y-3">
              {keyFacts.map((fact, index) => (
                <FactCard key={index} fact={fact} />
              ))}
            </div>
          </div>
        )}

        {hasUPSCInsights && (
          <div>
            <h3 className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <IconBookOpen className="w-6 h-6 text-cyan-400" />
              UPSC Syllabus Insights
            </h3>
            <div className="space-y-4">
              {upscInsights.map((insight, index) => (
                 <UPSCInsightCard key={index} insight={insight} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfographicDisplay;

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { InfographicData } from '../types';
import SummaryCard from './SummaryCard';
import StatCard from './StatCard';
import FactCard from './FactCard';
import { IconChartBar } from './icons/IconChartBar';
import { IconClipboardList } from './icons/IconClipboardList';
import { IconBookOpen } from './icons/IconBookOpen';
import UPSCInsightCard from './UPSCInsightCard';
import ColorPickerPopup from './ColorPickerPopup';

interface InfographicDisplayProps {
  data: InfographicData;
  onUpdateField: (analysisId: string, fieldPath: string, value: any) => void;
}

interface ColorPickerState {
  visible: boolean;
  x: number;
  y: number;
  targetId: string | null;
  fieldPath: string | null;
}

const InfographicDisplay: React.FC<InfographicDisplayProps> = ({ data, onUpdateField }) => {
  const { id, title, summary, keyStats, keyFacts, upscInsights } = data;
  const [colorPicker, setColorPicker] = useState<ColorPickerState>({ visible: false, x: 0, y: 0, targetId: null, fieldPath: null });
  const displayRef = useRef<HTMLDivElement>(null);

  const hasKeyFacts = keyFacts && keyFacts.length > 0;
  const hasUPSCInsights = upscInsights && upscInsights.some(insight => insight.points.length > 0);
  
  const handleUpdateContent = useCallback((fieldPath: string, newHtml: string) => {
    onUpdateField(id, fieldPath, newHtml);
  }, [id, onUpdateField]);

  const openColorPicker = useCallback((target: HTMLElement, fieldPath: string) => {
    const rect = target.getBoundingClientRect();
    setColorPicker({
      visible: true,
      x: rect.left,
      y: rect.bottom + window.scrollY,
      targetId: target.id,
      fieldPath: fieldPath,
    });
  }, []);

  const handleChangeColor = useCallback((color: string) => {
    if (!colorPicker.targetId || !colorPicker.fieldPath || !displayRef.current) return;
    
    const highlightSpan = displayRef.current.querySelector(`#${colorPicker.targetId}`);
    const contentContainer = highlightSpan?.closest('[data-field-path]');

    if (highlightSpan && contentContainer) {
      (highlightSpan as HTMLElement).style.backgroundColor = color;
      handleUpdateContent(colorPicker.fieldPath, (contentContainer as HTMLElement).innerHTML);
    }
    setColorPicker({ visible: false, x: 0, y: 0, targetId: null, fieldPath: null });
  }, [colorPicker.targetId, colorPicker.fieldPath, handleUpdateContent]);

  const handleDeleteHighlight = useCallback(() => {
    if (!colorPicker.targetId || !colorPicker.fieldPath || !displayRef.current) return;

    const highlightSpan = displayRef.current.querySelector(`#${colorPicker.targetId}`);
    const contentContainer = highlightSpan?.closest('[data-field-path]');

    if (highlightSpan && contentContainer) {
      const parent = highlightSpan.parentNode;
      if (parent) {
        // Unwrap the span by moving its children out, then removing the empty span
        while (highlightSpan.firstChild) {
          parent.insertBefore(highlightSpan.firstChild, highlightSpan);
        }
        parent.removeChild(highlightSpan);

        handleUpdateContent(colorPicker.fieldPath, (contentContainer as HTMLElement).innerHTML);
      }
    }
    setColorPicker({ visible: false, x: 0, y: 0, targetId: null, fieldPath: null });
  }, [colorPicker.targetId, colorPicker.fieldPath, handleUpdateContent]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPicker.visible && !(event.target as HTMLElement).closest('.color-picker-popup')) {
        setColorPicker({ visible: false, x: 0, y: 0, targetId: null, fieldPath: null });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [colorPicker.visible]);

  return (
    <div ref={displayRef} className="bg-slate-800/50 rounded-xl p-6 md:p-8 shadow-2xl ring-1 ring-white/10">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text">
        {title}
      </h2>

      <SummaryCard 
        summary={summary} 
        onUpdate={handleUpdateContent}
        openColorPicker={openColorPicker}
      />

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
                <FactCard 
                  key={index} 
                  fact={fact}
                  fieldPath={`keyFacts.${index}`}
                  onUpdate={handleUpdateContent}
                  openColorPicker={openColorPicker}
                />
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
                 <UPSCInsightCard 
                    key={index} 
                    insight={insight} 
                    insightIndex={index}
                    onUpdate={handleUpdateContent}
                    openColorPicker={openColorPicker}
                  />
              ))}
            </div>
          </div>
        )}
      </div>

      {colorPicker.visible && (
        <ColorPickerPopup
          x={colorPicker.x}
          y={colorPicker.y}
          onSelectColor={handleChangeColor}
          onDelete={handleDeleteHighlight}
          onClose={() => setColorPicker({ ...colorPicker, visible: false })}
        />
      )}
    </div>
  );
};

export default InfographicDisplay;

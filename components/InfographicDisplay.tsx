import React, { useState, useCallback, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import type { InfographicData } from '../types';
import SummaryCard from './SummaryCard';
import StatCard from './StatCard';
import FactCard from './FactCard';
import UPSCInsightCard from './UPSCInsightCard';
import ColorPickerPopup from './ColorPickerPopup';
import { IconChartBar } from './icons/IconChartBar';
import { IconClipboardList } from './icons/IconClipboardList';
import { IconBookOpen } from './icons/IconBookOpen';
import { IconDownload } from './icons/IconDownload';

interface InfographicDisplayProps {
  data: InfographicData;
  onUpdateField: (analysisId: string, fieldPath: string, value: any) => void;
}

const InfographicDisplay: React.FC<InfographicDisplayProps> = ({ data, onUpdateField }) => {
  const infographicRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [colorPickerState, setColorPickerState] = useState<{
    x: number;
    y: number;
    target: HTMLElement | null;
    fieldPath: string;
  } | null>(null);

  const handleUpdate = useCallback((fieldPath: string, value: any) => {
    onUpdateField(data.id, fieldPath, value);
  }, [data.id, onUpdateField]);

  const openColorPicker = useCallback((target: HTMLElement, fieldPath: string) => {
    const rect = target.getBoundingClientRect();
    setColorPickerState({
      x: rect.left,
      y: rect.bottom,
      target,
      fieldPath,
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (colorPickerState && !(event.target as HTMLElement).closest('.color-picker-popup')) {
            setColorPickerState(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [colorPickerState]);

  const handleSelectColor = (color: string) => {
    if (colorPickerState?.target) {
        colorPickerState.target.style.backgroundColor = color;
        const container = colorPickerState.target.closest('[data-field-path]');
        if (container) {
            handleUpdate(colorPickerState.fieldPath, (container as HTMLElement).innerHTML);
        }
    }
    setColorPickerState(null);
  };

  const handleDeleteHighlight = () => {
    if (colorPickerState?.target) {
        const parent = colorPickerState.target.parentElement;
        if (parent) {
            const text = document.createTextNode(colorPickerState.target.textContent || '');
            parent.replaceChild(text, colorPickerState.target);
            parent.normalize();
            handleUpdate(colorPickerState.fieldPath, parent.innerHTML);
        }
    }
    setColorPickerState(null);
  };

  const handleDownload = async () => {
    if (!infographicRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
        const elementToCapture = infographicRef.current;
        const canvas = await html2canvas(elementToCapture, {
            backgroundColor: '#0a0a0a',
            scale: 2,
            useCORS: true,
        });

        const link = document.createElement('a');
        link.download = `${data.title.replace(/[\s/]/g, '_').toLowerCase()}_infographic.png`;
        link.href = canvas.toDataURL('image/png', 0.95);
        link.click();

    } catch (error) {
        console.error("Error generating download:", error);
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-100 tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
          {data.title}
        </h2>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center justify-center shrink-0 px-4 py-2 text-sm font-medium text-cyan-300 bg-neutral-800 rounded-lg hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-50"
        >
          <IconDownload className="w-4 h-4 mr-2" />
          {isDownloading ? 'Downloading...' : 'Download PNG'}
        </button>
      </div>

      <div ref={infographicRef} className="bg-neutral-950 p-2 sm:p-0 -m-2 sm:m-0">
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 md:p-8 rounded-2xl border border-neutral-800/70 shadow-2xl shadow-black/20">
              <SummaryCard summary={data.summary} onUpdate={handleUpdate} openColorPicker={openColorPicker} />

              {data.keyStats && data.keyStats.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <IconChartBar className="w-6 h-6 text-neutral-500" />
                    <h3 className="text-xl font-semibold text-neutral-300">Key Statistics</h3>
                  </div>
                  <div className="space-y-6">
                    {data.keyStats.map((group, groupIndex) => (
                      (group.stats && group.stats.length > 0) && (
                        <div key={groupIndex}>
                          <h4 className="text-md font-semibold text-neutral-400 mb-3 pl-1">{group.groupName}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {group.stats.map((stat, statIndex) => (
                              <StatCard key={statIndex} value={stat.value} label={stat.label} />
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {data.keyFacts && data.keyFacts.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <IconClipboardList className="w-6 h-6 text-neutral-500" />
                    <h3 className="text-xl font-semibold text-neutral-300">Key Facts</h3>
                  </div>
                  <div className="space-y-2">
                    {data.keyFacts.map((fact, index) => (
                      <FactCard
                        key={index}
                        fact={fact}
                        fieldPath={`keyFacts.${index}`}
                        onUpdate={handleUpdate}
                        openColorPicker={openColorPicker}
                      />
                    ))}
                  </div>
                </div>
              )}

              {data.upscInsights && data.upscInsights.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <IconBookOpen className="w-6 h-6 text-neutral-500" />
                    <h3 className="text-xl font-semibold text-neutral-300">UPSC Insights</h3>
                  </div>
                  <div className="space-y-4">
                    {data.upscInsights.map((insight, index) => (
                      insight.points && insight.points.length > 0 &&
                      <UPSCInsightCard
                        key={index}
                        insight={insight}
                        insightIndex={index}
                        onUpdate={handleUpdate}
                        openColorPicker={openColorPicker}
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>
      </div>
      
      {colorPickerState && (
        <ColorPickerPopup
          x={colorPickerState.x}
          y={colorPickerState.y}
          onSelectColor={handleSelectColor}
          onDelete={handleDeleteHighlight}
          onClose={() => setColorPickerState(null)}
        />
      )}
    </div>
  );
};

export default InfographicDisplay;
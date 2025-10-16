import React, { useRef, useCallback } from 'react';
import { UPSCInsight } from '../types';
import { IconCheckCircle } from './icons/IconCheckCircle';

interface UPSCInsightCardProps {
  insight: UPSCInsight;
  insightIndex: number;
  onUpdate: (fieldPath: string, newHtml: string) => void;
  openColorPicker: (target: HTMLElement, fieldPath: string) => void;
}

const HighlightablePoint: React.FC<{
  pointText: string;
  fieldPath: string;
  onUpdate: (fieldPath: string, newHtml: string) => void;
  openColorPicker: (target: HTMLElement, fieldPath: string) => void;
}> = ({ pointText, fieldPath, onUpdate, openColorPicker }) => {
  const contentRef = useRef<HTMLParagraphElement>(null);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !contentRef.current) return;
    
    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.parentElement;
    if (parentElement && parentElement.closest('.highlight')) {
      selection.removeAllRanges();
      return;
    }
    
    const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const span = document.createElement('span');
    span.id = highlightId;
    span.className = 'highlight';
    span.style.backgroundColor = 'var(--highlight-yellow)';

    try {
      range.surroundContents(span);
      selection.removeAllRanges();
      onUpdate(fieldPath, contentRef.current.innerHTML);
    } catch (e) {
      console.warn("Could not highlight selection:", e);
      selection.removeAllRanges();
    }
  }, [fieldPath, onUpdate]);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('highlight')) {
      openColorPicker(target, fieldPath);
    }
  }, [fieldPath, openColorPicker]);

  return (
    <p 
      ref={contentRef}
      className="text-neutral-300 text-sm mb-1 highlightable-content"
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      data-field-path={fieldPath}
      dangerouslySetInnerHTML={{ __html: pointText }}
    />
  );
};

const UPSCInsightCard: React.FC<UPSCInsightCardProps> = ({ insight, insightIndex, onUpdate, openColorPicker }) => {
  const { category, syllabusDescription, points } = insight;

  if (!points || points.length === 0) {
    return null;
  }

  return (
    <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800">
      <h4 className="font-semibold text-cyan-400">{category}</h4>
      <p className="text-xs text-neutral-500 mb-3 italic">({syllabusDescription})</p>
      <ul className="space-y-4">
        {points.map((pointItem, pointIndex) => (
          <li key={pointIndex} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <IconCheckCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <HighlightablePoint
                pointText={pointItem.point}
                fieldPath={`upscInsights.${insightIndex}.points.${pointIndex}.point`}
                onUpdate={onUpdate}
                openColorPicker={openColorPicker}
              />
              <span className="inline-block bg-purple-500/10 text-purple-300 text-xs font-medium px-2 py-0.5 rounded">
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
import React, { useRef, useCallback } from 'react';
import { IconDocumentText } from './icons/IconDocumentText';

interface SummaryCardProps {
  summary: string;
  onUpdate: (fieldPath: string, newHtml: string) => void;
  openColorPicker: (target: HTMLElement, fieldPath: string) => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, onUpdate, openColorPicker }) => {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const fieldPath = 'summary';

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !contentRef.current) return;
    
    const range = selection.getRangeAt(0);
    if (range.startContainer.parentElement?.closest('.highlight') || range.endContainer.parentElement?.closest('.highlight')) {
      selection.removeAllRanges();
      return;
    }
    
    const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const span = document.createElement('span');
    span.id = highlightId;
    span.className = 'highlight';
    span.style.backgroundColor = 'rgba(74, 222, 128, 0.4)'; // Default green

    try {
      range.surroundContents(span);
      selection.removeAllRanges();
      onUpdate(fieldPath, contentRef.current.innerHTML);
    } catch (e) {
      console.warn("Could not highlight selection:", e);
      selection.removeAllRanges();
    }
  }, [onUpdate]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('highlight')) {
      openColorPicker(target, fieldPath);
    }
  }, [openColorPicker]);

  return (
    <div className="bg-slate-900/70 p-6 rounded-lg border border-slate-700">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
            <IconDocumentText className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-1">Summary</h3>
          <div 
            ref={contentRef}
            className="text-slate-400 leading-relaxed highlightable-content"
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            data-field-path={fieldPath}
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;

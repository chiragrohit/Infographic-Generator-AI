import React, { useRef, useCallback } from 'react';
import { IconCheckCircle } from './icons/IconCheckCircle';

interface FactCardProps {
  fact: string;
  fieldPath: string;
  onUpdate: (fieldPath: string, newHtml: string) => void;
  openColorPicker: (target: HTMLElement, fieldPath: string) => void;
}

const FactCard: React.FC<FactCardProps> = ({ fact, fieldPath, onUpdate, openColorPicker }) => {
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
    <div className="p-4 rounded-lg flex items-start gap-4 transition-colors duration-200 hover:bg-neutral-900">
       <div className="flex-shrink-0 mt-1">
        <IconCheckCircle className="w-5 h-5 text-cyan-400" />
       </div>
      <p 
        ref={contentRef}
        className="text-neutral-300 text-sm highlightable-content flex-1"
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        data-field-path={fieldPath}
        dangerouslySetInnerHTML={{ __html: fact }}
      />
    </div>
  );
};

export default FactCard;
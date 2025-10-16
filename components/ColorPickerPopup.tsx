import React from 'react';
import { IconTrash } from './icons/IconTrash';

interface ColorPickerPopupProps {
  x: number;
  y: number;
  onSelectColor: (color: string) => void;
  onClose: () => void;
  onDelete: () => void;
}

const COLORS = [
  'var(--highlight-yellow)',
  'var(--highlight-blue)',
  'var(--highlight-red)',
  'var(--highlight-green)',
  'var(--highlight-gray)',
];

const ColorPickerPopup: React.FC<ColorPickerPopupProps> = ({ x, y, onSelectColor, onDelete }) => {
  return (
    <div
      className="color-picker-popup fixed z-50 flex items-center gap-2 p-2 bg-neutral-800 rounded-lg shadow-2xl ring-1 ring-white/10 animate-fade-in-fast"
      style={{ top: y + 8, left: x }}
      onClick={e => e.stopPropagation()}
    >
      {COLORS.map(color => (
        <button
          key={color}
          onClick={() => onSelectColor(color)}
          className="w-7 h-7 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-cyan-400"
          style={{ backgroundColor: color.replace(/, \d+\.\d+\)/, ', 1)') }} // Use solid color for swatch
          aria-label={`Select color ${color}`}
        />
      ))}
       <div className="border-l border-neutral-700 h-6 mx-1"></div>
       <button
          onClick={onDelete}
          className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-700 hover:text-red-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-cyan-400"
          aria-label="Remove highlight"
        >
          <IconTrash className="w-4 h-4" />
        </button>
    </div>
  );
};

export default ColorPickerPopup;
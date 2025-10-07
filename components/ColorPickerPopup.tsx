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
  'rgba(74, 222, 128, 0.4)', // green
  'rgba(250, 204, 21, 0.4)',  // yellow
  'rgba(248, 113, 113, 0.4)', // red
  'rgba(96, 165, 250, 0.4)',  // blue
  'rgba(192, 132, 252, 0.4)', // purple
];

const ColorPickerPopup: React.FC<ColorPickerPopupProps> = ({ x, y, onSelectColor, onDelete }) => {
  return (
    <div
      className="color-picker-popup fixed z-50 flex items-center gap-2 p-2 bg-slate-700 rounded-lg shadow-2xl ring-1 ring-white/10 animate-fade-in-fast"
      style={{ top: y + 8, left: x }}
      onClick={e => e.stopPropagation()}
    >
      {COLORS.map(color => (
        <button
          key={color}
          onClick={() => onSelectColor(color)}
          className="w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:ring-cyan-400"
          style={{ backgroundColor: color.replace('0.4', '1') }} // Use solid color for swatch
          aria-label={`Select color ${color}`}
        />
      ))}
       <div className="border-l border-slate-600 h-6 mx-1"></div>
       <button
          onClick={onDelete}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-600 hover:text-red-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:ring-cyan-400"
          aria-label="Remove highlight"
        >
          <IconTrash className="w-5 h-5" />
        </button>
    </div>
  );
};

export default ColorPickerPopup;

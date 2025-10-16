import React from 'react';
import type { InfographicData } from '../types';
import { IconPlus } from './icons/IconPlus';
import { IconTrash } from './icons/IconTrash';
import { IconSparkles } from './icons/IconSparkles';
import { IconMenu } from './icons/IconMenu';
import { IconX } from './icons/IconX';

interface SidebarProps {
  analyses: InfographicData[];
  activeAnalysisId: string | null;
  onSelectAnalysis: (id: string) => void;
  onNewAnalysis: () => void;
  onDeleteAnalysis: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  analyses,
  activeAnalysisId,
  onSelectAnalysis,
  onNewAnalysis,
  onDeleteAnalysis,
  isOpen,
  setIsOpen,
}) => {

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteAnalysis(id);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-md bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700"
        aria-label="Toggle menu"
      >
        {isOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
      </button>

      <aside
        className={`fixed lg:relative z-20 flex flex-col w-72 bg-neutral-900 border-r border-neutral-800/70 h-full transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center gap-3 p-6 border-b border-neutral-800/70">
           <IconSparkles className="w-8 h-8 text-cyan-400" />
           <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
              Infographic AI
           </h1>
        </div>

        <div className="p-4">
          <button
            onClick={onNewAnalysis}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 font-semibold text-white bg-cyan-600 rounded-lg shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-cyan-500 transition-all duration-300"
          >
            <IconPlus className="w-5 h-5 mr-2" />
            New Analysis
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2 px-2">History</p>
          <ul className="space-y-1">
            {analyses.map(analysis => (
              <li key={analysis.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectAnalysis(analysis.id);
                  }}
                  className={`group flex items-center justify-between p-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeAnalysisId === analysis.id
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'
                  }`}
                >
                  <span className="truncate flex-1 pr-2">{analysis.title}</span>
                  <button
                    onClick={(e) => handleDelete(e, analysis.id)}
                    className="flex-shrink-0 p-1 text-neutral-500 rounded-md hover:bg-neutral-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Delete ${analysis.title}`}
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </a>
              </li>
            ))}
             {analyses.length === 0 && (
                <p className="px-2 py-4 text-sm text-center text-neutral-500">No analyses yet.</p>
             )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
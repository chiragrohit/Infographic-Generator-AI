import React from 'react';
import { IconSparkles } from './icons/IconSparkles';
import { IconPlus } from './icons/IconPlus';

interface WelcomeProps {
    onNewAnalysis: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNewAnalysis }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="p-6 bg-slate-800/50 rounded-full ring-1 ring-white/10 mb-6">
            <IconSparkles className="w-16 h-16 text-cyan-400" />
        </div>
      <h2 className="text-4xl font-bold text-slate-100 mb-2">Welcome to Infographic AI</h2>
      <p className="text-lg text-slate-400 max-w-md mb-8">
        Transform any text into a beautiful, insightful infographic with just one click.
      </p>
      <button
        onClick={onNewAnalysis}
        className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-300"
      >
        <IconPlus className="w-5 h-5 mr-2" />
        Start a New Analysis
      </button>
    </div>
  );
};

export default Welcome;

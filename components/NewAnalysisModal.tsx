import React, { useState, useCallback } from 'react';
import { generateInfographicData } from '../services/geminiService';
import type { InfographicData } from '../types';
import { IconSparkles } from './icons/IconSparkles';
import { IconX } from './icons/IconX';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: InfographicData) => void;
}

const NewAnalysisModal: React.FC<NewAnalysisModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const data = await generateInfographicData(inputText);
      onGenerate(data);
      setInputText(''); // Clear text on success
    } catch (err) {
      console.error(err);
      setError('Failed to generate infographic. Please check your content or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, onGenerate]);

  const exampleText = `The James Webb Space Telescope (JWST) is a space telescope designed primarily to conduct infrared astronomy. As the largest optical telescope in space, its high resolution and sensitivity allow it to view objects too old, distant, or faint for the Hubble Space Telescope. This has enabled a broad range of investigations across many fields of astronomy and cosmology, such as observation of the first stars, the formation of the first galaxies, and detailed atmospheric characterization of potentially habitable exoplanets. The JWST was launched in December 2021. The primary mirror of the JWST, the Optical Telescope Element, consists of 18 hexagonal mirror segments made of gold-plated beryllium, which combine to create a 6.5-meter (21 ft) diameter mirror. This is a significant increase from Hubble's 2.4 m (7.9 ft) mirror. The total project cost is estimated to be around $10 billion. It has detected water on several exoplanets and its operational lifespan is expected to be around 20 years.`;

  const handleExample = () => {
    setInputText(exampleText);
    setError(null);
  };
  
  const handleClose = () => {
    if (isLoading) return;
    onClose();
    // Reset state when closing
    setTimeout(() => {
        setInputText('');
        setError(null);
    }, 300); // delay to allow for closing animation
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in-fast"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-neutral-900 rounded-xl shadow-2xl ring-1 ring-white/10 w-full max-w-2xl m-4 transform transition-all duration-300 ease-in-out"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
            <h2 className="text-2xl font-bold text-neutral-100">New Infographic Analysis</h2>
            <button
                onClick={handleClose}
                className="p-1 rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                aria-label="Close modal"
            >
                <IconX className="w-6 h-6" />
            </button>
        </div>

        <div className="p-6">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your content here..."
                className="w-full h-64 p-4 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-300 placeholder-neutral-500 resize-none"
                disabled={isLoading}
                aria-label="Content for analysis"
            />
             {error && (
                <div className="mt-4 text-center text-red-400 text-sm" role="alert">
                    {error}
                </div>
            )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 bg-neutral-900/80 rounded-b-xl border-t border-neutral-800">
              <button
                onClick={handleExample}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-cyan-400 bg-neutral-800 rounded-lg hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-cyan-500 transition-colors duration-300 disabled:opacity-50"
                disabled={isLoading}
              >
                Load Example
              </button>
              <button
                onClick={handleGenerate}
                disabled={isLoading || !inputText.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <IconSparkles className="w-5 h-5 mr-2" />
                    Generate Infographic
                  </>
                )}
              </button>
            </div>
      </div>
    </div>
  );
};

export default NewAnalysisModal;
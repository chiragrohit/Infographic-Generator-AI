import React, { useState, useEffect, useCallback } from 'react';
import type { InfographicData } from './types';
import Sidebar from './components/Sidebar';
import InfographicDisplay from './components/InfographicDisplay';
import Welcome from './components/Welcome';
import NewAnalysisModal from './components/NewAnalysisModal';

const App: React.FC = () => {
  const [analyses, setAnalyses] = useState<InfographicData[]>([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedAnalyses = localStorage.getItem('infographicAnalyses');
      if (storedAnalyses) {
        setAnalyses(JSON.parse(storedAnalyses));
      }
    } catch (error) {
      console.error("Failed to load analyses from localStorage", error);
      setAnalyses([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('infographicAnalyses', JSON.stringify(analyses));
    } catch (error) {
      console.error("Failed to save analyses to localStorage", error);
    }
  }, [analyses]);

  const handleNewAnalysis = useCallback((data: InfographicData) => {
    setAnalyses(prev => [data, ...prev]);
    setActiveAnalysisId(data.id);
    setIsModalOpen(false);
  }, []);

  const handleDeleteAnalysis = useCallback((id: string) => {
    setAnalyses(prev => {
      const newAnalyses = prev.filter(a => a.id !== id);
      if (activeAnalysisId === id) {
        setActiveAnalysisId(newAnalyses.length > 0 ? newAnalyses[0].id : null);
      }
      return newAnalyses;
    });
  }, [activeAnalysisId]);

  const activeAnalysis = analyses.find(a => a.id === activeAnalysisId);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      <Sidebar
        analyses={analyses}
        activeAnalysisId={activeAnalysisId}
        onSelectAnalysis={(id) => {
          setActiveAnalysisId(id);
          setIsSidebarOpen(false);
        }}
        onNewAnalysis={() => setIsModalOpen(true)}
        onDeleteAnalysis={handleDeleteAnalysis}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {activeAnalysis ? (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <InfographicDisplay data={activeAnalysis} />
          </div>
        ) : (
          <Welcome onNewAnalysis={() => setIsModalOpen(true)} />
        )}
      </main>

      <NewAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleNewAnalysis}
      />
    </div>
  );
};

export default App;

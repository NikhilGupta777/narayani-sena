
import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import Workspace from './components/Workspace';
import CanvasBackground from './components/CanvasBackground';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'workspace'>('landing');

  const enterWorkspace = useCallback(() => {
    setView('workspace');
  }, []);

  const goHome = useCallback(() => {
    setView('landing');
  }, []);

  return (
    <div className="relative min-h-screen font-sans bg-transparent">
      <CanvasBackground />
      <div className="relative z-10">
        {view === 'landing' ? (
          <LandingPage onEnterWorkspace={enterWorkspace} />
        ) : (
          <Workspace onGoHome={goHome} />
        )}
      </div>
    </div>
  );
};

export default App;

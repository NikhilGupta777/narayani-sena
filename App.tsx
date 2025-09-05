
import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';
import CanvasBackground from './components/CanvasBackground';

type Suite = 'creative' | 'email';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'main'>('landing');
  const [initialSuite, setInitialSuite] = useState<Suite>('creative');

  const enterMainApp = useCallback((suite: Suite) => {
    setInitialSuite(suite);
    setView('main');
  }, []);

  const goHome = useCallback(() => {
    setView('landing');
  }, []);

  return (
    <div className="relative min-h-screen font-sans bg-transparent">
      <CanvasBackground />
      <div className="relative z-10">
        {view === 'landing' ? (
          <LandingPage onEnterWorkspace={enterMainApp} />
        ) : (
          <MainApp onGoHome={goHome} initialSuite={initialSuite} />
        )}
      </div>
    </div>
  );
};

export default App;

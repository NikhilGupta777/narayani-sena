
import React, { useState } from 'react';
import CreativeWorkspace from './CreativeWorkspace';
import EmailWorkspace from './EmailWorkspace';
import { BrandLogo, CreativeSuiteIcon, EmailSuiteIcon } from './icons';

interface MainAppProps {
  onGoHome: () => void;
}

type Suite = 'creative' | 'email';

const MainApp: React.FC<MainAppProps> = ({ onGoHome }) => {
  const [activeSuite, setActiveSuite] = useState<Suite>('creative');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-saturate-[1.4] backdrop-blur-md bg-gradient-to-b from-[rgba(12,16,34,0.75)] to-[rgba(12,16,34,0.35)] border-b border-[rgba(255,255,255,0.08)]">
        <div className="container mx-auto px-5">
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3" aria-label="Narayani Sena">
              <BrandLogo className="w-8 h-8 drop-shadow-[0_2px_8px_rgba(241,216,139,0.35)]" />
              <div>
                <div className="font-bold tracking-wide">Narayani Sena</div>
                <div className="text-xs text-[#aeb3c7]">Digital Seva Suites</div>
              </div>
            </div>
            <nav className="flex items-center gap-2 p-1 rounded-xl bg-black/20 border border-[rgba(255,255,255,0.05)]">
                 <button 
                    onClick={() => setActiveSuite('creative')}
                    className={`flex items-center gap-2 px-3.5 py-2 text-sm rounded-lg transition-colors font-medium ${activeSuite === 'creative' ? 'bg-white/10 text-white shadow-inner' : 'text-[#aeb3c7] hover:bg-white/5'}`}
                >
                    <CreativeSuiteIcon className="w-5 h-5" />
                    Creative Workspace
                </button>
                 <button 
                    onClick={() => setActiveSuite('email')}
                    className={`flex items-center gap-2 px-3.5 py-2 text-sm rounded-lg transition-colors font-medium ${activeSuite === 'email' ? 'bg-white/10 text-white shadow-inner' : 'text-[#aeb3c7] hover:bg-white/5'}`}
                >
                    <EmailSuiteIcon className="w-5 h-5" />
                    Email Seva Suite
                </button>
            </nav>
            <button
              onClick={onGoHome}
              className="inline-block px-3.5 py-2.5 text-sm border border-[rgba(255,255,255,0.08)] rounded-xl bg-[rgba(20,25,50,0.35)] hover:translate-y-[-1px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="flex-grow">
        {activeSuite === 'creative' ? <CreativeWorkspace /> : <EmailWorkspace />}
      </div>
      
      <footer className="py-10 text-center text-sm text-[#aeb3c7]">
        <div className="container mx-auto px-5">
          <div>© {new Date().getFullYear()} Narayani Sena — Built with devotion.</div>
        </div>
      </footer>
    </div>
  );
};

export default MainApp;

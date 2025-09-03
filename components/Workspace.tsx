
import React, { useState, useMemo } from 'react';
import ImageGenerator from './ImageGenerator';
import ImageEditor from './ImageEditor';
import VideoGenerator from './VideoGenerator';
import EmailTools from './EmailTools';
import ContentDownloader from './ContentDownloader';
import Dashboard from './Dashboard';
import { BrandLogo, DashboardIcon, FeatureIcon1, EditIcon, VideoIcon, EmailIcon, DownloadIcon } from './icons';

interface WorkspaceProps {
  onGoHome: () => void;
}

type Tool = 'dashboard' | 'image-gen' | 'image-edit' | 'video-gen' | 'email-tools' | 'downloader';

const Workspace: React.FC<WorkspaceProps> = ({ onGoHome }) => {
  const [activeTool, setActiveTool] = useState<Tool>('dashboard');

  const navigationItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { id: 'image-gen', label: 'AI Image Generation', icon: <FeatureIcon1 className="w-5 h-5" /> },
    { id: 'image-edit', label: 'AI Image Editor', icon: <EditIcon className="w-5 h-5" /> },
    { id: 'video-gen', label: 'AI Video Generation', icon: <VideoIcon className="w-5 h-5" /> },
    { id: 'email-tools', label: 'Email Tools', icon: <EmailIcon className="w-5 h-5" /> },
    { id: 'downloader', label: 'Content Downloader', icon: <DownloadIcon className="w-5 h-5" /> },
  ], []);

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard':
        return <Dashboard setActiveTool={setActiveTool} />;
      case 'image-gen':
        return <ImageGenerator />;
      case 'image-edit':
        return <ImageEditor />;
      case 'video-gen':
        return <VideoGenerator />;
      case 'email-tools':
        return <EmailTools />;
      case 'downloader':
        return <ContentDownloader />;
      default:
        return <Dashboard setActiveTool={setActiveTool} />;
    }
  };
  
  const activeLabel = navigationItems.find(item => item.id === activeTool)?.label || 'Dashboard';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-saturate-[1.4] backdrop-blur-md bg-gradient-to-b from-[rgba(12,16,34,0.75)] to-[rgba(12,16,34,0.35)] border-b border-[rgba(255,255,255,0.08)]">
        <div className="container mx-auto px-5">
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3" aria-label="Narayani Sena">
              <BrandLogo className="w-8 h-8 drop-shadow-[0_2px_8px_rgba(241,216,139,0.35)]" />
              <div>
                <div className="font-bold tracking-wide">Narayani Sena</div>
                <div className="text-xs text-[#aeb3c7]">AI Seva Workspace / {activeLabel}</div>
              </div>
            </div>
            <button
              onClick={onGoHome}
              className="inline-block px-3.5 py-2.5 text-sm border border-[rgba(255,255,255,0.08)] rounded-xl bg-[rgba(20,25,50,0.35)] hover:translate-y-[-1px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="flex-grow container mx-auto px-5 py-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <aside>
            <nav className="flex flex-col gap-2">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTool(item.id as Tool)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-sm font-medium ${
                    activeTool === item.id
                      ? 'bg-[rgba(139,184,255,0.15)] text-white'
                      : 'text-[#aeb3c7] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main>
            {renderTool()}
          </main>
        </div>
      </div>

      <footer className="py-10 text-center text-sm text-[#aeb3c7]">
        <div className="container mx-auto px-5">
          <div>© {new Date().getFullYear()} Narayani Sena — Built with devotion.</div>
        </div>
      </footer>
    </div>
  );
};

export default Workspace;

import React, { useState, useMemo } from 'react';
import VideoGenerator from './VideoGenerator';
import ContentDownloader from './ContentDownloader';
import Dashboard from './Dashboard';
import { DashboardIcon, FeatureIcon1, EditIcon, VideoIcon, DownloadIcon } from './icons';

type CreativeTool = 'dashboard' | 'image-gen' | 'image-edit' | 'video-gen' | 'downloader';

const CreativeWorkspace: React.FC = () => {
  const [activeTool, setActiveTool] = useState<CreativeTool>('dashboard');

  const navigationItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { id: 'downloader', label: 'Content Downloader', icon: <DownloadIcon className="w-5 h-5" /> },
    { id: 'image-gen', label: 'AI Image Generation', icon: <FeatureIcon1 className="w-5 h-5" /> },
    { id: 'image-edit', label: 'AI Image Editor', icon: <EditIcon className="w-5 h-5" /> },
    { id: 'video-gen', label: 'AI Video Generation', icon: <VideoIcon className="w-5 h-5" /> },
  ], []);

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard':
        return <Dashboard setActiveTool={setActiveTool} />;
      case 'downloader':
        return <ContentDownloader />;
      // Cases for coming soon tools can render a placeholder or just not be selectable.
      // For now, they are handled by disabling the navigation buttons.
      default:
        return <Dashboard setActiveTool={setActiveTool} />;
    }
  };

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside>
          <h2 className="px-4 text-sm font-semibold text-white/80 tracking-wider">Creative Tools</h2>
          <nav className="mt-4 flex flex-col gap-2">
            {navigationItems.map(item => {
              const isDisabled = ['image-gen', 'image-edit', 'video-gen'].includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && setActiveTool(item.id as CreativeTool)}
                  disabled={isDisabled}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-sm font-medium ${
                    activeTool === item.id
                      ? 'bg-[rgba(139,184,255,0.15)] text-white'
                      : 'text-[#aeb3c7] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {isDisabled && <span className="text-xs ml-auto bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">Soon</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        <main>
          {renderTool()}
        </main>
      </div>
    </div>
  );
};

export default CreativeWorkspace;
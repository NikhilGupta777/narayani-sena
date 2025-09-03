
import React, { useState, useMemo } from 'react';
import EmailDashboard from './EmailDashboard';
import EmailValidator from './EmailValidator';
import CampaignDesigner from './CampaignDesigner';
import ListManager from './ListManager';
import { DashboardIcon, EmailIcon, ListIcon, AnalyticsIcon, CheckCircleIcon } from './icons';

type EmailTool = 'dashboard' | 'validator' | 'designer' | 'manager' | 'analytics';

const EmailWorkspace: React.FC = () => {
  const [activeTool, setActiveTool] = useState<EmailTool>('dashboard');

  const navigationItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { id: 'validator', label: 'Email Validator', icon: <CheckCircleIcon className="w-5 h-5" /> },
    { id: 'designer', label: 'Campaign Designer', icon: <EmailIcon className="w-5 h-5" /> },
    { id: 'manager', label: 'List Manager', icon: <ListIcon className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon className="w-5 h-5" /> },
  ], []);

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard':
        return <EmailDashboard setActiveTool={setActiveTool} />;
      case 'validator':
        return <EmailValidator />;
      case 'designer':
        return <CampaignDesigner />;
      case 'manager':
        return <ListManager />;
      case 'analytics':
        return (
            <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-4xl mx-auto text-center">
                 <AnalyticsIcon className="w-10 h-10 mx-auto text-yellow-300" />
                <h2 className="text-2xl font-bold mt-4">Analytics Dashboard</h2>
                <p className="mt-2 text-[#aeb3c7]">Performance metrics for your email campaigns are coming soon.</p>
            </div>
        );
      default:
        return <EmailDashboard setActiveTool={setActiveTool} />;
    }
  };

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside>
            <h2 className="px-4 text-sm font-semibold text-white/80 tracking-wider">Email Seva Tools</h2>
            <nav className="mt-4 flex flex-col gap-2">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => item.id !== 'analytics' && setActiveTool(item.id as EmailTool)}
                disabled={item.id === 'analytics'}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-sm font-medium ${
                  activeTool === item.id
                    ? 'bg-[rgba(139,184,255,0.15)] text-white'
                    : 'text-[#aeb3c7] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                } ${item.id === 'analytics' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'analytics' && <span className="text-xs ml-auto bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">Soon</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main>
          {renderTool()}
        </main>
      </div>
    </div>
  );
};

export default EmailWorkspace;

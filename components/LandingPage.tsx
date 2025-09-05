
import React, { useState, useEffect } from 'react';
import { BrandLogo, CreativeSuiteIcon, EmailSuiteIcon } from './icons';

type Suite = 'creative' | 'email';

interface LandingPageProps {
  onEnterWorkspace: (suite: Suite) => void;
}

const Header: React.FC = () => (
  <header className="sticky top-0 z-40 backdrop-saturate-[1.4] backdrop-blur-md bg-gradient-to-b from-[rgba(12,16,34,0.75)] to-[rgba(12,16,34,0.35)] border-b border-[rgba(255,255,255,0.08)]">
    <div className="container mx-auto px-5">
      <div className="flex items-center justify-between py-3.5">
        <div className="flex items-center gap-3" aria-label="Narayani Sena">
          <BrandLogo className="w-8 h-8 drop-shadow-[0_2px_8px_rgba(241,216,139,0.35)]" />
          <div>
            <div className="font-bold tracking-wide">Narayani Sena</div>
            <div className="text-xs text-[#aeb3c7]">Workspace for Mahaprabhuji’s Devotees</div>
          </div>
        </div>
        <nav className="flex items-center space-x-2">
          <a className="inline-block px-3.5 py-2.5 text-sm border border-[rgba(255,255,255,0.08)] rounded-xl bg-[rgba(20,25,50,0.35)] hover:translate-y-[-1px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform" href="#workspaces">Workspaces</a>
        </nav>
      </div>
    </div>
  </header>
);

const WorkspaceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ icon, title, children, onClick }) => (
    <button
        onClick={onClick}
        className="text-left w-full border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl backdrop-saturate-[1.4] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out group"
    >
        <div className="flex items-center gap-4">
            <div className="bg-white/5 p-3 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-[#aeb3c7] text-sm leading-relaxed mt-4 m-0">{children}</p>
        <div className="mt-5 text-sm font-semibold text-[#f1d88b] opacity-0 group-hover:opacity-100 transition-opacity">
            Enter Workspace &rarr;
        </div>
    </button>
);


const Footer: React.FC = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    useEffect(() => {
        setYear(new Date().getFullYear());
    },[]);

    return (
        <footer className="py-10 text-center text-sm text-[#aeb3c7]">
            <div className="container mx-auto px-5">
                <div>© {year} Narayani Sena — Built with devotion.</div>
                <div className="mt-1.5">Note: Download and sharing tools must respect copyright & platform terms.</div>
            </div>
        </footer>
    );
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterWorkspace }) => {
  return (
    <>
      <Header />
      <main>
        <section className="container mx-auto px-5 py-20 md:py-28 text-center grid place-items-center" aria-label="Hero">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-3xl">Welcome to the Narayani Sena</h1>
          <p className="max-w-3xl mx-auto mt-4 text-base md:text-lg text-[#aeb3c7]">A digital seva workspace harmonizing devotion and technology — AI media tools, email automations, and a serene community space.</p>
          <div className="mt-8 flex gap-4 justify-center text-sm text-[#aeb3c7]" aria-label="Highlights">
            <span>⚡ AI-Powered Creativity</span>
            <span>✉️ Devotee Engagement</span>
            <span>🙏 Built for Seva</span>
          </div>
        </section>

        <section id="workspaces" className="container mx-auto px-5 py-12" aria-label="Workspaces">
            <h2 className="text-center text-3xl font-bold mb-8">Choose Your Workspace</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <WorkspaceCard 
                    icon={<CreativeSuiteIcon className="w-8 h-8 text-[#f1d88b]" />} 
                    title="Creative Workspace"
                    onClick={() => onEnterWorkspace('creative')}
                >
                    Access tools for downloading online content for satsang use and other divine media resources. AI-powered creative tools are coming soon!
                </WorkspaceCard>
                <WorkspaceCard 
                    icon={<EmailSuiteIcon className="w-8 h-8 text-[#8bb8ff]" />} 
                    title="Email Seva Suite"
                    onClick={() => onEnterWorkspace('email')}
                >
                    Manage devotee engagement with tools for email validation, campaign design, and subscriber list management.
                </WorkspaceCard>
            </div>
        </section>
        
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
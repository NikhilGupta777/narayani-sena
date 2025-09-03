
import React, { useState, useEffect } from 'react';
import { BrandLogo, FeatureIcon1, FeatureIcon2, FeatureIcon3, VideoIcon, EmailIcon, DownloadIcon } from './icons';

interface LandingPageProps {
  onEnterWorkspace: () => void;
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
          <a className="inline-block px-3.5 py-2.5 text-sm border border-[rgba(255,255,255,0.08)] rounded-xl bg-[rgba(20,25,50,0.35)] hover:translate-y-[-1px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform" href="#features">Features</a>
          <a className="inline-block px-3.5 py-2.5 text-sm border border-[rgba(255,255,255,0.08)] rounded-xl bg-[rgba(20,25,50,0.35)] hover:translate-y-[-1px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform" href="#newsletter">Join</a>
        </nav>
      </div>
    </div>
  </header>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <article className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3]">
        {icon}
        <h3 className="mt-1.5 mb-1.5 text-lg font-semibold">{title}</h3>
        <p className="text-[#aeb3c7] text-sm leading-relaxed m-0">{children}</p>
    </article>
);


const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'ok' | 'err' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!re.test(email)) {
      setMessage({ text: 'Please enter a valid email address.', type: 'err' });
      return;
    }

    setLoading(true);
    try {
      const list = JSON.parse(localStorage.getItem('ns_subscribers') || '[]');
      if (list.includes(email.toLowerCase())) {
        setMessage({ text: 'You are already subscribed. Jai Shree Madhav! 🙏', type: 'ok' });
      } else {
        list.push(email.toLowerCase());
        localStorage.setItem('ns_subscribers', JSON.stringify(list));
        setMessage({ text: 'Subscribed locally. Connect backend /api/subscribe to persist.', type: 'ok' });
        setEmail('');
      }
    } catch (error) {
        setMessage({ text: 'An error occurred.', type: 'err' });
    } finally {
        setTimeout(() => setLoading(false), 900);
    }
  };

  return (
    <div id="newsletter" className="card" role="region" aria-labelledby="joinTitle">
      <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3]">
        <h3 id="joinTitle" className="text-xl font-bold">Join the Devotee Newsletter</h3>
        <p className="text-sm text-[#aeb3c7] mt-1">Stay informed with seva updates and festival greetings. (Local demo: stored in your browser only.)</p>
        <form className="mt-4 grid md:grid-cols-[1fr_auto] gap-3 items-center" onSubmit={handleSubmit} noValidate>
          <label className="sr-only" htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none text-base placeholder-[#9096ad] focus:border-[#9ad7ff] focus:ring-2 focus:ring-[rgba(154,215,255,0.15)]"
          />
          <button className="btn primary w-full md:w-auto" type="submit" aria-label="Subscribe" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <div className={`mt-2 text-sm ${message.type === 'ok' ? 'text-green-300' : 'text-red-400'}`} role="status" aria-live="polite">
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

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
      <style>{`
        .btn {
          padding: 12px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; font-weight: 600;
          color: #e9ecf6; transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .btn.primary {
          background: linear-gradient(180deg, rgba(241, 216, 139, .18), rgba(241, 216, 139, .06));
          box-shadow: 0 6px 18px rgba(241, 216, 139, .08), inset 0 1px rgba(255, 255, 255, .08);
        }
        .btn.primary:hover {
          transform: translateY(-2px); box-shadow: 0 10px 24px rgba(241, 216, 139, .18);
        }
        .btn.secondary {
          background: linear-gradient(180deg, rgba(139, 184, 255, .16), rgba(139, 184, 255, .06));
          box-shadow: 0 6px 18px rgba(139, 184, 255, .12), inset 0 1px rgba(255, 255, 255, .06);
        }
        .btn.secondary:hover {
          transform: translateY(-2px); box-shadow: 0 10px 24px rgba(139, 184, 255, .18);
        }
      `}</style>
      <Header />
      <main>
        <section className="container mx-auto px-5 py-20 text-center grid place-items-center" aria-label="Hero">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-3xl">Welcome to the Narayani Sena</h1>
          <p className="max-w-3xl mx-auto mt-4 text-base md:text-lg text-[#aeb3c7]">A digital seva workspace harmonizing devotion and technology — AI media tools, email automations, and a serene community space.</p>
          <div className="mt-8 flex gap-3 flex-wrap justify-center" role="group" aria-label="Primary actions">
            <button className="btn primary" onClick={onEnterWorkspace} type="button">Enter Workspace</button>
            <a className="btn secondary" href="#newsletter">Join the Devotee Newsletter</a>
          </div>
          <div className="mt-5 flex gap-4 justify-center text-sm text-[#aeb3c7]" aria-label="Highlights">
            <span>⚡ AI Image & Video</span>
            <span>✉️ Auto Emails</span>
            <span>⬇️ Social Video Tools</span>
          </div>
        </section>

        <section id="features" className="container mx-auto px-5 py-12" aria-label="Features">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FeatureCard icon={<FeatureIcon1 />} title="AI Creative Suite">
                    Generate and edit devotional posters with text prompts. Create stunning visuals for festivals and events.
                </FeatureCard>
                <FeatureCard icon={<VideoIcon />} title="AI Video Generation">
                    Bring stories to life by creating short, animated video reels from a simple description. Perfect for social sharing.
                </FeatureCard>
                <FeatureCard icon={<EmailIcon />} title="Devotee Engagement">
                   Validate devotee email lists and design beautiful, automated emails for festivals and announcements.
                </FeatureCard>
                <FeatureCard icon={<DownloadIcon />} title="Satsang Utilities">
                    Download permissible online content for offline satsang use, always respecting platform policies.
                </FeatureCard>
            </div>
        </section>
        
        <section className="container mx-auto px-5 py-12" aria-label="Newsletter">
          <NewsletterForm />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;

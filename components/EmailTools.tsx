
import React, { useState } from 'react';
import { EmailIcon, CheckCircleIcon, XCircleIcon } from './icons';
import { validateEmail } from '../services/geminiService';


const EmailValidator: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ message: string; type: 'ok' | 'err' } | null>(null);

    const handleValidation = async () => {
        if (!email || isLoading) return;

        setIsLoading(true);
        setResult(null);
        
        // Basic client-side check first
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!re.test(email)) {
            setResult({ message: 'Please enter a valid email address format.', type: 'err' });
            setIsLoading(false);
            return;
        }

        try {
            const response = await validateEmail(email);
            if (response.ok) {
                setResult({ message: 'Email syntax appears valid and is ready for use.', type: 'ok' });
            } else {
                setResult({ message: `Validation failed: ${response.reason || 'Unknown reason'}.`, type: 'err' });
            }
        } catch (error) {
            setResult({ message: error instanceof Error ? error.message : 'An unknown error occurred.', type: 'err' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <h3 className="text-lg font-semibold text-white">Advanced Email Validation</h3>
            <p className="text-sm text-[#aeb3c7] mt-1 mb-4">Perform a comprehensive, multi-step check to verify email deliverability and quality.</p>
            <div className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="devotee@example.com"
                    disabled={isLoading}
                    className="flex-grow px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none text-base placeholder-[#9096ad] focus:border-[#9ad7ff] focus:ring-2 focus:ring-[rgba(154,215,255,0.15)]"
                />
                <button onClick={handleValidation} disabled={isLoading || !email} className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] font-semibold bg-gradient-to-b from-[rgba(139,184,255,0.16)] to-[rgba(139,184,255,0.06)] text-[#e9ecf6] hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Validating...' : 'Validate'}
                </button>
            </div>
            
            <div className="mt-6">
                {isLoading && (
                     <div className="text-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mx-auto"></div>
                        <p className="mt-3 text-sm text-[#aeb3c7]">Performing validation checks...</p>
                    </div>
                )}
                {result && (
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.type === 'ok' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                        {result.type === 'ok' ? <CheckCircleIcon className="w-6 h-6 flex-shrink-0" /> : <XCircleIcon className="w-6 h-6 flex-shrink-0" />}
                        <p className="text-sm font-medium">{result.message}</p>
                    </div>
                )}
            </div>

             <p className="text-xs text-center text-[#aeb3c7] mt-3 px-2">
                This tool performs a syntax check. Full deliverability checks require server configuration. See `README.md`.
            </p>
        </div>
    );
};

const AutoEmailer: React.FC = () => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-white">Auto-Emailer Campaign Designer</h3>
            <p className="text-sm text-[#aeb3c7] mt-1 mb-4">Compose and preview automated emails for festivals and announcements. (This is a UI mockup).</p>
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Email Subject (e.g., Janmashtami Greetings!)" className="w-full px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none placeholder-[#9096ad] focus:border-[#9ad7ff] focus:ring-2 focus:ring-[rgba(154,215,255,0.15)]" />
                    <textarea placeholder="Compose your email body here. You can use placeholders like {{devotee_name}}." className="w-full h-48 p-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none placeholder-[#9096ad] focus:border-[#9ad7ff] focus:ring-2 focus:ring-[rgba(154,215,255,0.15)] resize-y" />
                    <button className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] font-semibold bg-gradient-to-b from-[rgba(241,216,139,0.18)] to-[rgba(241,216,139,0.06)] text-[#e9ecf6] hover:-translate-y-0.5 transition-transform disabled:opacity-50" disabled>Save Template (Disabled)</button>
                </div>
                <div className="border border-[rgba(255,255,255,0.1)] rounded-xl p-4 bg-black/20">
                    <h4 className="text-md font-bold text-white mb-2">Live Preview</h4>
                    <div className="bg-white text-gray-800 p-4 rounded-md text-sm">
                        <p className="font-bold">Subject: Janmashtami Greetings!</p>
                        <hr className="my-2" />
                        <p>Jai Shree Madhav, Devotee!</p>
                        <p className="mt-2">Wishing you and your family a blessed Janmashtami. May Lord Krishna's blessings always be upon you.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmailTools: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'validator' | 'emailer'>('validator');

    return (
        <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <EmailIcon />
                <h2 className="text-xl font-bold">Email Seva Tools</h2>
            </div>
            
            <div className="border-b border-[rgba(255,255,255,0.1)] mt-4 mb-6">
                <nav className="flex -mb-px gap-4">
                    <button onClick={() => setActiveTab('validator')} className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'validator' ? 'border-[#f1d88b] text-white' : 'border-transparent text-[#aeb3c7] hover:text-white'}`}>
                        Validator
                    </button>
                    <button onClick={() => setActiveTab('emailer')} className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'emailer' ? 'border-[#f1d88b] text-white' : 'border-transparent text-[#aeb3c7] hover:text-white'}`}>
                        Auto-Emailer
                    </button>
                </nav>
            </div>

            {activeTab === 'validator' ? <EmailValidator /> : <AutoEmailer />}
        </div>
    );
};

export default EmailTools;
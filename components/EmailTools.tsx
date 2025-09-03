
import React, { useState } from 'react';
import { EmailIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ClockIcon } from './icons';

type ValidationStatus = 'pending' | 'success' | 'failure' | 'warning';

interface ValidationStep {
    name: string;
    status: ValidationStatus;
    message: string;
}

const initialValidationSteps: ValidationStep[] = [
    { name: 'Syntax & RFC Check', status: 'pending', message: 'Awaiting input...' },
    { name: 'Disposable Domain Detection', status: 'pending', message: 'Awaiting syntax check...' },
    { name: 'Role-Based Account Filter', status: 'pending', message: 'Awaiting domain analysis...' },
    { name: 'MX Record Check', status: 'pending', message: 'Awaiting server...' },
    { name: 'SMTP Handshake', status: 'pending', message: 'Awaiting server...' },
    { name: 'DNS Blacklist Check', status: 'pending', message: 'Awaiting server...' },
];

const disposableDomains = new Set(['10minutemail.com', 'temp-mail.org', 'guerrillamail.com', 'mailinator.com', 'throwawaymail.com', 'getnada.com', 'maildrop.cc']);
const roleBasedPrefixes = new Set(['admin', 'support', 'sales', 'info', 'noreply', 'contact', 'abuse', 'postmaster', 'webmaster', 'help', 'team']);


const EmailValidator: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [steps, setSteps] = useState<ValidationStep[]>(initialValidationSteps);
    const [finalVerdict, setFinalVerdict] = useState<{ score: number; verdict: string; color: string } | null>(null);

    const updateStep = (index: number, status: ValidationStatus, message: string) => {
        setSteps(prev => {
            const newSteps = [...prev];
            newSteps[index] = { ...newSteps[index], status, message };
            return newSteps;
        });
    };
    
    const handleValidation = async () => {
        if (!email || isLoading) return;

        setIsLoading(true);
        setSteps(initialValidationSteps);
        setFinalVerdict(null);
        let score = 100;

        // --- Step 1: Syntax & RFC Check (Client-side) ---
        updateStep(0, 'pending', 'Checking format...');
        const rfcRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
        if (!rfcRegex.test(email)) {
            updateStep(0, 'failure', 'Invalid email format according to RFC standards.');
            setFinalVerdict({ score: 0, verdict: 'Undeliverable', color: 'bg-red-500/20 text-red-300' });
            setIsLoading(false);
            return;
        }
        updateStep(0, 'success', 'Email syntax is valid.');
        const [localPart, domain] = email.split('@');
        
        // --- Step 2: Disposable Domain (Client-side) ---
        if (disposableDomains.has(domain.toLowerCase())) {
            updateStep(1, 'failure', 'This is a temporary/disposable email address.');
            score = 0; // Critical failure
        } else {
            updateStep(1, 'success', 'Domain is not a known disposable provider.');
        }

        // --- Step 3: Role-Based Account (Client-side) ---
        if (roleBasedPrefixes.has(localPart.toLowerCase())) {
            updateStep(2, 'warning', `This is a role-based address (${localPart}@).`);
            score -= 25;
        } else {
            updateStep(2, 'success', 'Address does not appear to be role-based.');
        }

        // If client-side checks fail critically, stop here.
        if (score <= 0) {
             setFinalVerdict({ score: 0, verdict: 'Undeliverable', color: 'bg-red-500/20 text-red-300' });
             setIsLoading(false);
             return;
        }
        
        // --- Step 4, 5, 6: Server-Side Checks ---
        try {
            updateStep(3, 'pending', 'Querying DNS for MX records...');
            updateStep(4, 'pending', 'Attempting connection to mail server...');
            updateStep(5, 'pending', 'Checking domain reputation...');

            const response = await fetch('/api/validate-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server responded with status ${response.status}`);
            }

            const results = await response.json();
            
            // MX Check
            updateStep(3, results.mxCheck.valid ? 'success' : 'failure', results.mxCheck.message);
            if(!results.mxCheck.valid) score = 0;

            // SMTP Check
            updateStep(4, results.smtpCheck.valid ? 'success' : 'failure', results.smtpCheck.message);
            if(!results.smtpCheck.valid) score = 0;

            // DNSBL Check
            updateStep(5, results.dnsblCheck.valid ? 'success' : 'warning', results.dnsblCheck.message);
            if(!results.dnsblCheck.valid) score -= 20;

        } catch (error) {
            const serverMessage = "Could not connect to the validation service. The backend may not be available.";
            updateStep(3, 'failure', serverMessage);
            updateStep(4, 'failure', serverMessage);
            updateStep(5, 'failure', serverMessage);
            score = 0;
        }

        // --- Final Verdict ---
        score = Math.max(0, score);
        let verdict = 'Deliverable';
        let color = 'bg-green-500/20 text-green-300';
        if (score < 50) {
            verdict = 'Undeliverable';
            color = 'bg-red-500/20 text-red-300';
        } else if (score < 90) {
            verdict = 'Risky';
            color = 'bg-yellow-500/20 text-yellow-300';
        }
        setFinalVerdict({ score, verdict, color });

        setIsLoading(false);
    };

    const StatusIcon = ({ status }: { status: ValidationStatus }) => {
        switch (status) {
            case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
            case 'failure': return <XCircleIcon className="w-5 h-5 text-red-400" />;
            case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
            case 'pending': return isLoading ? <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin"></div> : <ClockIcon className="w-5 h-5 text-slate-500" />;
            default: return null;
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
            
            <div className="mt-6 border border-[rgba(255,255,255,0.08)] bg-black/10 rounded-xl p-4">
                <h4 className="text-md font-semibold mb-3">Validation Report</h4>
                <div className="space-y-3">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3 text-sm">
                            <div className="w-5 h-5 flex-shrink-0 mt-0.5"><StatusIcon status={step.status} /></div>
                            <div>
                                <p className="font-medium text-white">{step.name}</p>
                                <p className="text-xs text-[#aeb3c7]">{step.message}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {finalVerdict && (
                    <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)] flex justify-between items-center">
                        <div className="text-sm font-bold">Overall Result:</div>
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-medium text-white">Score: {finalVerdict.score}/100</span>
                             <span className={`px-3 py-1 text-xs font-bold rounded-full ${finalVerdict.color}`}>
                                {finalVerdict.verdict}
                            </span>
                        </div>
                    </div>
                )}
            </div>
             <p className="text-xs text-center text-[#aeb3c7] mt-3 px-2">
                This tool performs live network checks which may take a few moments. For the backend setup, see `README.md`.
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

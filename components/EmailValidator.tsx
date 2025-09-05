
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from './icons';
import { validateEmail, ValidationResult } from '../services/geminiService';

const EmailValidator: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [result, setResult] = useState<ValidationResult | null>(null);

    useEffect(() => {
        let timer1: number, timer2: number;
        if (isLoading) {
            setLoadingMessage('Performing syntax check...');
            timer1 = window.setTimeout(() => setLoadingMessage('Verifying domain (MX records)...'), 700);
            timer2 = window.setTimeout(() => setLoadingMessage('Attempting SMTP handshake...'), 2000);
        }
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [isLoading]);

    const handleValidation = async () => {
        if (!email || isLoading) return;

        setIsLoading(true);
        setResult(null);
        
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!re.test(email)) {
            setResult({ status: 'invalid', message: 'Invalid Format', details: 'Please enter a valid email address format.' });
            setIsLoading(false);
            return;
        }

        try {
            const response = await validateEmail(email);
            setResult(response);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
            setResult({ status: 'invalid', message: 'Validation Error', details: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };
    
    const getResultStyles = (status: ValidationResult['status']) => {
        switch (status) {
            case 'valid':
                return 'bg-green-500/10 border-green-500/20 text-green-300';
            case 'invalid':
                return 'bg-red-500/10 border-red-500/20 text-red-300';
            case 'risky':
                return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
            default:
                return 'bg-gray-500/10 border-gray-500/20 text-gray-300';
        }
    };

    const getResultIcon = (status: ValidationResult['status']) => {
        switch (status) {
            case 'valid': return <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />;
            case 'invalid': return <XCircleIcon className="w-6 h-6 flex-shrink-0" />;
            case 'risky': return <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />;
            default: return null;
        }
    };
    
    return (
        <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-4xl mx-auto">
             <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-7 h-7 text-[#8bb8ff]"/>
                <h2 className="text-xl font-bold">Advanced Email Validation</h2>
            </div>
            <p className="text-sm text-[#aeb3c7] mt-1 mb-4">Perform a comprehensive, multi-step check to verify email deliverability and quality.</p>
            <div className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="devotee@example.com"
                    disabled={isLoading}
                    className="flex-grow px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none text-base placeholder-[#9096ad] focus:border-[#9ad7ff] focus:ring-2 focus:ring-[rgba(154,255,255,0.15)]"
                />
                <button onClick={handleValidation} disabled={isLoading || !email} className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] font-semibold bg-gradient-to-b from-[rgba(139,184,255,0.16)] to-[rgba(139,184,255,0.06)] text-[#e9ecf6] hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Validating...' : 'Validate'}
                </button>
            </div>
            
            <div className="mt-6 min-h-[100px]">
                {isLoading && (
                     <div className="text-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mx-auto"></div>
                        <p className="mt-3 text-sm text-[#aeb3c7]">{loadingMessage}</p>
                    </div>
                )}
                {result && !isLoading && (
                    <div className={`flex items-start gap-3 p-4 rounded-xl border ${getResultStyles(result.status)}`}>
                        {getResultIcon(result.status)}
                        <div>
                            <p className="text-sm font-medium">{result.message}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{result.details}</p>
                        </div>
                    </div>
                )}
            </div>

             <p className="text-xs text-center text-[#aeb3c7] mt-3 px-2">
                This tool performs syntax, domain (MX record), and mailbox (SMTP) checks. Full deliverability cannot be guaranteed.
            </p>
        </div>
    );
};

export default EmailValidator;

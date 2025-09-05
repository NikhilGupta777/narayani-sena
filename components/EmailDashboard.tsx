
import React from 'react';
import { CheckCircleIcon, EmailIcon, ListIcon, AnalyticsIcon } from './icons';

// FIX: Aligned the EmailTool type with the parent component (`EmailWorkspace`) by removing 'manager'.
// This ensures that the `setActiveTool` prop has a compatible function signature.
type EmailTool = 'dashboard' | 'validator' | 'designer' | 'analytics';

interface EmailDashboardProps {
    setActiveTool: (tool: EmailTool) => void;
}

const ToolCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
}> = ({ icon, title, description, onClick, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="text-left border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-lg backdrop-saturate-[1.3] hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
        {icon}
        <h3 className="mt-2 mb-1.5 text-lg font-semibold text-white">{title}</h3>
        <p className="text-[#aeb3c7] text-sm leading-relaxed m-0">{description}</p>
    </button>
);

const EmailDashboard: React.FC<EmailDashboardProps> = ({ setActiveTool }) => {
    return (
        <div>
            <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3]">
                <h1 className="text-2xl font-bold text-white">Email Seva Suite</h1>
                <p className="text-[#aeb3c7] mt-2">
                    A dedicated space for devotee engagement. Validate email lists, design campaigns, and manage your subscribers.
                </p>
            </div>

            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                <ToolCard
                    icon={<CheckCircleIcon className="w-7 h-7 text-[#8bb8ff]"/>}
                    title="Email Validator"
                    description="Verify devotee email addresses for better deliverability."
                    onClick={() => setActiveTool('validator')}
                />
                <ToolCard
                    icon={<EmailIcon />}
                    title="Campaign Designer"
                    description="Design beautiful, automated emails for festivals."
                    onClick={() => setActiveTool('designer')}
                />
                 <div className="relative">
                    <ToolCard
                        icon={<AnalyticsIcon className="w-7 h-7 text-yellow-300"/>}
                        title="Campaign Analytics"
                        description="Track the performance of your email campaigns."
                        onClick={() => {}}
                        disabled={true}
                    />
                    <div className="absolute top-4 right-4 text-xs bg-yellow-500/20 text-yellow-300 px-2.5 py-1 rounded-full font-semibold">
                        Coming Soon
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailDashboard;
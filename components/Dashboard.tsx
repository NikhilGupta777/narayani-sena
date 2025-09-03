
import React from 'react';
import { FeatureIcon1, EditIcon, VideoIcon, EmailIcon, DownloadIcon } from './icons';

type Tool = 'dashboard' | 'image-gen' | 'image-edit' | 'video-gen' | 'email-tools' | 'downloader';

interface DashboardProps {
    setActiveTool: (tool: Tool) => void;
}

const ToolCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="text-left border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-lg backdrop-saturate-[1.3] hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.3)] transition-all duration-200"
    >
        {icon}
        <h3 className="mt-2 mb-1.5 text-lg font-semibold text-white">{title}</h3>
        <p className="text-[#aeb3c7] text-sm leading-relaxed m-0">{description}</p>
    </button>
);


const Dashboard: React.FC<DashboardProps> = ({ setActiveTool }) => {
    return (
        <div>
            <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3]">
                <h1 className="text-2xl font-bold text-white">Welcome, Devotee</h1>
                <p className="text-[#aeb3c7] mt-2">
                    This is your sacred workspace for digital seva. All tools are designed to assist in spreading Mahaprabhuji's message. Select a tool to begin.
                </p>
            </div>

            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ToolCard
                    icon={<FeatureIcon1 />}
                    title="AI Image Generation"
                    description="Create devotional posters from text descriptions."
                    onClick={() => setActiveTool('image-gen')}
                />
                <ToolCard
                    icon={<EditIcon />}
                    title="AI Image Editor"
                    description="Upload and modify existing images with AI."
                    onClick={() => setActiveTool('image-edit')}
                />
                <ToolCard
                    icon={<VideoIcon />}
                    title="AI Video Generation"
                    description="Produce short, divine videos for social media."
                    onClick={() => setActiveTool('video-gen')}
                />
                 <ToolCard
                    icon={<EmailIcon />}
                    title="Email Tools"
                    description="Validate addresses and prepare email campaigns."
                    onClick={() => setActiveTool('email-tools')}
                />
                <ToolCard
                    icon={<DownloadIcon />}
                    title="Content Downloader"
                    description="Save online content for offline satsang use."
                    onClick={() => setActiveTool('downloader')}
                />
            </div>
        </div>
    );
};

export default Dashboard;

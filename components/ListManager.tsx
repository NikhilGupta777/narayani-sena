import React from 'react';
import { ListIcon } from './icons';

const ListManager: React.FC = () => {
    return (
        <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <ListIcon className="w-7 h-7 text-white" />
                <h2 className="text-xl font-bold">Subscriber List Manager</h2>
            </div>
            <p className="text-sm text-[#aeb3c7] mt-1 mb-4">
                View and manage the devotee email list from the newsletter form.
            </p>
            
            <div className="mt-6 text-center p-10 border border-[rgba(255,255,255,0.08)] bg-black/20 rounded-xl">
                <h3 className="text-xl font-bold text-yellow-300">Feature Under Development</h3>
                <p className="mt-2 text-[#aeb3c7]">
                    The backend database for managing subscribers is currently being upgraded for better performance and reliability.
                </p>
                 <p className="mt-1 text-[#aeb3c7]">
                    This tool will be available again shortly. Thank you for your patience.
                </p>
            </div>
        </div>
    );
};

export default ListManager;
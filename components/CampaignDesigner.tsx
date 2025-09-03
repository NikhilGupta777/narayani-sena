
import React from 'react';
import { EmailIcon } from './icons';

const CampaignDesigner: React.FC = () => {
    return (
        <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <EmailIcon />
                <h2 className="text-xl font-bold">Auto-Emailer Campaign Designer</h2>
            </div>
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

export default CampaignDesigner;

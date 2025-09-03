
import React, { useState } from 'react';
import { DownloadIcon } from './icons';

const ContentDownloader: React.FC = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ message: string, type: 'ok' | 'err' } | null>(null);

    const handleDownload = () => {
        if (!url) {
            setResult({ message: 'Please enter a URL to download.', type: 'err' });
            return;
        }

        setIsLoading(true);
        setResult(null);

        // Simulate a backend process
        setTimeout(() => {
            try {
                // Basic URL validation
                new URL(url);
                setResult({ message: 'Download successful! (This is a demonstration). The content is ready for offline use.', type: 'ok' });
            } catch (error) {
                setResult({ message: 'Invalid URL provided. Please check the link and try again.', type: 'err' });
            } finally {
                setIsLoading(false);
            }
        }, 2500);
    };

    return (
        <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <DownloadIcon />
                <h2 className="text-xl font-bold">Satsang Content Downloader</h2>
            </div>
            <p className="text-sm text-[#aeb3c7] mt-2 mb-4">
                Enter a URL to a permissible online video or audio file to prepare it for offline satsang use.
            </p>

            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/satsang-video"
                        disabled={isLoading}
                        className="flex-grow px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none text-base placeholder-[#9096ad] focus:border-[#9ad7ff] focus:ring-2 focus:ring-[rgba(154,215,255,0.15)]"
                    />
                    <button
                        onClick={handleDownload}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] font-semibold bg-gradient-to-b from-[rgba(139,184,255,0.16)] to-[rgba(139,184,255,0.06)] text-[#e9ecf6] hover:-translate-y-0.5 transition-transform disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'Download'}
                    </button>
                </div>

                {isLoading && (
                    <div className="text-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f1d88b] mx-auto"></div>
                        <p className="mt-3 text-sm text-[#aeb3c7]">Contacting service and preparing download...</p>
                    </div>
                )}
                
                {result && (
                    <div className={`mt-2 p-3 rounded-lg text-sm ${result.type === 'ok' ? 'bg-green-900/50 border border-green-500/50 text-green-300' : 'bg-red-900/50 border border-red-500/50 text-red-300'}`}>
                        {result.message}
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-yellow-900/40 border border-yellow-500/30 rounded-lg text-yellow-200 text-xs">
                <h4 className="font-bold mb-1">Important Notice</h4>
                <p>This tool is intended for downloading content where you have permission from the copyright holder or under fair use guidelines. Always respect platform terms of service and copyright laws. Unauthorized downloading and distribution are prohibited.</p>
            </div>
        </div>
    );
};

export default ContentDownloader;


import React, { useState, useCallback } from 'react';
import { generateVideo } from '../services/geminiService';
import { VideoIcon } from './icons';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('A neon hologram of a cat driving a sports car at top speed on a highway in a futuristic city.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading) return;
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setProgressMessage("Starting...");

    try {
      const generatedVideoUrl = await generateVideo(prompt, setProgressMessage);
      setVideoUrl(generatedVideoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setProgressMessage('');
    }
  }, [prompt, isLoading]);

  return (
    <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <VideoIcon />
        <h2 className="text-xl font-bold">AI Video Generation</h2>
      </div>
      <p className="text-sm text-[#aeb3c7] mt-2 mb-4">
        Describe the devotional video you wish to create. Note: Video generation can take several minutes.
      </p>

      <div className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A time-lapse of a lotus flower blooming, with divine light emanating from its center."
          className="w-full h-24 p-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none placeholder-[#9096ad] focus:border-[#9ad7ff] focus:ring-2 focus:ring-[rgba(154,215,255,0.15)] resize-none"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] font-semibold bg-gradient-to-b from-[rgba(241,216,139,0.18)] to-[rgba(241,216,139,0.06)] text-[#e9ecf6] shadow-[0_6px_18px_rgba(241,216,139,0.08)] hover:shadow-[0_10px_24px_rgba(241,216,139,0.18)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Generating...' : 'Generate Video'}
        </button>
      </div>

      {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg">{error}</div>}

      <div className="mt-6 aspect-video w-full bg-black/20 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {isLoading && (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f1d88b] mx-auto"></div>
            <p className="mt-4 text-sm font-medium text-[#f1d88b]">Video Generation In Progress</p>
            <p className="mt-2 text-xs text-[#aeb3c7]">{progressMessage}</p>
          </div>
        )}
        {videoUrl && !isLoading && (
          <video src={videoUrl} controls autoPlay loop className="object-contain w-full h-full" />
        )}
        {!isLoading && !videoUrl && (
            <div className="text-center text-[#aeb3c7] p-4">
                <p>Your generated video will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default VideoGenerator;

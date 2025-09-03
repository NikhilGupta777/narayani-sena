
import React from 'react';
import { VideoIcon } from './icons';

const VideoGenerator: React.FC = () => {
  return (
    <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <VideoIcon />
        <h2 className="text-xl font-bold">AI Video Generation</h2>
      </div>
      
      <div className="mt-6 aspect-video w-full bg-black/20 rounded-xl flex flex-col items-center justify-center border border-[rgba(255,255,255,0.08)] overflow-hidden text-center p-4">
          <h3 className="text-2xl font-bold text-yellow-300">Coming Soon</h3>
          <p className="mt-2 text-[#aeb3c7]">
              The ability to generate divine videos from text is being perfected.
          </p>
          <p className="mt-1 text-[#aeb3c7]">
              This feature will be available shortly. Jai Shree Madhav! 🙏
          </p>
      </div>
    </div>
  );
};

export default VideoGenerator;
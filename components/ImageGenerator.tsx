import React, { useState, useCallback, useMemo } from 'react';
import { generateImage } from '../services/geminiService';
import { FeatureIcon1, NoSymbolIcon, SparklesIcon } from './icons';

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
type ArtStyle = 'None' | 'Photorealistic' | 'Digital Art' | 'Oil Painting' | 'Fantasy' | 'Anime' | 'Vintage';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('A divine poster of Mahaprabhuji, meditating under a banyan tree, with a golden aura.');
  const [negativePrompt, setNegativePrompt] = useState('blurry, text, watermark, deformed');
  const [artStyle, setArtStyle] = useState<ArtStyle>('Digital Art');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading) return;
    setIsLoading(true);
    setError(null);
    setImageUrls([]);

    try {
      const generatedImageUrls = await generateImage(prompt, numberOfImages, aspectRatio, artStyle, negativePrompt);
      setImageUrls(generatedImageUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, numberOfImages, aspectRatio, artStyle, negativePrompt]);
  
  const loadingMessages = useMemo(() => [
    "Evoking divine creativity...",
    "Aligning cosmic energies...",
    "Painting with light and devotion...",
    "Manifesting sacred art...",
    "Gathering celestial inspiration..."
  ], []);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, loadingMessages]);

  const aspectRatioClass = useMemo(() => {
    switch (aspectRatio) {
      case '1:1': return 'aspect-square';
      case '3:4': return 'aspect-[3/4]';
      case '4:3': return 'aspect-[4/3]';
      case '9:16': return 'aspect-[9/16]';
      case '16:9': return 'aspect-video';
      default: return 'aspect-square';
    }
  }, [aspectRatio]);

  return (
    <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <FeatureIcon1 />
        <h2 className="text-xl font-bold">AI Image Generation</h2>
      </div>
      <p className="text-sm text-[#aeb3c7] mt-2 mb-6">
        Describe the devotional image you wish to create. Use the options to refine the output.
      </p>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div className="flex flex-col gap-4">
            <div>
                <label htmlFor="main-prompt" className="block text-sm font-medium text-[#aeb3c7] mb-2">Prompt</label>
                <textarea
                  id="main-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A beautiful painting of Radha and Krishna in a boat on the Yamuna river."
                  className="w-full h-32 p-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none placeholder-[#9096ad] focus:border-[#9ad7ff] focus:ring-2 focus:ring-[rgba(154,215,255,0.15)] resize-y"
                  disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="negative-prompt" className="flex items-center gap-2 text-sm font-medium text-[#aeb3c7] mb-2">
                    <NoSymbolIcon className="w-4 h-4" />
                    Negative Prompt
                </label>
                <textarea
                  id="negative-prompt"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g., blurry, text, watermark, extra fingers"
                  className="w-full h-20 p-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none placeholder-[#9096ad] focus:border-[#9ad7ff] focus:ring-2 focus:ring-[rgba(154,215,255,0.15)] resize-y"
                  disabled={isLoading}
                />
            </div>
        </div>
        <div className="flex flex-col gap-5 border border-[rgba(255,255,255,0.08)] bg-black/10 rounded-xl p-4">
            <div>
                <label htmlFor="artStyle" className="flex items-center gap-2 text-sm font-medium text-[#aeb3c7] mb-2">
                    <SparklesIcon className="w-4 h-4" />
                    Art Style
                </label>
                <select 
                    id="artStyle"
                    value={artStyle}
                    onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
                    disabled={isLoading}
                    className="w-full px-3 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none focus:border-[#9ad7ff] focus:ring-1 focus:ring-[rgba(154,215,255,0.15)]"
                >
                    {['None', 'Photorealistic', 'Digital Art', 'Oil Painting', 'Fantasy', 'Anime', 'Vintage'].map(style => <option key={style} value={style}>{style}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="aspectRatio" className="block text-sm font-medium text-[#aeb3c7] mb-2">Aspect Ratio</label>
                <select 
                    id="aspectRatio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    disabled={isLoading}
                    className="w-full px-3 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none focus:border-[#9ad7ff] focus:ring-1 focus:ring-[rgba(154,215,255,0.15)]"
                >
                    <option value="1:1">Square (1:1)</option>
                    <option value="3:4">Portrait (3:4)</option>
                    <option value="4:3">Landscape (4:3)</option>
                    <option value="9:16">Tall (9:16)</option>
                    <option value="16:9">Widescreen (16:9)</option>
                </select>
            </div>
             <div>
                <label htmlFor="numImages" className="block text-sm font-medium text-[#aeb3c7] mb-2">Number of Images: <span className="font-bold text-white">{numberOfImages}</span></label>
                <input 
                    id="numImages"
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={numberOfImages}
                    onChange={(e) => setNumberOfImages(Number(e.target.value))}
                    disabled={isLoading}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="w-full max-w-xs mx-auto flex justify-center items-center px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] font-semibold bg-gradient-to-b from-[rgba(241,216,139,0.18)] to-[rgba(241,216,139,0.06)] text-[#e9ecf6] shadow-[0_6px_18px_rgba(241,216,139,0.08)] hover:shadow-[0_10px_24px_rgba(241,216,139,0.18)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
      
      {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg max-w-2xl mx-auto">{error}</div>}

      <div className="mt-6">
        {isLoading && (
          <div className={`${aspectRatioClass} w-full max-w-md mx-auto bg-black/20 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.08)] overflow-hidden`}>
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f1d88b] mx-auto"></div>
              <p className="mt-4 text-[#aeb3c7]">{loadingMessage}</p>
            </div>
          </div>
        )}
        
        {imageUrls.length > 0 && !isLoading && (
            <div className={`grid gap-4 ${imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1 place-items-center'}`}>
                {imageUrls.map((url, index) => (
                    <div key={index} className={`${aspectRatioClass} w-full bg-black/20 rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden`}>
                         <img src={url} alt={`${prompt} - result ${index + 1}`} className="object-contain w-full h-full" />
                    </div>
                ))}
            </div>
        )}
        
        {!isLoading && imageUrls.length === 0 && (
            <div className={`${aspectRatioClass} w-full max-w-md mx-auto bg-black/20 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.08)] overflow-hidden`}>
                <div className="text-center text-[#aeb3c7] p-4">
                    <p>Your generated images will appear here.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
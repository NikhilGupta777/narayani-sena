import React, { useState, useCallback, useRef, useEffect } from 'react';
import { editImage } from '../services/geminiService';
import { EditIcon, BrushIcon } from './icons';

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('Add a golden aura around the main subject.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const [brushSize, setBrushSize] = useState(40);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          clearMask();
        }
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(selectedFile);
      setEditedImage(null);
    }
  };
  
  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>): { x: number, y: number } => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsDrawing(true);
    draw(event);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (maskCtx) {
      maskCtx.beginPath();
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoordinates(event);
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (maskCtx) {
      maskCtx.lineTo(x, y);
      maskCtx.stroke();
      maskCtx.beginPath();
      maskCtx.moveTo(x, y);
    }
  };

  const clearMask = () => {
    const canvas = maskCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  useEffect(() => {
    if (originalImage && canvasRef.current && maskCanvasRef.current && containerRef.current) {
        const canvas = canvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        
        // Resize canvas to fit container while maintaining aspect ratio
        const containerWidth = containerRef.current.clientWidth;
        const scale = containerWidth / originalImage.width;
        const canvasHeight = originalImage.height * scale;

        canvas.width = containerWidth;
        canvas.height = canvasHeight;
        maskCanvas.width = containerWidth;
        maskCanvas.height = canvasHeight;
        
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

        if (maskCtx) {
            maskCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            maskCtx.lineWidth = brushSize;
            maskCtx.lineCap = 'round';
            maskCtx.lineJoin = 'round';
        }
    }
  }, [originalImage, brushSize]);

  const handleGenerate = useCallback(async () => {
    if (!prompt || !file || !originalImage || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    const base64Data = originalImage.src.split(',')[1];
    
    // Get mask data URL and convert to base64
    const maskDataUrl = maskCanvasRef.current?.toDataURL('image/png');
    const maskBase64 = maskDataUrl?.split(',')[1];
    if (!maskBase64) {
        setError("Could not generate mask data.");
        setIsLoading(false);
        return;
    }

    try {
      const generatedImageUrl = await editImage(prompt, base64Data, file.type, maskBase64);
      setEditedImage(generatedImageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, file, originalImage, isLoading]);

  return (
    <div className="border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg backdrop-saturate-[1.3] max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <EditIcon />
        <h2 className="text-xl font-bold">AI Image Editor</h2>
      </div>
      <p className="text-sm text-[#aeb3c7] mt-2 mb-4">
        Upload an image, mask the area to change, and describe the edits.
      </p>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* Input Controls */}
        <div className="flex flex-col gap-5">
          <div className="p-4 border border-[rgba(255,255,255,0.08)] bg-black/10 rounded-xl">
            <h3 className="text-base font-semibold mb-2">1. Upload Image</h3>
            <input
              id="file-upload"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          <div className="p-4 border border-[rgba(255,255,255,0.08)] bg-black/10 rounded-xl">
            <h3 className="text-base font-semibold mb-2">2. Mask Area</h3>
             <div>
                <label htmlFor="brushSize" className="flex items-center gap-2 text-sm font-medium text-[#aeb3c7] mb-2">
                    <BrushIcon className="w-4 h-4"/>
                    Brush Size: <span className="font-bold text-white">{brushSize}</span>
                </label>
                <input 
                    id="brushSize"
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    disabled={isLoading || !originalImage}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <button onClick={clearMask} disabled={!originalImage || isLoading} className="mt-3 w-full text-sm text-center py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors disabled:opacity-50">Clear Mask</button>
          </div>

          <div className="p-4 border border-[rgba(255,255,255,0.08)] bg-black/10 rounded-xl">
            <h3 className="text-base font-semibold mb-2">3. Describe Edit</h3>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Change the background to a starry night."
              className="w-full h-24 p-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#e9ecf6] outline-none placeholder-[#9096ad] focus:border-[#9ad7ff] focus:ring-2 focus:ring-[rgba(154,215,255,0.15)] resize-none"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt || !originalImage}
            className="w-full px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] font-semibold bg-gradient-to-b from-[rgba(241,216,139,0.18)] to-[rgba(241,216,139,0.06)] text-[#e9ecf6] shadow-[0_6px_18px_rgba(241,216,139,0.08)] hover:shadow-[0_10px_24px_rgba(241,216,139,0.18)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Applying Edit...' : 'Apply AI Edit'}
          </button>
          {error && <div className="mt-2 p-3 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg">{error}</div>}
        </div>

        {/* Image Previews */}
        <div className="grid grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-[#aeb3c7] mb-2 text-center">Original Image & Masking Area</h3>
            <div ref={containerRef} className="relative aspect-square w-full bg-black/20 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.08)] overflow-hidden">
                {!originalImage ? <p className="text-xs text-center p-2 text-[#aeb3c7]">Upload an image to start</p> :
                  <>
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain" />
                    <canvas ref={maskCanvasRef} 
                      className="absolute inset-0 w-full h-full object-contain cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onMouseMove={draw}
                    />
                  </>
                }
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-[#aeb3c7] mb-2 text-center">Edited Image</h3>
            <div className="aspect-square w-full bg-black/20 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.08)] overflow-hidden">
              {isLoading ? (
                <div className="text-center p-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f1d88b] mx-auto"></div>
                  <p className="mt-3 text-xs text-[#aeb3c7]">Editing...</p>
                </div>
              ) : editedImage ? (
                <img src={editedImage} alt="Edited result" className="object-contain w-full h-full" />
              ) : (
                <p className="text-xs text-center p-2 text-[#aeb3c7]">AI-edited image will appear here</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;

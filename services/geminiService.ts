import { GoogleGenAI, Modality } from "@google/genai";

// FIX: Aligned with coding guidelines by removing manual API key checks and initializing directly.
// It is assumed that process.env.API_KEY is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
type ArtStyle = 'None' | 'Photorealistic' | 'Digital Art' | 'Oil Painting' | 'Fantasy' | 'Anime' | 'Vintage';

export const generateImage = async (prompt: string, numberOfImages: number, aspectRatio: AspectRatio, artStyle: ArtStyle, negativePrompt: string): Promise<string[]> => {
  try {
    let finalPrompt = prompt;
    if (artStyle !== 'None') {
      finalPrompt = `${prompt}, in the style of ${artStyle}`;
    }
    if (negativePrompt) {
      finalPrompt += `. Avoid the following: ${negativePrompt}.`;
    }

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: finalPrompt,
      config: {
        numberOfImages: numberOfImages,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
    } else {
      throw new Error("No images were generated. The response may have been blocked.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('The provided API key is not valid. Please check your configuration.');
        }
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};


export const editImage = async (prompt: string, base64ImageData: string, mimeType: string, maskBase64?: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };
    const textPart = { text: prompt };

    // FIX: Construct the `parts` array for multi-modal content in a single expression.
    // This allows TypeScript to correctly infer the union type for both image and text parts,
    // resolving the type error that occurred when pushing parts of different shapes to the array.
    const parts = [
      imagePart,
      ...(maskBase64
        ? [
            {
              inlineData: {
                data: maskBase64,
                mimeType: 'image/png', // The mask is always a PNG from the canvas
              },
            },
          ]
        : []),
      textPart,
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image was found in the model's response.");
  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while editing the image.");
  }
};


export const generateVideo = async (prompt: string, onProgress: (message: string) => void): Promise<string> => {
    try {
        onProgress("Initializing video generation...");
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1
            }
        });

        onProgress("Generation process started. This may take several minutes...");
        let pollCount = 0;
        while (!operation.done) {
            pollCount++;
            onProgress(`Awaiting result... (check #${pollCount})`);
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation finished, but no download link was provided.");
        }
        
        onProgress("Fetching generated video...");
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);

        if (!response.ok) {
            throw new Error(`Failed to download video file. Status: ${response.status}`);
        }

        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);
        
    } catch (error) {
        console.error("Error generating video with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate video: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the video.");
    }
};

// All direct calls to the Gemini API have been removed from the frontend.
// The frontend now communicates with our own secure backend endpoints.

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
type ArtStyle = 'None' | 'Photorealistic' | 'Digital Art' | 'Oil Painting' | 'Fantasy' | 'Anime' | 'Vintage';

const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred.' }));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const generateImage = async (prompt: string, numberOfImages: number, aspectRatio: AspectRatio, artStyle: ArtStyle, negativePrompt: string): Promise<string[]> => {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, numberOfImages, aspectRatio, artStyle, negativePrompt }),
    });
    const data = await handleApiError(response);
    return data.images;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const editImage = async (prompt: string, base64ImageData: string, mimeType: string, maskBase64?: string): Promise<string> => {
  try {
    const response = await fetch('/api/edit-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, base64ImageData, mimeType, maskBase64 }),
    });
    const data = await handleApiError(response);
    return data.image;
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

export const generateVideo = async (prompt: string, onProgress: (message: string) => void): Promise<string> => {
  try {
    onProgress("Initializing video generation...");
    const initResponse = await fetch('/api/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const { operationName } = await handleApiError(initResponse);

    if (!operationName) {
      throw new Error("Backend did not return an operation name.");
    }

    onProgress("Generation process started. This may take several minutes...");

    return new Promise<string>((resolve, reject) => {
      let pollCount = 0;
      const pollInterval = setInterval(async () => {
        try {
          pollCount++;
          onProgress(`Awaiting result... (check #${pollCount})`);
          const statusResponse = await fetch(`/api/video-status?operationName=${operationName}`);
          const statusData = await handleApiError(statusResponse);

          if (statusData.status === 'complete') {
            clearInterval(pollInterval);
            onProgress("Video ready! Preparing for playback.");
            // The videoUrl is a relative path to our backend which will stream the video
            resolve(statusData.videoUrl);
          } else if (statusData.status === 'error') {
            clearInterval(pollInterval);
            reject(new Error(statusData.error || 'Video generation failed.'));
          }
          // If status is 'processing', do nothing and wait for the next poll.
        } catch (error) {
          clearInterval(pollInterval);
          reject(error);
        }
      }, 10000); // Poll every 10 seconds
    });
  } catch (error) {
    console.error("Error generating video:", error);
    throw error;
  }
};
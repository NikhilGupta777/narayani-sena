// All API calls now go through the backend server.
// Safe access: works during Vite build/preview; avoids runtime error if not bundled.
const API_BASE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE?.replace(/\/+$/, '')) ||
  '';

const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleApiError(response);
}

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
type ArtStyle = 'None' | 'Photorealistic' | 'Digital Art' | 'Oil Painting' | 'Fantasy' | 'Anime' | 'Vintage';

export const generateImage = async (prompt: string, numberOfImages: number, aspectRatio: AspectRatio, artStyle: ArtStyle, negativePrompt: string): Promise<string[]> => {
  const { images } = await postJSON<{ images: string[] }>('/api/generate-image', {
    prompt, numberOfImages, aspectRatio, artStyle, negativePrompt
  });
  return images;
};

export const editImage = async (prompt: string, base64ImageData: string, mimeType: string, maskBase64?: string): Promise<string> => {
    const { image } = await postJSON<{ image: string }>('/api/edit-image', {
        prompt, base64ImageData, mimeType, maskBase64
    });
    return image;
};

// Video generation is now a single long-running request to the backend.
// The `onProgress` callback is used to signal the start of the process.
export const generateVideo = async (prompt: string, onProgress: (message: string) => void): Promise<string> => {
    onProgress("Sending request to server... This may take several minutes as the server processes the video.");
    const { videoUrl } = await postJSON<{ videoUrl: string }>('/api/generate-video', { prompt });
    onProgress("Video is ready!");
    return videoUrl; // This will be a relative URL to our backend proxy.
};

// Email validation now uses a simplified backend endpoint.
export const validateEmail = async (email: string): Promise<{ ok: boolean; reason?: string }> => {
    return await postJSON<{ ok: boolean; reason?: string }>('/api/validate-email', { email });
};
// All API calls now go through the backend server.
// Safe access: works during Vite build/preview; avoids runtime error if not bundled.
const API_BASE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE?.replace(/\/+$/, '')) ||
  '';

const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
    throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
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

async function getJSON<T>(url: string): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`);
    return handleApiError(response);
}


// Video generation is now a single long-running request to the backend.
// The `onProgress` callback is used to signal the start of the process.
/*
export const generateVideo = async (prompt: string, onProgress: (message: string) => void): Promise<string> => {
    onProgress("Sending request to server... This may take several minutes as the server processes the video.");
    const { videoUrl } = await postJSON<{ videoUrl: string }>('/api/generate-video', { prompt });
    onProgress("Video is ready!");
    return videoUrl; // This will be a relative URL to our backend proxy.
};
*/

export interface ValidationResult {
  status: 'valid' | 'invalid' | 'risky';
  message: string;
  details: string;
}

// Email validation now uses a simplified backend endpoint.
export const validateEmail = async (email: string): Promise<ValidationResult> => {
    return await postJSON<ValidationResult>('/api/validate-email', { email });
};

export const getEmailFormatUrl = async (): Promise<string> => {
  const { downloadUrl } = await getJSON<{ downloadUrl: string }>('/api/email-format');
  return downloadUrl;
};
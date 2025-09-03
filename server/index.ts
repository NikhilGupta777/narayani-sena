import express from 'express';
import cors from 'cors';
import dns from 'dns';
import net from 'net';
import * as dnsbl from 'dnsbl';
import { GoogleGenAI, Modality, GenerateContentResponse } from '@google/genai';

// Initialize Gemini AI
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const app = express();
const port = 3001;

// Increased payload limit for base64 image data
app.use(cors());
app.use(express.json({ limit: '10mb' }));

interface ValidationResult {
  valid: boolean;
  message: string;
}

// 1. MX Record Check
const checkMxRecords = async (domain: string): Promise<ValidationResult> => {
  try {
    const addresses = await dns.promises.resolveMx(domain);
    if (addresses && addresses.length > 0) {
      return { valid: true, message: 'MX records found for domain.' };
    }
    return { valid: false, message: 'No MX records found for domain.' };
  } catch (error) {
    return { valid: false, message: 'Domain does not exist or could not be queried.' };
  }
};

// 2. SMTP Handshake
const checkSmtp = (email: string, domain: string): Promise<ValidationResult> => {
    return new Promise(async (resolve) => {
        try {
            const mxRecords = await dns.promises.resolveMx(domain);
            if (!mxRecords || mxRecords.length === 0) {
                return resolve({ valid: false, message: 'No mail server found for domain.' });
            }

            const mailServer = mxRecords[0].exchange;
            const socket = net.createConnection(25, mailServer);
            let step = 0;

            socket.on('data', (data) => {
                const response = data.toString();
                if (response.startsWith('220') && step === 0) {
                    socket.write(`HELO ${domain}\r\n`);
                    step++;
                } else if (response.startsWith('250') && step === 1) {
                    socket.write(`MAIL FROM:<check@example.com>\r\n`);
                    step++;
                } else if (response.startsWith('250') && step === 2) {
                    socket.write(`RCPT TO:<${email}>\r\n`);
                    step++;
                } else if (response.startsWith('250') && step === 3) {
                    resolve({ valid: true, message: 'Mail server accepted the recipient (simulated).' });
                    socket.write('QUIT\r\n');
                    socket.end();
                } else if (response.startsWith('550') && step === 3) {
                    resolve({ valid: false, message: 'Mailbox does not exist (SMTP check failed).' });
                    socket.write('QUIT\r\n');
                    socket.end();
                } else if (parseInt(response.split(' ')[0]) >= 400) {
                     resolve({ valid: false, message: `Mail server responded with an error: ${response.trim()}` });
                     socket.end();
                }
            });

            socket.on('error', (err) => {
                resolve({ valid: false, message: `Connection to mail server failed.` });
                socket.end();
            });

            socket.on('timeout', () => {
                resolve({ valid: false, message: 'Connection to mail server timed out.' });
                socket.end();
            });
            
            socket.setTimeout(5000);

        } catch (error) {
            resolve({ valid: false, message: 'Could not perform SMTP handshake.' });
        }
    });
};

// 3. DNS Blacklist Check
const checkDnsbl = (domain: string): Promise<ValidationResult> => {
    return new Promise(async (resolve) => {
        try {
            const mxRecords = await dns.promises.resolveMx(domain);
            if (!mxRecords || mxRecords.length === 0) {
                return resolve({ valid: false, message: 'No mail server to check.' });
            }
            const mailServerIp = (await dns.promises.resolve(mxRecords[0].exchange))[0];

            dnsbl.lookup(mailServerIp, 'zen.spamhaus.org', (err: Error | null, isBlacklisted?: boolean) => {
                if (err) {
                    return resolve({ valid: true, message: 'Could not verify domain reputation.' });
                }
                if (isBlacklisted) {
                    return resolve({ valid: false, message: 'Mail server IP is listed on a spam blacklist (Spamhaus).' });
                }
                resolve({ valid: true, message: 'Domain has a clean reputation.' });
            });
        } catch (error) {
            resolve({ valid: true, message: 'Could not verify domain reputation.' });
        }
    });
};

// --- API Endpoints ---

const apiErrorHandler = (res: express.Response, error: unknown, defaultMessage: string) => {
  console.error(defaultMessage, error);
  const message = error instanceof Error ? error.message : defaultMessage;
  res.status(500).json({ error: message });
}

app.post('/api/validate-email', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const domain = email.split('@')[1];
  if (!domain) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  try {
    const mxCheck = await checkMxRecords(domain);
    const smtpCheck = mxCheck.valid ? await checkSmtp(email, domain) : { valid: false, message: 'Cannot perform SMTP check without valid MX records.' };
    const dnsblCheck = mxCheck.valid ? await checkDnsbl(domain) : { valid: false, message: 'Cannot perform DNSBL check without valid MX records.' };

    res.json({
      mxCheck,
      smtpCheck,
      dnsblCheck,
    });
  } catch (error) {
    apiErrorHandler(res, error, 'An unexpected error occurred during validation.');
  }
});

app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, numberOfImages, aspectRatio, artStyle, negativePrompt } = req.body;
        let finalPrompt = prompt;
        if (artStyle && artStyle !== 'None') finalPrompt = `${prompt}, in the style of ${artStyle}`;
        if (negativePrompt) finalPrompt += `. Avoid the following: ${negativePrompt}.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalPrompt,
            config: {
                numberOfImages,
                outputMimeType: 'image/png',
                aspectRatio,
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            return res.status(500).json({ error: "No images were generated. The request may have been blocked." });
        }
        
        const images = response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
        res.json({ images });
    } catch (error) {
        apiErrorHandler(res, error, 'Failed to generate image.');
    }
});

app.post('/api/edit-image', async (req, res) => {
    try {
        const { prompt, base64ImageData, mimeType, maskBase64 } = req.body;
        
        const parts = [
          { inlineData: { data: base64ImageData, mimeType } },
          ...(maskBase64 ? [{ inlineData: { data: maskBase64, mimeType: 'image/png' } }] : []),
          { text: prompt },
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
                const image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                return res.json({ image });
            }
        }
        res.status(500).json({ error: "No image was found in the model's response." });
    } catch (error) {
        apiErrorHandler(res, error, 'Failed to edit image.');
    }
});

// For a real app, use a persistent store like Redis or a database
const videoOperationsCache = new Map<string, any>();

app.post('/api/generate-video', async (req, res) => {
    try {
        const { prompt } = req.body;
        const operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: { numberOfVideos: 1 }
        });
        res.json({ operationName: operation.name });
    } catch (error) {
        apiErrorHandler(res, error, 'Failed to start video generation.');
    }
});

app.get('/api/video-status', async (req, res) => {
    try {
        const { operationName } = req.query;
        if (typeof operationName !== 'string') {
            return res.status(400).json({ error: "Operation name is required." });
        }
        
        // FIX: The `getVideosOperation` method expects the parameter key to be `operation`, not `name`.
        let operation = await ai.operations.getVideosOperation({ operation: { name: operationName } });
        if (operation.done) {
            videoOperationsCache.set(operationName, operation.response);
            res.json({ status: 'complete', videoUrl: `/api/get-video?operationName=${operationName}` });
        } else {
            res.json({ status: 'processing' });
        }
    } catch(error) {
        apiErrorHandler(res, error, 'Failed to get video status.');
    }
});

app.get('/api/get-video', async (req, res) => {
    try {
        const { operationName } = req.query as { operationName: string };
        const operationResponse = videoOperationsCache.get(operationName);
        
        const downloadLink = operationResponse?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            return res.status(404).json({ error: 'Video not found or processing not complete.' });
        }
        
        const videoApiResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoApiResponse.ok || !videoApiResponse.body) {
            throw new Error(`Failed to download video file. Status: ${videoApiResponse.status}`);
        }
        
        res.setHeader('Content-Type', 'video/mp4');
        const reader = videoApiResponse.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
        }
        res.end();

    } catch(error) {
        apiErrorHandler(res, error, 'Failed to stream video.');
    }
});


app.listen(port, () => {
  console.log(`Email validation server listening at http://localhost:${port}`);
});

import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import { GoogleGenAI, Modality } from '@google/genai';
import dns from 'dns/promises';
import net from 'net';

// USE API_KEY as per guidelines
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Explicitly typing `app` as `Express` resolves a TypeScript overload error on `app.use`.
// This ensures the middleware function signature is correctly inferred.
const app: Express = express();
app.use(cors());
// Increased payload limit for base64 image data
app.use(express.json({ limit: '15mb' }));


/**
 * Performs an SMTP handshake to verify if a mailbox exists.
 * @param email The email address to verify.
 * @param exchange The mail server hostname from MX records.
 * @returns A promise that resolves with the validation result.
 */
function checkSmtp(email: string, exchange: string): Promise<{ valid: boolean, reason: string }> {
    return new Promise((resolve) => {
        const socket = net.createConnection(25, exchange);
        let state = 'connecting'; // FSM: connecting -> helo -> mail_from -> rcpt_to -> done

        const timeout = setTimeout(() => {
            if (state !== 'done') {
                state = 'done';
                socket.destroy();
                resolve({ valid: false, reason: 'smtp_timeout' });
            }
        }, 8000);

        const endConnection = (result: { valid: boolean, reason: string }) => {
            if (state !== 'done') {
                state = 'done';
                clearTimeout(timeout);
                if (!socket.destroyed) {
                    socket.write('QUIT\r\n');
                    socket.end();
                }
                resolve(result);
            }
        };

        socket.on('error', () => endConnection({ valid: false, reason: 'smtp_connection_error' }));
        socket.on('close', () => endConnection({ valid: false, reason: 'connection_closed_unexpectedly' }));

        socket.on('data', (data) => {
            const response = data.toString();
            switch (state) {
                case 'connecting':
                    if (response.startsWith('220')) {
                        state = 'helo';
                        socket.write(`HELO my-test-domain.com\r\n`);
                    } else {
                        endConnection({ valid: false, reason: 'smtp_greeting_error' });
                    }
                    break;
                case 'helo':
                    if (response.startsWith('250')) {
                        state = 'mail_from';
                        socket.write(`MAIL FROM:<verify@example.com>\r\n`);
                    } else {
                        endConnection({ valid: false, reason: 'smtp_helo_error' });
                    }
                    break;
                case 'mail_from':
                    if (response.startsWith('250')) {
                        state = 'rcpt_to';
                        socket.write(`RCPT TO:<${email}>\r\n`);
                    } else {
                        endConnection({ valid: false, reason: 'smtp_mail_from_error' });
                    }
                    break;
                case 'rcpt_to':
                    if (response.startsWith('250')) {
                        endConnection({ valid: true, reason: 'valid_mailbox' });
                    } else if (response.startsWith('550')) {
                        endConnection({ valid: false, reason: 'invalid_mailbox' });
                    } else {
                        // Other codes (e.g., 4xx temp fails, other 5xx) are ambiguous.
                        endConnection({ valid: false, reason: 'ambiguous_smtp_response' });
                    }
                    break;
            }
        });
    });
}

// === TOOL API ENDPOINTS ===

app.get('/api/email-format', (req, res) => {
    // This URL can be updated here on the backend without needing to redeploy the frontend.
    const formatUrl = "https://docs.google.com/document/d/1vx3_4aDa9dy0NQ7GcuNwodjV-4y1cAyFMJxPXKTadIs/edit?usp=sharing";
    res.json({ downloadUrl: formatUrl });
});

app.post('/api/validate-email', async (req, res) => {
  const { email } = req.body || {};

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(200).json({ status: 'invalid', message: 'Invalid Format', details: 'Please enter a valid email address format.' });
  }
  
  const domain = email.split('@')[1];

  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return res.status(200).json({ status: 'invalid', message: 'Invalid Domain', details: 'This domain does not have MX records and cannot receive mail.' });
    }
    
    const sortedMx = mxRecords.sort((a, b) => a.priority - b.priority);
    const smtpResult = await checkSmtp(email, sortedMx[0].exchange);
    
    if (smtpResult.valid) {
      return res.json({ status: 'valid', message: 'Email is Deliverable', details: 'Mailbox confirmed to exist via SMTP check.' });
    } else {
      if (smtpResult.reason === 'invalid_mailbox') {
        return res.json({ status: 'invalid', message: 'Mailbox Not Found', details: 'The mail server reported that this specific email address does not exist.' });
      }
      // For timeouts, connection errors, or ambiguous responses, classify as "risky"
      return res.json({ status: 'risky', message: 'Verification Inconclusive', details: 'Could not confirm mailbox existence. The server may be a catch-all or temporarily unavailable.' });
    }
  } catch (error: any) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return res.status(200).json({ status: 'invalid', message: 'Domain Not Found', details: 'The domain name for this email address does not exist.' });
    }
    console.error('Email validation unexpected error:', error);
    return res.status(500).json({ status: 'invalid', message: 'Server Error', details: 'An unexpected error occurred during validation.' });
  }
});

/*
// This is a long-running endpoint. It will hold the connection open until the video is generated.
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    let op = await ai.models.generateVideos({ model: 'veo-2.0-generate-001', prompt, config: { numberOfVideos: 1 } });
    
    // Poll for the result on the server side.
    let count = 0;
    const maxPolls = 120; // 120 * 10s = 20 minutes timeout
    while (!op.done && count < maxPolls) {
      await new Promise(r => setTimeout(r, 10000));
      op = await ai.operations.getVideosOperation({ operation: op });
      count++;
    }
    
    const link = op.response?.generatedVideos?.[0]?.video?.uri;
    if (!link) {
      const errorMessage = count >= maxPolls ? 'Video generation timed out.' : 'No download link returned from the API.';
      return res.status(502).json({ error: errorMessage });
    }
    
    // SECURITY FIX: Instead of sending the raw GCS link, send a relative URL to a proxy endpoint.
    res.json({ videoUrl: `/api/get-video?gcsUri=${encodeURIComponent(link)}` });
  } catch (e: any) {
    console.error("Video generation failed:", e);
    res.status(500).json({ error: e?.message || 'Video generation failed' });
  }
});

// SECURITY FIX: Add a proxy endpoint to stream the video without exposing the API key to the client.
app.get('/api/get-video', async (req, res) => {
    try {
        const { gcsUri } = req.query as { gcsUri: string };
        if (!gcsUri) {
            return res.status(400).json({ error: 'Video URI is required.' });
        }
        
        const videoApiResponse = await fetch(`${gcsUri}&key=${process.env.API_KEY}`);
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

    } catch(error: any) {
        console.error("Failed to stream video:", error);
        res.status(500).json({ error: error?.message || 'Failed to stream video.' });
    }
});
*/

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API server listening on :${port}`));

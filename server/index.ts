import express from 'express';
import cors from 'cors';
import dns from 'dns';
import net from 'net';
// FIX: The `dnsbl` library is a CJS module without proper type definitions.
// Using `import ... = require(...)` is the TypeScript-specific syntax for importing
// CommonJS modules, which can resolve cascading type errors that were manifesting
// on the `app.use(express.json())` line.
import dnsbl = require('dnsbl');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

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

// FIX: The `dnsbl.lookup` function is callback-based, not promise-based.
// It was being incorrectly used with `await`, causing a cascading type error that manifested
// on `app.use(express.json())`. This has been fixed by wrapping the call in a Promise.
// 3. DNS Blacklist Check
const checkDnsbl = (domain: string): Promise<ValidationResult> => {
    return new Promise(async (resolve) => {
        try {
            const mxRecords = await dns.promises.resolveMx(domain);
            if (!mxRecords || mxRecords.length === 0) {
                return resolve({ valid: false, message: 'No mail server to check.' });
            }
            const mailServerIp = (await dns.promises.resolve(mxRecords[0].exchange))[0];

            // FIX: The type definition for the dnsbl.lookup callback indicates the
            // second argument (`isBlacklisted`) is optional (`boolean | undefined`). 
            // The signature has been corrected to `isBlacklisted?: boolean` to resolve a 
            // cascading type error that was incorrectly reported on `app.use(express.json())`.
            dnsbl.lookup(mailServerIp, 'zen.spamhaus.org', (err: Error | null, isBlacklisted?: boolean) => {
                if (err) {
                    // Per original logic, treat lookup error as non-blocking/reputable
                    return resolve({ valid: true, message: 'Could not verify domain reputation.' });
                }
                if (isBlacklisted) {
                    return resolve({ valid: false, message: 'Mail server IP is listed on a spam blacklist (Spamhaus).' });
                }
                resolve({ valid: true, message: 'Domain has a clean reputation.' });
            });
        } catch (error) {
            // This catches errors from dns.promises calls
            resolve({ valid: true, message: 'Could not verify domain reputation.' });
        }
    });
};


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
    // Only proceed if MX records are valid
    const smtpCheck = mxCheck.valid ? await checkSmtp(email, domain) : { valid: false, message: 'Cannot perform SMTP check without valid MX records.' };
    const dnsblCheck = mxCheck.valid ? await checkDnsbl(domain) : { valid: false, message: 'Cannot perform DNSBL check without valid MX records.' };

    res.json({
      mxCheck,
      smtpCheck,
      dnsblCheck,
    });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred during validation.' });
  }
});

app.listen(port, () => {
  console.log(`Email validation server listening at http://localhost:${port}`);
});

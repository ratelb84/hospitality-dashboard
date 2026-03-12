// Vercel Serverless Proxy for SEMPA API (bypasses CORS x-channel issue)
const https = require('https');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { path } = req.query;
  if (!path) {
    res.status(400).json({ error: 'Missing path parameter' });
    return;
  }

  // Build query string from remaining params (exclude 'path')
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'path') params.append(key, value);
  }
  const qs = params.toString();
  // Production base URL (live environment)
  const url = `https://iis-prod.semper-services.com/IntegrationsAPI/${path}${qs ? '?' + qs : ''}`;

  return new Promise((resolve) => {
    const options = {
      headers: {
        'x-channel': 'NTgy',
        'x-api-key': '12345678900987654321!@#$%%$#@!',
        'x-token': 'T3BlbkFQSQ==',
        'Accept': 'application/json',
      },
      rejectUnauthorized: false,
    };

    https.get(url, options, (apiRes) => {
      let data = '';
      apiRes.on('data', (chunk) => (data += chunk));
      apiRes.on('end', () => {
        try {
          const json = JSON.parse(data);
          res.status(200).json(json);
        } catch {
          res.status(200).send(data);
        }
        resolve();
      });
    }).on('error', (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });
  });
};

// Vercel Serverless Proxy for SEMPA API (bypasses CORS x-channel issue)
// Falls back to mock data if SEMPA is unavailable
const https = require('https');

// Mock data for when SEMPA is down
const mockData = {
  PMSReservationsInPeriod: {
    result: {
      reservations: [
        {
          reservationId: 'RES001',
          venueId: 58946,
          checkIn: '2026-03-17',
          checkOut: '2026-03-20',
          roomTypeId: 1,
          guestName: 'John Smith',
          status: 'Confirmed',
          pax: 2,
          roomNumber: '101',
          rateCode: 'STD',
          amount: 450.00
        },
        {
          reservationId: 'RES002',
          venueId: 58946,
          checkIn: '2026-03-18',
          checkOut: '2026-03-25',
          roomTypeId: 2,
          guestName: 'Jane Doe',
          status: 'Confirmed',
          pax: 4,
          roomNumber: '205',
          rateCode: 'SUITE',
          amount: 750.00
        }
      ]
    }
  },
  PMSAvailable: {
    result: {
      available: [
        { date: '2026-03-17', roomTypeId: 1, available: 8, outOfService: 2 },
        { date: '2026-03-18', roomTypeId: 1, available: 6, outOfService: 2 },
        { date: '2026-03-17', roomTypeId: 2, available: 4, outOfService: 0 }
      ]
    }
  },
  PMSRoomCount: {
    result: {
      roomTypes: [
        { roomTypeId: 1, name: 'Standard Room', count: 10, outOfService: 2 },
        { roomTypeId: 2, name: 'Suite', count: 5, outOfService: 0 }
      ]
    }
  },
  PMSMonthRates: {
    result: {
      rates: [
        { month: '2026-03', roomTypeId: 1, rateCode: 'STD', rate: 150.00 },
        { month: '2026-03', roomTypeId: 2, rateCode: 'SUITE', rate: 250.00 }
      ]
    }
  }
};

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
      timeout: 5000,
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
      // SEMPA is down, fall back to mock data
      console.log(`SEMPA API error (${path}):`, err.message);
      const mockResponse = mockData[path] || { result: { error: 'Unknown endpoint: ' + path } };
      res.status(200).json(mockResponse);
      resolve();
    }).on('timeout', () => {
      // SEMPA timeout, fall back to mock data
      console.log(`SEMPA timeout (${path}), using mock data`);
      const mockResponse = mockData[path] || { result: { error: 'Unknown endpoint: ' + path } };
      res.status(200).json(mockResponse);
      resolve();
    });
  });
};

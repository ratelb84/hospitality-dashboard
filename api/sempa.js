// Vercel Serverless Proxy for SEMPA API (bypasses CORS x-channel issue)
// Falls back to mock data if SEMPA is unavailable
const https = require('https');

// Mock data for when SEMPA is down
// Using Nambiti Hills (VenueID: 19138) as production venue
const mockData = {
  PMSReservationsInPeriod: {
    result: {
      reservations: [
        {
          ReservationID: 'RES001',
          VenueID: 19138,
          CheckInDate: '2026-03-17',
          CheckOutDate: '2026-03-20',
          RoomTypeID: 1,
          GuestName: 'John Smith',
          Status: 'Confirmed',
          Pax: 2,
          RoomNumber: '101',
          RateCode: 'STD',
          Amount: 1200.00
        },
        {
          ReservationID: 'RES002',
          VenueID: 19138,
          CheckInDate: '2026-03-18',
          CheckOutDate: '2026-03-25',
          RoomTypeID: 2,
          GuestName: 'Jane Doe',
          Status: 'Confirmed',
          Pax: 4,
          RoomNumber: '205',
          RateCode: 'SUITE',
          Amount: 2450.00
        },
        {
          ReservationID: 'RES003',
          VenueID: 19138,
          CheckInDate: '2026-03-22',
          CheckOutDate: '2026-03-24',
          RoomTypeID: 1,
          GuestName: 'Bob Wilson',
          Status: 'Provisional',
          Pax: 1,
          RoomNumber: '102',
          RateCode: 'STD',
          Amount: 800.00
        }
      ]
    }
  },
  PMSAvailable: {
    result: {
      available: [
        { Date: '2026-03-17', RoomTypeID: 1, Available: 8, OutOfService: 2 },
        { Date: '2026-03-18', RoomTypeID: 1, Available: 6, OutOfService: 2 },
        { Date: '2026-03-19', RoomTypeID: 1, Available: 7, OutOfService: 2 },
        { Date: '2026-03-17', RoomTypeID: 2, Available: 4, OutOfService: 0 },
        { Date: '2026-03-18', RoomTypeID: 2, Available: 3, OutOfService: 0 },
        { Date: '2026-03-19', RoomTypeID: 2, Available: 4, OutOfService: 0 }
      ]
    }
  },
  PMSRoomCount: {
    result: {
      RoomTypes: [
        { RoomTypeID: 1, Name: 'Luxury Lodge', Count: 10, OutOfService: 2 },
        { RoomTypeID: 2, Name: 'Premium Suite', Count: 5, OutOfService: 0 }
      ]
    }
  },
  PMSMonthRates: {
    result: {
      MonthlyRates: [
        { Month: '2026-03', RoomTypeID: 1, RateCode: 'STD', Rate: 400.00 },
        { Month: '2026-03', RoomTypeID: 2, RateCode: 'SUITE', Rate: 650.00 },
        { Month: '2026-04', RoomTypeID: 1, RateCode: 'STD', Rate: 420.00 },
        { Month: '2026-04', RoomTypeID: 2, RateCode: 'SUITE', Rate: 680.00 },
        { Month: '2026-05', RoomTypeID: 1, RateCode: 'STD', Rate: 450.00 },
        { Month: '2026-05', RoomTypeID: 2, RateCode: 'SUITE', Rate: 700.00 }
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
        } catch (e) {
          // Failed to parse as JSON - might be HTML error page from SEMPA
          if (data.includes('<!DOCTYPE') || data.includes('<html') || data.includes('Could not load')) {
            // SEMPA returned an error page, use mock data
            console.log(`SEMPA error page detected (${path}), using mock data`);
            const mockResponse = mockData[path] || { result: { error: 'SEMPA unavailable, using mock data' } };
            res.status(200).json(mockResponse);
          } else {
            // Unknown response format
            res.status(500).json({ error: 'Failed to parse SEMPA response', details: data.substring(0, 100) });
          }
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

// Mock SEMPA API - returns realistic test data when SEMPA is down
// This allows the dashboard UI to be tested without the real API

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { path, venueId, startDate, endDate } = req.query;
  
  if (!path) {
    res.status(400).json({ error: 'Missing path parameter' });
    return;
  }

  // Mock Zambezi Grand (Venue ID: 58946)
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
          },
          {
            reservationId: 'RES003',
            venueId: 58946,
            checkIn: '2026-03-22',
            checkOut: '2026-03-24',
            roomTypeId: 1,
            guestName: 'Bob Wilson',
            status: 'Provisional',
            pax: 1,
            roomNumber: '102',
            rateCode: 'STD',
            amount: 300.00
          }
        ]
      }
    },
    PMSAvailable: {
      result: {
        available: [
          { date: '2026-03-17', roomTypeId: 1, available: 8, outOfService: 2 },
          { date: '2026-03-18', roomTypeId: 1, available: 6, outOfService: 2 },
          { date: '2026-03-19', roomTypeId: 1, available: 6, outOfService: 2 },
          { date: '2026-03-17', roomTypeId: 2, available: 4, outOfService: 0 },
          { date: '2026-03-18', roomTypeId: 2, available: 3, outOfService: 0 },
          { date: '2026-03-19', roomTypeId: 2, available: 4, outOfService: 0 }
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
          { month: '2026-03', roomTypeId: 2, rateCode: 'SUITE', rate: 250.00 },
          { month: '2026-04', roomTypeId: 1, rateCode: 'STD', rate: 155.00 },
          { month: '2026-04', roomTypeId: 2, rateCode: 'SUITE', rate: 260.00 }
        ]
      }
    }
  };

  // Return mock data for the requested path
  const response = mockData[path] || {
    result: { error: 'Unknown endpoint: ' + path }
  };

  res.status(200).json(response);
};

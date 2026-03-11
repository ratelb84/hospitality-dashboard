# SEMPA API Details

## Source
Email from Sheldon Millar (Support Manager, Semper Systems) via Don, received 2026-03-11

## API Endpoint (TEST Environment)
- **Base URL:** https://internal.semper.co.za/IntegrationsAPIDebug/Help
- **Note:** This is TEST environment. Live credentials will be supplied after testing.

## Authentication Headers (ALL requests)
- `x-channel`: NTc0
- `x-api-key`: 12345678900987654321!@#$%%$#@!
- `x-token`: T3BlbkFQSQ==

## Test Venue
- **Venue ID:** 58946 — "Open API Test"
- Multiple venues can be linked to a channel

## How It Works
1. Semper creates a **channel** and links required **venues** to it
2. API credentials are linked to the channel
3. Use functions to send/receive data from linked venues

## Function Categories
- **PMS functions** (`PMS*`) — Interface directly to client server (real-time data)
- **CRS functions** (`CRS*`) — Interface to online SRS (uploaded data only)

## Key API Categories to Explore
- `OpenAPIVenues` — Venue/property information
- `OpenAPIRooms` — Room inventory and availability
- `OpenAPIRates` — Pricing and rate plans
- `OpenAPIAgents` — Booking agents/sources
- `OpenAPIReservations` — Reservation data (THIS IS THE MAIN ONE)

## Semper Contacts
- **Sheldon Millar** — Support Manager, sheldonm@semper-systems.com, +27 (0) 21 300 3222
- **Noel Lieberum** — noel@semper-systems.com
- **Bernhard Potgieter** — bernhard@semper-systems.com
- **Glen Firmani** — glen@semper-systems.com

## Website
- https://www.semperpms.com

## API Testing Results ✅ (11 Mar 2026)

### All Endpoints Working
- `CRSChannelVenues` ✅ — Returns 5 test venues (incl. VenueID 58946 "Open API Test")
- `PMSReservationsInPeriod` ✅ — Returns reservations with full details (status, dates, rooms, guests)
- `CRSTypes` ✅ — Returns room types (Berit's Cottage, Lagoon House, Schrywershoek Beach House)
- `PMSReservationStatuses` ✅ — Returns status codes (Provisional, Confirmed, In House, Checked Out, Active Out, Out of Service)

### Reservation Status Codes
| ID | Code | Description |
|----|------|-------------|
| 0 | P | Provisional |
| 1 | C | Confirmed |
| 2 | In | In House |
| 3 | O | Checked Out |
| 4 | A | Active Out |
| 5 | X | Out of Service |

### Test Venue Room Types
| Room Type ID | Name | Max Pax |
|-------------|------|---------|
| 1037 | Berit's Cottage | 4 |
| 1000 | Lagoon House | 3 |
| 1038 | Schrywershoek Beach House | 2 |

### Key API Endpoints for Dashboard
1. `PMSReservationsInPeriod` — 12-month forward reservations (THE MAIN ONE)
2. `PMSAvailable` — Room availability for date ranges
3. `PMSRoomCount` — Total rooms per type
4. `PMSMonthRates` — Monthly rate data
5. `PMSReservationStatuses` — Status enum mapping
6. `CRSTypes` — Room type inventory

## Next Steps
1. ~~Explore API documentation~~ ✅ Done
2. ~~Test authentication~~ ✅ Working
3. ~~Pull venue/room/reservation data~~ ✅ Working
4. Build dashboard UI with 12-month forward view
5. Add occupancy calculations (rooms booked / total rooms)
6. Add budget input and comparison
7. Connect to real Zambezi Grand + Nambezi Hills venues (when live credentials provided)

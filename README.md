# Hospitality Management Dashboard

## Overview
Real-time reservation management dashboard for two game lodges, pulling data from SEMPA reservation system via API.

## Properties
- **Zambezi Grand** — Lower Zambezi National Park, Zambia
- **Nambezi Hills** — Ladysmith, KwaZulu-Natal, South Africa

## Data Source
- **System:** SEMPA (reservation management platform)
- **API:** TBD (dev credentials incoming via email from Don)
- **Refresh:** Hourly (or more frequent)

## Phase 1: Live Reservation View
- 12-month forward reservation calendar (by month, by lodge)
- Status breakdown: Confirmed / Provisional / New Bookings
- Occupancy percentage per month per property
- Visual graphs (occupancy trends, gap identification)
- Manual budget inputs:
  - Target revenue per night per lodge
  - Target occupancy % per lodge per month
- Actual vs Budget comparison (daily updated)
- Week-over-week tracking

## Phase 2: Gap Detection & Intelligence
- Auto-detect availability gaps 3+ months ahead
- Weekday vs weekend gap analysis
- Actionable suggestions:
  - Email campaigns to existing guest database
  - Social media campaign triggers
  - Above-the-line marketing recommendations
  - Last-minute special pricing
  - Re-engagement of past guests
- Alert system for emerging gaps

## Tech Stack (Planned)
- **Frontend:** Next.js or static HTML/JS + Tailwind CSS
- **Backend:** Supabase (budget data, cached reservations)
- **API:** SEMPA REST API (reservations data)
- **Deployment:** Vercel
- **Scheduling:** Cron job for hourly data refresh

## Status
- [ ] Waiting for SEMPA API documentation + dev credentials
- [ ] Waiting for report screenshots (data validation)
- [ ] Waiting for budget numbers per lodge
- [ ] Design dashboard layout
- [ ] Build Phase 1 MVP
- [ ] Validate data matches SEMPA reports
- [ ] Add budget comparison
- [ ] Phase 2: Gap detection engine

## Timeline
- **Phase 1 MVP:** ~2-3 days after API access
- **Phase 2:** ~1 week after Phase 1 validated

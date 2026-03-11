# Hospitality Management Dashboard

**Phase 1 MVP** — Live reservation dashboard for game lodges

## Features

✅ **Dashboard Overview**
- Total rooms, occupied tonight, occupancy %, arrivals/departures today
- 12-month occupancy forecast chart
- Upcoming arrivals (next 7 days)

✅ **Occupancy Calendar** 
- 12-month forward view: Room types × Months
- Color-coded occupancy percentages (red <50%, yellow 50-75%, green >75%)
- Click any cell for daily breakdown with heatmap
- Confirmed vs Provisional breakdown

✅ **Reservations List**
- Sortable/filterable table: Guest, Check-in, Check-out, Room Type, Status, Agent
- Filters: Status, Room Type, Date Range, Guest Search
- Click row for full reservation details

✅ **Gap Analysis**
- 3-month forward view showing availability gaps
- Calendar heatmap: Red = empty, Yellow = partial, Green = full
- Summary stats: Total gap nights, avg occupancy, worst/best months
- Gap details by room type

✅ **Budget vs Actual**
- Manual budget input per lodge/month (occupancy %, ADR, revenue targets)
- Visual comparison chart: Budget vs Actual occupancy
- Monthly breakdown table with variance tracking

✅ **Settings**
- Venue configuration display
- User management (add users, view roles)
- Auto-refresh interval setting

## Tech Stack

- **Frontend:** Static HTML + Vanilla JS + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Realtime)
- **PMS API:** SEMPA (Semper) — live reservation data
- **Charts:** Chart.js
- **Deployment:** Vercel

## Live URL

🌐 **https://hospitality-dashboard-alpha.vercel.app**

## Default Login

- **Username:** `don`
- **Password:** `Don123!`

## SEMPA API Integration

- **Base URL:** `https://internal.semper.co.za/IntegrationsAPIDebug/`
- **Test Venue:** Open API Test (ID: 58946, 17 rooms)
- Endpoints: Venues, Room Types, Availability, Reservations, Arrivals

⚠️ **CORS Note:** The SEMPA API has CORS enabled (`access-control-allow-origin: *`) but may not explicitly allow the `x-channel` header. If API calls fail from the browser, a simple proxy or serverless function may be needed.

## Supabase Tables

- `hospitality_users` — User authentication & roles
- `hospitality_budgets` — Monthly budget targets per venue
- `hospitality_snapshots` — Cached reservation data for weekly comparison

## Repository

📦 **GitHub:** https://github.com/ratelb84/hospitality-dashboard

## Development Notes

This is a **Phase 1 MVP** designed for:
- Two game lodges: Zambezi Grand & Nambezi Hills
- Testing with sparse data (Open API Test venue)
- Professional dark theme UI
- Mobile-responsive layout

Future enhancements could include:
- Automated budget calculation based on historical data
- Email alerts for low occupancy periods
- Guest communication integration
- Revenue forecasting & reporting
- Multi-property comparison views

---

Built by DevBot for Ignition CX | March 2026

# PFMS - Patient Flow Management System

A clinic-scale patient flow management system built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Dashboard** — Active patients, ward occupancy, transfers/discharges today, monthly volume chart
- **Ward Top-View Diagram** — CSS grid bed layouts per section, color-coded by status, click to view patient
- **Patient Master Index** — Search, create, and view patient records with full visit history
- **Visit Log** — Filter by section/status/doctor, sortable, paginated, with status transitions and audit badges
- **Transfer Log** — Chronological transfers with section filtering
- **Discharge Summary** — Date-range filtering for discharged patients
- **CSV Export** — Available on all data pages
- **Audit Trail** — Every visit change is logged with overwrite and multi-clinician detection
- **Status State Machine** — Enforced at the database level (Registered → Admitted → In_Care → Transferred/Discharged)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS 3 |
| Backend | Supabase (PostgreSQL) |
| Auth (MVP) | localStorage-based clinician name |
| Deployment | Vercel |

## Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) project (free tier works)

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Patient Flow Management System_V1"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase Settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase Settings > API

### 4. Set up the database

Run the SQL migration files in order in the **Supabase SQL Editor**:

1. `supabase/migrations/001_schema.sql` — Creates tables, indexes, constraints
2. `supabase/migrations/002_triggers.sql` — Creates audit triggers, state machine, transfer logging
3. `supabase/migrations/003_seed.sql` — Seeds sections (ER, Medical Ward, Surgical Ward, ICU) and beds

### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be prompted to enter your clinician name on first visit.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial PFMS scaffold"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

The app will build and deploy automatically on every push.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard
│   ├── wards/              # Ward top-view diagram
│   ├── patients/           # Patient index + detail
│   ├── visits/             # Visit log
│   ├── transfers/          # Transfer log
│   └── discharges/         # Discharge summary
├── components/             # React components
│   ├── layout/             # Sidebar, TopNav, AppShell
│   ├── auth/               # NameModal
│   ├── dashboard/          # StatCard, WardSummaryCard, MonthlyChart
│   ├── wards/              # SectionGrid, BedTile, BedPatientModal
│   ├── patients/           # PatientSearchBar, PatientTable, PatientForm
│   ├── visits/             # VisitTable, VisitFilters, VisitForm
│   └── shared/             # Modal, Pagination, ExportCSVButton, Badge
├── hooks/                  # Custom React hooks for data fetching
├── contexts/               # AuthContext (clinician name)
├── lib/                    # Supabase client, constants, CSV, formatters
└── types/                  # TypeScript interfaces
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `patients` | Patient master index with auto-generated PT-00001 codes |
| `sections` | Hospital sections with JSONB layout config for bed grids |
| `beds` | Beds per section |
| `visits` | Core visit records with status state machine |
| `visit_audit_log` | Field-level audit trail with overwrite/multi-clinician flags |
| `transfer_log` | Auto-logged when section/bed changes on a visit |

## Status State Machine

```
Registered → Admitted → In_Care → Transferred → In_Care (loop)
                                → Discharged
Registered → Cancelled
```

All transitions are enforced at the PostgreSQL trigger level.

## Important Notes

- **Supabase Free Tier**: Projects pause after 1 week of inactivity. Visit the dashboard periodically to keep it alive.
- **No RLS in MVP**: Row Level Security policies are permissive (allow all). Tighten before production use.
- **Future RBAC**: The architecture supports swapping localStorage auth for Supabase Auth without structural changes.

## License

Private — All rights reserved.

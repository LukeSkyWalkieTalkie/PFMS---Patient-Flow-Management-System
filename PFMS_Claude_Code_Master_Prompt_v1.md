# CLAUDE CODE MASTER PROMPT (VERSION 1 -- STRUCTURED)

You are a senior full-stack software architect and engineer.

Your task is to design and scaffold a production-ready MVP web
application called:

# Patient Flow Management System (PFMS)

This is a clinic-scale patient flow management system.

The system must follow the specifications below exactly.

------------------------------------------------------------------------

# 1. ARCHITECTURE

## Stack Requirements

Frontend: - Next.js (App Router) - TypeScript - Tailwind CSS - SPA-style
UX (client-driven navigation) - Hosted on Vercel free tier

Backend: - Supabase - PostgreSQL - Use Supabase JS client -
Database-level audit triggers - Free tier compatible

Repository: - Initialize new GitHub-ready project structure - Provide
README.md - Provide .env.example - Clean folder organization - Provide
setup + deployment instructions

------------------------------------------------------------------------

# 2. DATABASE DESIGN

Use PostgreSQL via Supabase.

Create full SQL schema with constraints and triggers.

------------------------------------------------------------------------

## TABLE: patients (Patient Master Index)

Fields: - id UUID primary key default gen_random_uuid() - patient_code
TEXT unique not null (format PT-00001) - first_name TEXT not null -
last_name TEXT not null - date_of_birth DATE not null - sex TEXT not
null - contact_number TEXT - archived BOOLEAN default false - created_at
TIMESTAMP default now() - updated_at TIMESTAMP default now()

Add index on: - patient_code - last_name

------------------------------------------------------------------------

## TABLE: sections

Fields: - id UUID primary key - name TEXT unique not null - description
TEXT - layout_config JSONB not null

Seed data: - ER - Medical Ward - Surgical Ward - ICU

layout_config must allow grid positioning for bed diagram.

------------------------------------------------------------------------

## TABLE: beds

Fields: - id UUID primary key - section_id UUID references
sections(id) - bed_number TEXT not null - is_active BOOLEAN default
true - created_at TIMESTAMP default now()

Constraint: - Unique (section_id, bed_number)

------------------------------------------------------------------------

## TABLE: visits

Fields: - id UUID primary key default gen_random_uuid() - patient_id
UUID references patients(id) - visit_number INTEGER not null -
presenting_complaint TEXT - provisional_diagnosis TEXT -
condition_category TEXT - attending_doctor TEXT - current_section_id
UUID references sections(id) - current_bed_id UUID references beds(id) -
visit_status TEXT not null - admitted_at TIMESTAMP - discharged_at
TIMESTAMP - created_by TEXT - updated_by TEXT - version_number INTEGER
default 1 - created_at TIMESTAMP default now() - updated_at TIMESTAMP
default now()

Constraints: - Unique (patient_id, visit_number) - CHECK visit_status
IN:
('Registered','Admitted','In_Care','Transferred','Discharged','Cancelled')

Add bed occupancy constraint: Prevent two active visits assigned to same
bed. (Use partial unique index where visit_status IN active states)

------------------------------------------------------------------------

## TABLE: visit_audit_log

Fields: - id UUID primary key default gen_random_uuid() - visit_id UUID
references visits(id) - changed_by TEXT - changed_at TIMESTAMP default
now() - field_name TEXT - old_value TEXT - new_value TEXT -
version_number INTEGER - overwrite_flag BOOLEAN default false -
multi_clinician_flag BOOLEAN default false

------------------------------------------------------------------------

## TABLE: transfer_log

Fields: - id UUID primary key default gen_random_uuid() - visit_id UUID
references visits(id) - from_section_id UUID - to_section_id UUID -
from_bed_id UUID - to_bed_id UUID - transferred_by TEXT - transferred_at
TIMESTAMP default now()

------------------------------------------------------------------------

# 3. AUDIT LOGIC (CRITICAL)

Implement PostgreSQL trigger:

On UPDATE of visits: - Compare OLD vs NEW - For each changed column: -
Insert record into visit_audit_log - If version_number mismatch →
overwrite_flag = true - If updated_by differs from previous updated_by →
multi_clinician_flag = true - Increment version_number

No DELETE allowed on visits.

------------------------------------------------------------------------

# 4. STATUS STATE MACHINE

Enforce allowed transitions:

Registered → Admitted\
Admitted → In_Care\
In_Care → Transferred\
Transferred → In_Care\
In_Care → Discharged\
Registered → Cancelled

Reject illegal transitions at DB level (trigger).

------------------------------------------------------------------------

# 5. FRONTEND REQUIREMENTS

## Authentication (MVP)

-   On first load show modal: "Enter your name"
-   Store in session (localStorage)
-   All writes use this name as created_by / updated_by

No password system yet.

------------------------------------------------------------------------

## Core Pages

### Dashboard (Home)

Display: - Active patients count - Patients per ward - ICU count -
Transfers today - Discharges today - Monthly patient count (grouped by
month)

------------------------------------------------------------------------

### Ward Top-View Diagram (NEW FEATURE)

For each section: - Render grid layout from layout_config - Display beds
visually - Each bed tile shows: - Bed number - Patient initials -
Color-coded by status - Empty beds shown grey - Clicking bed opens
patient modal

Implement using: - CSS grid or SVG - Fully responsive

------------------------------------------------------------------------

### Patient Master Index Page

-   Search by name
-   Search by patient_code
-   View previous visits
-   Create new visit

------------------------------------------------------------------------

### Visit Log Page

-   Filter by:
    -   Section
    -   Status
    -   Doctor
-   Sortable
-   Paginated

------------------------------------------------------------------------

### Transfer Log Page

-   Chronological list
-   Filter by section
-   Exportable

------------------------------------------------------------------------

### Discharge Summary Page

-   Filter by date range
-   Exportable

------------------------------------------------------------------------

# 6. EXPORT FEATURES

Implement: - Export full visit list CSV - Export filtered results -
Export discharge list - Export transfer log

------------------------------------------------------------------------

# 7. UI/UX RULES

-   Mobile-first design
-   Clean clinical theme
-   Minimal clicks
-   Clear warning badges:
    -   Overwrite detected
    -   Multi-clinician interaction
-   No destructive delete buttons

------------------------------------------------------------------------

# 8. DEVOPS REQUIREMENTS

Provide:

1.  Full project structure
2.  Supabase SQL migration file
3.  Environment variable setup guide
4.  Local development instructions
5.  Vercel deployment instructions
6.  README.md
7.  .env.example

------------------------------------------------------------------------

# 9. OUTPUT FORMAT

Generate:

1.  Project folder tree
2.  SQL schema
3.  Supabase trigger code
4.  Next.js scaffolding
5.  Example API calls
6.  Deployment instructions

Do not skip steps. Do not simplify requirements. Do not remove audit
logic.

Build MVP but architect cleanly for future RBAC.

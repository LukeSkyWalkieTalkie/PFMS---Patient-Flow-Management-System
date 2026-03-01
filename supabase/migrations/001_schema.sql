-- ============================================================
-- PFMS Database Schema
-- Run this in Supabase SQL Editor (first)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SEQUENCE: patient_code_seq
-- ============================================================
CREATE SEQUENCE patient_code_seq START WITH 1;

-- ============================================================
-- TABLE: patients
-- ============================================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_code TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('Male', 'Female', 'Other')),
  contact_number TEXT,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_patients_patient_code ON patients (patient_code);
CREATE INDEX idx_patients_last_name ON patients (last_name);

-- Auto-generate patient_code on insert
CREATE OR REPLACE FUNCTION generate_patient_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.patient_code := 'PT-' || LPAD(nextval('patient_code_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_patient_code
  BEFORE INSERT ON patients
  FOR EACH ROW
  EXECUTE FUNCTION generate_patient_code();

-- Auto-update updated_at on patients
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TABLE: sections
-- ============================================================
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  layout_config JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ============================================================
-- TABLE: beds
-- ============================================================
CREATE TABLE beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  bed_number TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_beds_section_bed UNIQUE (section_id, bed_number)
);

-- ============================================================
-- TABLE: visits
-- ============================================================
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  visit_number INTEGER NOT NULL,
  presenting_complaint TEXT,
  provisional_diagnosis TEXT,
  condition_category TEXT,
  attending_doctor TEXT,
  current_section_id UUID REFERENCES sections(id),
  current_bed_id UUID REFERENCES beds(id),
  visit_status TEXT NOT NULL CHECK (
    visit_status IN ('Registered', 'Admitted', 'In_Care', 'Transferred', 'Discharged', 'Cancelled')
  ),
  admitted_at TIMESTAMPTZ,
  discharged_at TIMESTAMPTZ,
  created_by TEXT,
  updated_by TEXT,
  version_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_visits_patient_visit UNIQUE (patient_id, visit_number)
);

-- Partial unique index: prevent two active visits on the same bed
CREATE UNIQUE INDEX idx_visits_active_bed
  ON visits (current_bed_id)
  WHERE visit_status IN ('Admitted', 'In_Care', 'Transferred')
    AND current_bed_id IS NOT NULL;

-- ============================================================
-- TABLE: visit_audit_log
-- ============================================================
CREATE TABLE visit_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES visits(id),
  changed_by TEXT,
  changed_at TIMESTAMPTZ DEFAULT now(),
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  version_number INTEGER,
  overwrite_flag BOOLEAN DEFAULT false,
  multi_clinician_flag BOOLEAN DEFAULT false
);

-- ============================================================
-- TABLE: transfer_log
-- ============================================================
CREATE TABLE transfer_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES visits(id),
  from_section_id UUID REFERENCES sections(id),
  to_section_id UUID REFERENCES sections(id),
  from_bed_id UUID REFERENCES beds(id),
  to_bed_id UUID REFERENCES beds(id),
  transferred_by TEXT,
  transferred_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- DISABLE RLS for MVP (enable when adding auth)
-- ============================================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_log ENABLE ROW LEVEL SECURITY;

-- Permissive policies for anon access (MVP only)
CREATE POLICY "Allow all access to patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to sections" ON sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to beds" ON beds FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to visits" ON visits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to visit_audit_log" ON visit_audit_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to transfer_log" ON transfer_log FOR ALL USING (true) WITH CHECK (true);

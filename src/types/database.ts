export interface Patient {
  id: string
  patient_code: string
  first_name: string
  last_name: string
  date_of_birth: string
  sex: 'Male' | 'Female' | 'Other'
  contact_number: string | null
  archived: boolean
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  name: string
  description: string | null
  layout_config: SectionLayoutConfig
}

export interface SectionLayoutConfig {
  columns: number
  rows: number
  beds: {
    bed_number: string
    gridColumn: number
    gridRow: number
  }[]
}

export interface Bed {
  id: string
  section_id: string
  bed_number: string
  is_active: boolean
  created_at: string
}

export type VisitStatus =
  | 'Registered'
  | 'Admitted'
  | 'In_Care'
  | 'Transferred'
  | 'Discharged'
  | 'Cancelled'

export interface Visit {
  id: string
  patient_id: string
  visit_number: number
  presenting_complaint: string | null
  provisional_diagnosis: string | null
  condition_category: string | null
  attending_doctor: string | null
  current_section_id: string | null
  current_bed_id: string | null
  visit_status: VisitStatus
  admitted_at: string | null
  discharged_at: string | null
  created_by: string | null
  updated_by: string | null
  version_number: number
  created_at: string
  updated_at: string
  // Joined relations
  patients?: Patient
  sections?: Section | null
  beds?: Bed | null
}

export interface VisitAuditLog {
  id: string
  visit_id: string
  changed_by: string | null
  changed_at: string
  field_name: string | null
  old_value: string | null
  new_value: string | null
  version_number: number | null
  overwrite_flag: boolean
  multi_clinician_flag: boolean
}

export interface TransferLog {
  id: string
  visit_id: string
  from_section_id: string | null
  to_section_id: string | null
  from_bed_id: string | null
  to_bed_id: string | null
  transferred_by: string | null
  transferred_at: string
  // Joined relations
  visits?: Visit & { patients?: Patient }
  from_section?: Section | null
  to_section?: Section | null
  from_bed?: Bed | null
  to_bed?: Bed | null
}

-- ============================================================
-- PFMS Database Triggers
-- Run this in Supabase SQL Editor (second)
-- ============================================================

-- ============================================================
-- TRIGGER A: Enforce status state machine on visits
-- ============================================================
CREATE OR REPLACE FUNCTION enforce_visit_status_transition()
RETURNS TRIGGER AS $$
DECLARE
  allowed BOOLEAN := false;
BEGIN
  -- If status hasn't changed, allow
  IF OLD.visit_status = NEW.visit_status THEN
    RETURN NEW;
  END IF;

  -- Check allowed transitions
  IF OLD.visit_status = 'Registered' AND NEW.visit_status = 'Admitted' THEN
    allowed := true;
  ELSIF OLD.visit_status = 'Registered' AND NEW.visit_status = 'Cancelled' THEN
    allowed := true;
  ELSIF OLD.visit_status = 'Admitted' AND NEW.visit_status = 'In_Care' THEN
    allowed := true;
  ELSIF OLD.visit_status = 'In_Care' AND NEW.visit_status = 'Transferred' THEN
    allowed := true;
  ELSIF OLD.visit_status = 'In_Care' AND NEW.visit_status = 'Discharged' THEN
    allowed := true;
  ELSIF OLD.visit_status = 'Transferred' AND NEW.visit_status = 'In_Care' THEN
    allowed := true;
  END IF;

  IF NOT allowed THEN
    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.visit_status, NEW.visit_status;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER a_enforce_status_transition
  BEFORE UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION enforce_visit_status_transition();

-- ============================================================
-- TRIGGER B: Auto-set timestamps and increment version
-- ============================================================
CREATE OR REPLACE FUNCTION visit_before_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-set admitted_at when transitioning to Admitted
  IF NEW.visit_status = 'Admitted' AND OLD.visit_status = 'Registered' THEN
    NEW.admitted_at := now();
  END IF;

  -- Auto-set discharged_at when transitioning to Discharged
  IF NEW.visit_status = 'Discharged' AND OLD.visit_status != 'Discharged' THEN
    NEW.discharged_at := now();
  END IF;

  -- Always update updated_at
  NEW.updated_at := now();

  -- Increment version_number
  NEW.version_number := OLD.version_number + 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER b_visit_before_update
  BEFORE UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION visit_before_update();

-- ============================================================
-- TRIGGER C: Audit log writer (AFTER UPDATE)
-- ============================================================
CREATE OR REPLACE FUNCTION write_visit_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  col_name TEXT;
  old_val TEXT;
  new_val TEXT;
  is_overwrite BOOLEAN;
  is_multi_clinician BOOLEAN;
  cols TEXT[] := ARRAY[
    'presenting_complaint', 'provisional_diagnosis', 'condition_category',
    'attending_doctor', 'current_section_id', 'current_bed_id',
    'visit_status', 'admitted_at', 'discharged_at', 'updated_by'
  ];
BEGIN
  -- Determine flags
  -- Overwrite: if the version we're writing to was already incremented by someone else
  -- (i.e., old version was already > what the client expected)
  is_overwrite := (OLD.version_number > 1 AND NEW.version_number > OLD.version_number + 1);

  -- Multi-clinician: if the person updating is different from previous updater
  is_multi_clinician := (OLD.updated_by IS NOT NULL AND OLD.updated_by != NEW.updated_by);

  -- Log each changed field
  FOREACH col_name IN ARRAY cols LOOP
    EXECUTE format('SELECT ($1).%I::TEXT, ($2).%I::TEXT', col_name, col_name)
      INTO old_val, new_val
      USING OLD, NEW;

    IF old_val IS DISTINCT FROM new_val THEN
      INSERT INTO visit_audit_log (
        visit_id, changed_by, field_name, old_value, new_value,
        version_number, overwrite_flag, multi_clinician_flag
      ) VALUES (
        NEW.id, NEW.updated_by, col_name, old_val, new_val,
        NEW.version_number, is_overwrite, is_multi_clinician
      );
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER c_write_visit_audit_log
  AFTER UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION write_visit_audit_log();

-- ============================================================
-- TRIGGER D: Auto-log transfers when section/bed changes
-- ============================================================
CREATE OR REPLACE FUNCTION log_transfer()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.current_section_id IS DISTINCT FROM NEW.current_section_id
      OR OLD.current_bed_id IS DISTINCT FROM NEW.current_bed_id)
     AND NEW.current_section_id IS NOT NULL
  THEN
    INSERT INTO transfer_log (
      visit_id, from_section_id, to_section_id,
      from_bed_id, to_bed_id, transferred_by
    ) VALUES (
      NEW.id, OLD.current_section_id, NEW.current_section_id,
      OLD.current_bed_id, NEW.current_bed_id, NEW.updated_by
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER d_log_transfer
  AFTER UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION log_transfer();

-- ============================================================
-- RULE: Prevent DELETE on visits
-- ============================================================
CREATE RULE prevent_visit_delete AS
  ON DELETE TO visits
  DO INSTEAD NOTHING;

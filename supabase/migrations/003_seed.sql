-- ============================================================
-- PFMS Seed Data
-- Run this in Supabase SQL Editor (third)
-- ============================================================

-- ============================================================
-- SECTIONS with layout_config for grid positioning
-- ============================================================
INSERT INTO sections (id, name, description, layout_config) VALUES
(
  gen_random_uuid(),
  'ER',
  'Emergency Room',
  '{
    "columns": 5,
    "rows": 2,
    "beds": [
      {"bed_number": "ER-01", "gridColumn": 1, "gridRow": 1},
      {"bed_number": "ER-02", "gridColumn": 2, "gridRow": 1},
      {"bed_number": "ER-03", "gridColumn": 3, "gridRow": 1},
      {"bed_number": "ER-04", "gridColumn": 4, "gridRow": 1},
      {"bed_number": "ER-05", "gridColumn": 5, "gridRow": 1},
      {"bed_number": "ER-06", "gridColumn": 1, "gridRow": 2},
      {"bed_number": "ER-07", "gridColumn": 2, "gridRow": 2},
      {"bed_number": "ER-08", "gridColumn": 3, "gridRow": 2},
      {"bed_number": "ER-09", "gridColumn": 4, "gridRow": 2},
      {"bed_number": "ER-10", "gridColumn": 5, "gridRow": 2}
    ]
  }'::jsonb
),
(
  gen_random_uuid(),
  'Medical Ward',
  'General Medical Ward',
  '{
    "columns": 4,
    "rows": 3,
    "beds": [
      {"bed_number": "MW-01", "gridColumn": 1, "gridRow": 1},
      {"bed_number": "MW-02", "gridColumn": 2, "gridRow": 1},
      {"bed_number": "MW-03", "gridColumn": 3, "gridRow": 1},
      {"bed_number": "MW-04", "gridColumn": 4, "gridRow": 1},
      {"bed_number": "MW-05", "gridColumn": 1, "gridRow": 2},
      {"bed_number": "MW-06", "gridColumn": 2, "gridRow": 2},
      {"bed_number": "MW-07", "gridColumn": 3, "gridRow": 2},
      {"bed_number": "MW-08", "gridColumn": 4, "gridRow": 2},
      {"bed_number": "MW-09", "gridColumn": 1, "gridRow": 3},
      {"bed_number": "MW-10", "gridColumn": 2, "gridRow": 3},
      {"bed_number": "MW-11", "gridColumn": 3, "gridRow": 3},
      {"bed_number": "MW-12", "gridColumn": 4, "gridRow": 3}
    ]
  }'::jsonb
),
(
  gen_random_uuid(),
  'Surgical Ward',
  'Post-Surgical Recovery Ward',
  '{
    "columns": 4,
    "rows": 2,
    "beds": [
      {"bed_number": "SW-01", "gridColumn": 1, "gridRow": 1},
      {"bed_number": "SW-02", "gridColumn": 2, "gridRow": 1},
      {"bed_number": "SW-03", "gridColumn": 3, "gridRow": 1},
      {"bed_number": "SW-04", "gridColumn": 4, "gridRow": 1},
      {"bed_number": "SW-05", "gridColumn": 1, "gridRow": 2},
      {"bed_number": "SW-06", "gridColumn": 2, "gridRow": 2},
      {"bed_number": "SW-07", "gridColumn": 3, "gridRow": 2},
      {"bed_number": "SW-08", "gridColumn": 4, "gridRow": 2}
    ]
  }'::jsonb
),
(
  gen_random_uuid(),
  'ICU',
  'Intensive Care Unit',
  '{
    "columns": 3,
    "rows": 2,
    "beds": [
      {"bed_number": "ICU-01", "gridColumn": 1, "gridRow": 1},
      {"bed_number": "ICU-02", "gridColumn": 2, "gridRow": 1},
      {"bed_number": "ICU-03", "gridColumn": 3, "gridRow": 1},
      {"bed_number": "ICU-04", "gridColumn": 1, "gridRow": 2},
      {"bed_number": "ICU-05", "gridColumn": 2, "gridRow": 2},
      {"bed_number": "ICU-06", "gridColumn": 3, "gridRow": 2}
    ]
  }'::jsonb
);

-- ============================================================
-- BEDS for each section
-- ============================================================

-- ER beds
INSERT INTO beds (section_id, bed_number)
SELECT s.id, b.bed_number
FROM sections s,
     unnest(ARRAY['ER-01','ER-02','ER-03','ER-04','ER-05','ER-06','ER-07','ER-08','ER-09','ER-10']) AS b(bed_number)
WHERE s.name = 'ER';

-- Medical Ward beds
INSERT INTO beds (section_id, bed_number)
SELECT s.id, b.bed_number
FROM sections s,
     unnest(ARRAY['MW-01','MW-02','MW-03','MW-04','MW-05','MW-06','MW-07','MW-08','MW-09','MW-10','MW-11','MW-12']) AS b(bed_number)
WHERE s.name = 'Medical Ward';

-- Surgical Ward beds
INSERT INTO beds (section_id, bed_number)
SELECT s.id, b.bed_number
FROM sections s,
     unnest(ARRAY['SW-01','SW-02','SW-03','SW-04','SW-05','SW-06','SW-07','SW-08']) AS b(bed_number)
WHERE s.name = 'Surgical Ward';

-- ICU beds
INSERT INTO beds (section_id, bed_number)
SELECT s.id, b.bed_number
FROM sections s,
     unnest(ARRAY['ICU-01','ICU-02','ICU-03','ICU-04','ICU-05','ICU-06']) AS b(bed_number)
WHERE s.name = 'ICU';

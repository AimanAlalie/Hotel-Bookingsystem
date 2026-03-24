-- Migration: Add multilingual fields for hotels and rooms
-- Run this in Supabase SQL Editor

-- Add multilingual columns to hotels table
ALTER TABLE hotels
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS name_ar TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- Add multilingual columns to rooms table
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS name_ar TEXT;

-- Copy existing data to English columns (assuming current data is in German/English)
UPDATE hotels SET
  name_en = name,
  description_en = description
WHERE name_en IS NULL;

UPDATE rooms SET
  name_en = name
WHERE name_en IS NULL;

-- Optional: Add comments to clarify column purpose
COMMENT ON COLUMN hotels.name_en IS 'Hotel name in English';
COMMENT ON COLUMN hotels.name_ar IS 'Hotel name in Arabic';
COMMENT ON COLUMN hotels.description_en IS 'Hotel description in English';
COMMENT ON COLUMN hotels.description_ar IS 'Hotel description in Arabic';
COMMENT ON COLUMN rooms.name_en IS 'Room name in English';
COMMENT ON COLUMN rooms.name_ar IS 'Room name in Arabic';

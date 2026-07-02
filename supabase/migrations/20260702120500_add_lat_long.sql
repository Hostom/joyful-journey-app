-- Add latitude and longitude columns to the properties table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS longitude double precision;

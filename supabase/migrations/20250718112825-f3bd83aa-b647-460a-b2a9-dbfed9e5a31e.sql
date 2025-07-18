
-- Add gender and reason_for_joining columns to applications table
ALTER TABLE public.applications 
ADD COLUMN gender text,
ADD COLUMN reason_for_joining text;

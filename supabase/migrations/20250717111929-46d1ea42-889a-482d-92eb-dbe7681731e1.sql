
-- Remove years_of_experience and current_employer columns from applications table
ALTER TABLE public.applications 
DROP COLUMN IF EXISTS years_of_experience,
DROP COLUMN IF EXISTS current_employer;

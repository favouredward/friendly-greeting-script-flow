
-- Create applications table to store all scholarship applications
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  date_of_birth date NOT NULL,
  country text NOT NULL,
  address text NOT NULL,
  program text NOT NULL,
  employment_status text NOT NULL,
  years_of_experience integer NOT NULL DEFAULT 0,
  current_employer text,
  salary text,
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  notes text, -- For admin notes
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create countries lookup table for consistency
CREATE TABLE public.countries (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE
);

-- Create programs lookup table
CREATE TABLE public.programs (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  duration_months integer,
  is_active boolean DEFAULT true
);

-- Insert sample countries
INSERT INTO public.countries (name, code) VALUES
  ('United States', 'US'),
  ('Canada', 'CA'),
  ('United Kingdom', 'GB'),
  ('Australia', 'AU'),
  ('Germany', 'DE'),
  ('France', 'FR'),
  ('Nigeria', 'NG'),
  ('South Africa', 'ZA'),
  ('Kenya', 'KE'),
  ('Ghana', 'GH'),
  ('Jamaica', 'JM'),
  ('Brazil', 'BR'),
  ('India', 'IN'),
  ('Other', 'OTHER');

-- Insert sample programs
INSERT INTO public.programs (name, description, duration_months) VALUES
  ('Software Engineering', 'Full-stack software development program', 12),
  ('Data Science', 'Data analytics and machine learning program', 10),
  ('Cybersecurity', 'Information security and ethical hacking program', 8),
  ('Digital Marketing', 'Modern marketing strategies and tools program', 6),
  ('UI/UX Design', 'User interface and experience design program', 9),
  ('Project Management', 'Agile and traditional project management program', 4);

-- Enable Row Level Security on applications table
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public to insert applications (for form submissions)
CREATE POLICY "Anyone can submit applications" 
  ON public.applications 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to prevent public from reading applications (admin only)
CREATE POLICY "No public access to view applications" 
  ON public.applications 
  FOR SELECT 
  USING (false);

-- Enable RLS on lookup tables (allow public read access for form dropdowns)
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Allow public to read countries and programs for form dropdowns
CREATE POLICY "Anyone can view countries" 
  ON public.countries 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can view active programs" 
  ON public.programs 
  FOR SELECT 
  USING (is_active = true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_applications_updated_at 
  BEFORE UPDATE ON public.applications 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

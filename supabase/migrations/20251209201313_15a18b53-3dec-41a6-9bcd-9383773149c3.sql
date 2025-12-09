-- Add new columns to user_sessions table
ALTER TABLE public.user_sessions
ADD COLUMN title TEXT,
ADD COLUMN description TEXT,
ADD COLUMN messages JSONB DEFAULT '[]'::jsonb,
ADD COLUMN recommendations JSONB DEFAULT '[]'::jsonb,
ADD COLUMN timing_score INTEGER;
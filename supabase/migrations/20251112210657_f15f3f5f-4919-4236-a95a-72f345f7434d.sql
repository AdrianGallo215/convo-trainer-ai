-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_practice_date DATE,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (CRITICAL: Separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create user_sessions table (detailed session history)
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scenario_type TEXT NOT NULL, -- 'entrevista', 'casual', 'presentacion'
  duration_seconds INTEGER,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  fluency_score INTEGER CHECK (fluency_score >= 0 AND fluency_score <= 100),
  tone_score INTEGER CHECK (tone_score >= 0 AND tone_score <= 100),
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_statistics table (aggregated metrics)
CREATE TABLE public.user_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_practice_time INTEGER NOT NULL DEFAULT 0, -- in seconds
  avg_confidence DECIMAL(5,2) DEFAULT 0,
  avg_fluency DECIMAL(5,2) DEFAULT 0,
  avg_tone DECIMAL(5,2) DEFAULT 0,
  best_scenario TEXT,
  total_xp_earned INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table (definitions)
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- e.g., 'first_session', 'week_streak'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT, -- emoji or icon identifier
  xp_reward INTEGER NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL, -- 'sessions', 'streak', 'score', 'xp'
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table (unlocked achievements)
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions"
  ON public.user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON public.user_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions"
  ON public.user_sessions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_statistics
CREATE POLICY "Users can view own statistics"
  ON public.user_statistics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics"
  ON public.user_statistics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all statistics"
  ON public.user_statistics FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for achievements
CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage achievements"
  ON public.achievements FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Initialize statistics
  INSERT INTO public.user_statistics (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update profile updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_statistics_updated_at
  BEFORE UPDATE ON public.user_statistics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate XP required for next level
CREATE OR REPLACE FUNCTION public.xp_for_level(level INTEGER)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT (level * 100) + ((level - 1) * 50)
$$;

-- Function to check and update level based on XP
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
DECLARE
  required_xp INTEGER;
BEGIN
  -- Calculate required XP for next level
  required_xp := public.xp_for_level(NEW.level + 1);
  
  -- Level up if XP threshold reached
  WHILE NEW.xp >= required_xp LOOP
    NEW.level := NEW.level + 1;
    required_xp := public.xp_for_level(NEW.level + 1);
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-level-up on XP gain
CREATE TRIGGER check_level_up
  BEFORE UPDATE OF xp ON public.profiles
  FOR EACH ROW
  WHEN (NEW.xp > OLD.xp)
  EXECUTE FUNCTION public.update_user_level();

-- Insert default achievements
INSERT INTO public.achievements (code, title, description, icon, xp_reward, requirement_type, requirement_value) VALUES
  ('first_session', 'Primera Práctica', 'Completa tu primera sesión de práctica', '🎯', 50, 'sessions', 1),
  ('novice', 'Novato', 'Completa 5 sesiones de práctica', '🌱', 100, 'sessions', 5),
  ('intermediate', 'Intermedio', 'Completa 25 sesiones de práctica', '📚', 250, 'sessions', 25),
  ('expert', 'Experto', 'Completa 100 sesiones de práctica', '🏆', 1000, 'sessions', 100),
  ('streak_3', 'Racha de 3 Días', 'Practica 3 días consecutivos', '🔥', 150, 'streak', 3),
  ('streak_7', 'Racha de 7 Días', 'Practica 7 días consecutivos', '⚡', 300, 'streak', 7),
  ('streak_30', 'Racha de 30 Días', 'Practica 30 días consecutivos', '💎', 1500, 'streak', 30),
  ('confident', 'Confiado', 'Alcanza 90+ en confianza en una sesión', '💪', 200, 'score', 90),
  ('fluent', 'Fluido', 'Alcanza 90+ en fluidez en una sesión', '🗣️', 200, 'score', 90),
  ('toned', 'Tono Perfecto', 'Alcanza 90+ en tono en una sesión', '🎵', 200, 'score', 90),
  ('perfectionist', 'Perfeccionista', 'Alcanza 90+ en todas las métricas', '⭐', 500, 'score', 90),
  ('century', 'Centenario', 'Alcanza nivel 10', '👑', 1000, 'xp', 10),
  ('interview_master', 'Maestro de Entrevistas', 'Completa 20 entrevistas', '💼', 400, 'sessions', 20),
  ('social_butterfly', 'Mariposa Social', 'Completa 20 conversaciones casuales', '🦋', 400, 'sessions', 20),
  ('public_speaker', 'Orador Público', 'Completa 20 presentaciones', '🎤', 400, 'sessions', 20);

-- Create indexes for performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_completed_at ON public.user_sessions(completed_at DESC);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_profiles_xp ON public.profiles(xp DESC);
CREATE INDEX idx_profiles_level ON public.profiles(level DESC);
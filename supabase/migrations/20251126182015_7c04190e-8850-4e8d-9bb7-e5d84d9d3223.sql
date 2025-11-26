-- Create RLS policies for psychologists to view user data
CREATE POLICY "Psychologists can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'psychologist'));

CREATE POLICY "Psychologists can view all sessions"
ON public.user_sessions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'psychologist'));

CREATE POLICY "Psychologists can view all statistics"
ON public.user_statistics
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'psychologist'));

CREATE POLICY "Psychologists can view all user achievements"
ON public.user_achievements
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'psychologist'));
-- ==============================================================================
-- FIX: Allow User Profile Creation
-- Run this script in your Supabase Dashboard > SQL Editor
-- ==============================================================================

-- 1. Add INSERT policy for users table
-- This allows authenticated users to create their own profile row
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create a Trigger to automatically create user profile on signup
-- This ensures that for all FUTURE signups, the profile is created automatically
-- so the client app doesn't need to do it manually.

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, credits)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    5
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new auth.users
-- We drop it first to avoid errors if it already exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. (Optional) Fix existing users who have no profile
-- This tries to insert a profile for any user in auth.users who doesn't have one in public.users
INSERT INTO public.users (id, email, name, credits)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  5
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

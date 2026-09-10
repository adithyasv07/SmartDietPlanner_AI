-- Add fields to support calorie target calculation
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS sex TEXT CHECK (sex IN ('male','female','other')),
ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 0),
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC CHECK (weight_kg >= 0),
ADD COLUMN IF NOT EXISTS height_cm NUMERIC CHECK (height_cm >= 0),
ADD COLUMN IF NOT EXISTS auto_calc_calories BOOLEAN NOT NULL DEFAULT TRUE;

-- Optional index for quick lookups by user
CREATE INDEX IF NOT EXISTS idx_profiles_user ON public.profiles(user_id);


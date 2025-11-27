-- ====================================
-- FIX CREDITS & TRANSACTIONS
-- Run this in Supabase SQL Editor
-- ====================================

-- 1. Ensure add_credits function exists
CREATE OR REPLACE FUNCTION add_credits(user_id UUID, credit_amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET credits = credits + credit_amount,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure transactions table exists
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('purchase', 'subscription', 'refund')) NOT NULL,
  amount DECIMAL(10, 2),
  credits INTEGER,
  stripe_payment_id TEXT UNIQUE,
  stripe_session_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on transactions if not already enabled
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 4. Add policy for users to view their own transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Note: No INSERT policy is needed for transactions because the webhook
-- uses the Service Role (Admin) key which bypasses RLS.

-- 5. (Optional) Check for failed transactions or manual fix
-- You can manually add credits to a specific user if needed:
-- SELECT add_credits('USER_UUID_HERE', 10);

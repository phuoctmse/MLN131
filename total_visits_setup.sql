-- SQL để tạo bảng total visits
-- Chạy trong Supabase SQL Editor

-- 1. Tạo bảng total_visits
CREATE TABLE IF NOT EXISTS total_visits (
    id INTEGER PRIMARY KEY DEFAULT 1,
    count INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert record đầu tiên
INSERT INTO total_visits (id, count) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- 3. Tạo function để increment visit count
CREATE OR REPLACE FUNCTION increment_visit_count()
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE total_visits 
    SET count = count + 1, 
        last_updated = NOW()
    WHERE id = 1
    RETURNING count INTO new_count;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Disable RLS cho total_visits (để tránh 401)
ALTER TABLE total_visits DISABLE ROW LEVEL SECURITY;

-- 5. Grant permissions cho anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, UPDATE ON total_visits TO anon;
GRANT EXECUTE ON FUNCTION increment_visit_count() TO anon;

-- 6. Grant permissions cho authenticated role (nếu cần)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE ON total_visits TO authenticated;
GRANT EXECUTE ON FUNCTION increment_visit_count() TO authenticated;
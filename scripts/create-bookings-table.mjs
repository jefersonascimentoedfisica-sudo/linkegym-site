import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tttypwipemjeacygljlz.supabase.co';
const supabaseKey = 'sb_publishable_NRFI9sVumNTJS689qtluWg_VlgTQ4mw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBookingsTable() {
  try {
    console.log('Creating bookings table...');

    // Read the SQL file
    const sql = `
-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_professional_id ON bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read bookings
CREATE POLICY "Allow public read bookings" ON bookings
  FOR SELECT USING (true);

-- Allow anyone to create bookings
CREATE POLICY "Allow public create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Allow update of bookings
CREATE POLICY "Allow update bookings" ON bookings
  FOR UPDATE USING (true);
`;

    // Execute SQL via Supabase admin API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Bookings table created successfully!');
  } catch (err) {
    console.error('Error creating bookings table:', err);
    console.log('\nNote: If you see an error, you may need to create the table manually in the Supabase dashboard.');
  }
}

createBookingsTable();

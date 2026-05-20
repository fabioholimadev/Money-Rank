import { createClient } from '@supabase/supabase-js';

// Vite exposes variables prefixed with VITE_ to the client bundle.
// Create a .env file at frontend/.env with these two keys:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error(
    '[supabaseClient] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos em frontend/.env'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
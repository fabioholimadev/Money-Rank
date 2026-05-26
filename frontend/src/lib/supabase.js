import { createClient } from '@supabase/supabase-js';

// Pega as chaves de acesso do seu arquivo frontend/.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
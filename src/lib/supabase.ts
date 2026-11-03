import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Не настроено подключение к базе данных сайта');
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});

export const SUPABASE_FUNCTIONS_URL = `${url}/functions/v1`;
export const SUPABASE_ANON_KEY = anonKey;

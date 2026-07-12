/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
supabase.from('familias').select('*').then((result) => {
  if (result.error) {
    console.error('Erro ao conectar Supabase:', result.error);
  } else {
    console.log('✅ Supabase conectado com sucesso');
  }
});

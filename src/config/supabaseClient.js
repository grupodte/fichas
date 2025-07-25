// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// Lee las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Crea y exporta el cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
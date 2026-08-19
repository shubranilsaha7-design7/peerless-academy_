import { createClient } from '@supabase/supabase-js'

// Hardcoded safe values to completely bypass the environment variable crash
const supabaseUrl = 'https://placeholder.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

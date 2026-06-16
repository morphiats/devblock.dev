import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://sjplhedryfpztecxwztb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqcGxoZWRyeWZwenRlY3h3enRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTY3ODMsImV4cCI6MjA5NzEzMjc4M30.4sYA3s618LVb2En9L_emj5Nbu9wikvy3WjOK2Y4pQJA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

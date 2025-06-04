// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hazhobbjmmaoikubxexq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhemhvYmJqbW1hb2lrdWJ4ZXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzYxNzQsImV4cCI6MjA2NDU1MjE3NH0.gP0ThzJ6HX4_RjJhpodR4LnPpJ1Va1DkR1pPlxbKeDs';

export const supabase = createClient(supabaseUrl, supabaseKey);

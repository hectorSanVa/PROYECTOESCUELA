import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfdlxvguoerwayhrzhbn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZGx4dmd1b2Vyd2F5aHJ6aGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NjAxMzEsImV4cCI6MjA2MTEzNjEzMX0.QIffb4TQz64SK6PEGnwtxzdU4tEa-IE9dTq1kmHvDRs'; // Reemplaza con tu anon key de Supabase

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
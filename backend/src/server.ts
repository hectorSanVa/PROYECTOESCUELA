import app from './app';
import { supabase } from './lib/supabase';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

// Verificar conexión a Supabase
supabase
  .from('usuarios')
  .select('*')
  .limit(1)
  .then(() => {
    console.log('Connected to Supabase');
  }, (error) => {
    console.error('Error connecting to Supabase:', error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
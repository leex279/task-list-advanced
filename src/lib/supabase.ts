import { createClient } from '@supabase/supabase-js';

// Development defaults
const DEV_SUPABASE_URL = 'http://localhost:54321';
const DEV_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Get environment variables or use development defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEV_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEV_SUPABASE_KEY;
const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'task-list-advanced'
    }
  }
});

// Export helper for checking database connection
export const checkDatabaseConnection = async (): Promise<{ ok: boolean; error?: string }> => {
  if (isDev) {
    console.info('Development mode: Using local database configuration');
    return { ok: true };
  }

  try {
    const { error: healthError } = await supabase.from('users').select('id').limit(1);
    
    if (healthError) {
      if (healthError.code === 'PGRST116') {
        // This is actually OK - it means we connected but don't have permission
        return { ok: true };
      }
      
      console.warn('Database health check failed:', {
        code: healthError.code,
        message: healthError.message,
        details: healthError.details
      });
      
      return { 
        ok: false, 
        error: 'Unable to connect to the database. Please check your configuration.'
      };
    }

    return { ok: true };
  } catch (error) {
    console.error('Database connection error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    });

    return { 
      ok: false, 
      error: 'Database connection error. Please try again later.'
    };
  }
};
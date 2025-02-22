import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'task-list-advanced'
    }
  }
});

// Export helper for checking database connection
export const checkDatabaseConnection = async (): Promise<{ ok: boolean; error?: string }> => {
  try {
    // First check if we can connect to Supabase
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
    // Log the full error for debugging
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
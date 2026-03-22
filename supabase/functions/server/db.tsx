/**
 * Client Supabase configuré pour le backend
 * Utilise le SERVICE_ROLE_KEY pour accès complet aux tables
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Helper pour logger les erreurs SQL
 */
export function logSQLError(operation: string, error: any) {
  console.error(`❌ SQL Error [${operation}]:`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
}

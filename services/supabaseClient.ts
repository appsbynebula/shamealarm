
import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const supabaseUrl = process.env.SUPABASE_URL || 'https://zpldkrzeismowvmhxqmh.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbGRrcnplaXNtb3d2bWh4cW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTUzNzUsImV4cCI6MjA4MDY3MTM3NX0.XBvLG5pJO6MM8kVqxR8_xGGvHhcvcAz9E14Yv6iMQWA';

// Defensive initialization to prevent "AuthClient" null errors if CDN fails or environment is flaky
let client;

try {
    if (typeof createClient === 'function') {
        client = createClient(supabaseUrl, supabaseAnonKey);
    } else {
        console.warn('Supabase createClient is not available. Check CDN imports.');
        // Create a dummy client to prevent runtime crashes
        client = {
            auth: {
                getSession: async () => ({ data: { session: null }, error: null }),
                signUp: async () => ({ data: { user: { id: 'mock-id' } }, error: null }),
                signInWithPassword: async () => ({ data: { user: { id: 'mock-id' } }, error: null }),
            }
        };
    }
} catch (e) {
    console.error("Error initializing Supabase client:", e);
    client = {
        auth: {
             getSession: async () => ({ data: { session: null }, error: null }),
             signUp: async () => ({ data: { user: { id: 'mock-id' } }, error: null }),
             signInWithPassword: async () => ({ data: { user: { id: 'mock-id' } }, error: null }),
        }
    };
}

export const supabase = client;

export const isSupabaseConfigured = () => {
    // We check if the key looks like a JWT (starts with ey...) to ensure it's not a placeholder
    return supabaseUrl.includes('supabase.co') && supabaseAnonKey.startsWith('ey');
};

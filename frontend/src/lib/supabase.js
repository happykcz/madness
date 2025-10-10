/**
 * Supabase Client Initialization
 *
 * Singleton pattern for Supabase client to ensure single instance
 * across the application. Reads configuration from environment variables.
 */

import { createClient } from '@supabase/supabase-js'

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env file')
}

// Create Supabase client singleton
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable for GitHub Pages
    storage: window.localStorage,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'quarry-madness-scorekeeper',
    },
  },
})

/**
 * Test Supabase connection
 * @returns {Promise<boolean>} True if connection is successful
 */
export async function testConnection() {
  try {
    const { error } = await supabase.from('teams').select('count', { count: 'exact', head: true })
    if (error) throw error
    return true
  } catch (error) {
    console.error('Supabase connection test failed:', error.message)
    return false
  }
}

/**
 * Get current session
 * @returns {Promise<Session|null>}
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Failed to get session:', error.message)
    return null
  }
  return session
}

/**
 * Get current user
 * @returns {Promise<User|null>}
 */
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Failed to get user:', error.message)
    return null
  }
  return user
}

// Export configured client as default
export default supabase

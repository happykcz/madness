/**
 * Authentication Manager
 *
 * Manages authentication state, session persistence, and auth-related operations.
 * Integrates with Supabase Auth and provides event-driven state updates.
 */

import { supabase } from '../lib/supabase.js'

class AuthManager {
  constructor() {
    this.currentUser = null
    this.currentSession = null
    this.listeners = []
    this.isInitialized = false
  }

  /**
   * Initialize auth manager and set up auth state listener
   */
  async init() {
    if (this.isInitialized) {
      console.warn('AuthManager already initialized')
      return
    }

    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      this.currentSession = session
      this.currentUser = session.user
      this.notifyListeners('SIGNED_IN', session)
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event)
      this.currentSession = session
      this.currentUser = session?.user || null
      this.notifyListeners(event, session)
    })

    this.isInitialized = true
    console.log('AuthManager initialized')
  }

  /**
   * Sign in with team credentials
   * @param {string} teamId - Team identifier
   * @param {string} password - Team password
   * @param {string} turnstileToken - Cloudflare Turnstile verification token
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async signIn(teamId, password, turnstileToken) {
    try {
      // Validate inputs
      if (!teamId || !password) {
        return { success: false, error: 'Team ID and password are required' }
      }

      if (!turnstileToken) {
        return { success: false, error: 'Please complete the verification challenge' }
      }

      // Sign in with Supabase Auth
      // Team ID is used as email: team_001@quarrymadness.local
      const email = `${teamId}@quarrymadness.local`

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        return { success: false, error: error.message }
      }

      // Store Turnstile token in session metadata if needed for verification
      if (data.session) {
        this.currentSession = data.session
        this.currentUser = data.user
      }

      return { success: true }
    } catch (error) {
      console.error('Sign in exception:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Sign out current user
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Sign out error:', error)
        return { success: false, error: error.message }
      }

      this.currentSession = null
      this.currentUser = null

      return { success: true }
    } catch (error) {
      console.error('Sign out exception:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.currentSession && !!this.currentUser
  }

  /**
   * Get current user
   * @returns {User|null}
   */
  getUser() {
    return this.currentUser
  }

  /**
   * Get current session
   * @returns {Session|null}
   */
  getSession() {
    return this.currentSession
  }

  /**
   * Get team data for current user
   * @returns {Promise<Object|null>}
   */
  async getTeamData() {
    if (!this.isAuthenticated()) return null

    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('auth_user_id', this.currentUser.id)
        .single()

      if (error) {
        console.error('Failed to fetch team data:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Exception fetching team data:', error)
      return null
    }
  }

  /**
   * Add auth state change listener
   * @param {Function} callback - Callback(event, session)
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChange(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  /**
   * Notify all listeners of auth state change
   * @param {string} event - Auth event type
   * @param {Session|null} session - Current session
   */
  notifyListeners(event, session) {
    this.listeners.forEach(callback => {
      try {
        callback(event, session)
      } catch (error) {
        console.error('Error in auth state listener:', error)
      }
    })
  }

  /**
   * Refresh session
   * @returns {Promise<Session|null>}
   */
  async refreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) throw error

      this.currentSession = session
      this.currentUser = session?.user || null

      return session
    } catch (error) {
      console.error('Failed to refresh session:', error)
      return null
    }
  }
}

// Export singleton instance
export const authManager = new AuthManager()

// Export class for testing
export default AuthManager

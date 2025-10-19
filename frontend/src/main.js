import './main.css'
import { router } from './lib/router.js'
import { authManager } from './auth/auth-manager.js'
import { supabase } from './lib/supabase.js'
import { renderLogin } from './auth/login.js'
import { renderDashboard } from './dashboard/dashboard.js'
import { renderAdminLogin } from './admin/admin-login.js'
import { renderAdminDashboard } from './admin/admin-dashboard.js'
import { renderTeamManagement } from './admin/admin-teams.js'
import { renderLeaderboards } from './admin/admin-leaderboards.js'
import { renderBonusGames } from './admin/admin-bonus.js'
import { renderNudgeManagement } from './admin/admin-nudge.js'
import { renderCompetitionControl } from './admin/admin-competition.js'
import { showInfo, showSuccess } from './shared/ui-helpers.js'

// Application entry point
console.log('Quarry Madness Scorekeeper - Initializing...')

// Initialize authentication manager
authManager.init().then(() => {
  console.log('Auth manager ready')

  // Listen for auth state changes
  authManager.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
      showSuccess('Successfully signed in!')

      // Check if user is admin
      const { data: isAdmin } = await supabase.rpc('is_admin')

      if (isAdmin) {
        router.navigate('/admin/dashboard')
      } else {
        router.navigate('/dashboard')
      }
    } else if (event === 'SIGNED_OUT') {
      showInfo('Signed out')
      router.navigate('/login')
    }
  })
})

// Define routes
router.registerRoutes({
  '/': renderHome,
  '/login': renderLogin,
  '/dashboard': renderDashboard,
  '/results': renderLeaderboards,
  '/admin': renderAdminLogin,
  '/admin/dashboard': renderAdminDashboard,
  '/admin/teams': renderTeamManagement,
  '/admin/leaderboards': renderLeaderboards,
  '/admin/bonus': renderBonusGames,
  '/admin/nudge': renderNudgeManagement,
  '/admin/competition': renderCompetitionControl,
})

// Add auth guard for protected routes
router.beforeEach(async (to, from, next) => {
  const teamProtectedRoutes = ['/dashboard', '/results']
  const adminProtectedRoutes = ['/admin/dashboard', '/admin/teams', '/admin/leaderboards', '/admin/competition', '/admin/results', '/admin/settings']

  // Check team routes
  if (teamProtectedRoutes.includes(to) && !authManager.isAuthenticated()) {
    console.log('Protected team route - redirecting to login')
    next('/login')
    return false
  }

  // Check admin routes
  if (adminProtectedRoutes.includes(to)) {
    if (!authManager.isAuthenticated()) {
      console.log('Protected admin route - redirecting to admin login')
      next('/admin')
      return false
    }

    // Verify admin privileges
    try {
      const { data: isAdmin, error } = await supabase.rpc('is_admin')
      if (error || !isAdmin) {
        console.log('Not an admin - redirecting')
        next('/')
        return false
      }
    } catch (err) {
      console.error('Error checking admin status:', err)
      next('/')
      return false
    }
  }

  return true
})

/**
 * Render home page
 */
function renderHome() {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <div class="min-h-screen">
      <!-- GitHub-style header -->
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness 2025</h1>
            </div>
            <div style="display: flex; gap: 12px;">
              <button class="btn btn-header btn-sm btn-inline" onclick="window.location.hash='#/admin'">
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="container" style="padding-top: 32px;">
        <div class="card max-w-2xl mx-auto text-center">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 700; margin: 0 0 6px;">
            Quarry Madness 2025
          </h2>
          <p style="color: var(--text-secondary); margin: 0 0 10px;">
            A social, 12‑hour climbing jam by CAWA
          </p>

          <p style="color: var(--text-secondary); margin: 0 0 8px;">
            This app helps teams log ascents and track points throughout the day — simple, fast, and mobile‑friendly.
          </p>
          <p style="color: var(--text-muted); margin: 0 0 16px;">
            Saturday 18 October 2025 • 6 am – 6 pm
          </p>

          <button class="btn btn-primary btn-cta gradient-primary" onclick="window.location.hash='#/login'">
            Log In to Your Team
          </button>
        </div>
      </main>
    </div>
  `
}

// renderLogin and renderDashboard are now imported from separate modules

// Initialize router
router.init()

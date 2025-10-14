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
  '/admin': renderAdminLogin,
  '/admin/dashboard': renderAdminDashboard,
  '/admin/teams': renderTeamManagement,
  '/admin/leaderboards': renderLeaderboards,
  '/admin/bonus': renderBonusGames,
  '/admin/competition': renderCompetitionControl,
})

// Add auth guard for protected routes
router.beforeEach(async (to, from, next) => {
  const teamProtectedRoutes = ['/dashboard']
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
              <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness 2025</h1>
            </div>
            <div style="display: flex; gap: 12px;">
              <button class="btn btn-secondary" onclick="window.location.hash='#/login'">
                Team Sign In
              </button>
              <button class="btn btn-secondary" onclick="window.location.hash='#/admin'">
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="container" style="padding-top: 32px;">
        <div class="card max-w-2xl mx-auto text-center">
          <h2 class="text-2xl font-semibold mb-4" style="color: var(--text-primary);">
            Climbing Competition Scorekeeper
          </h2>
          <p class="mb-4" style="color: var(--text-secondary);">
            Powered by Climbers Association of Western Australia
          </p>

          <div class="mt-6 p-4" style="background-color: var(--bg-secondary); border-radius: 6px;">
            <p class="text-sm font-semibold mb-2" style="color: var(--text-primary);">
               Phase 2 Complete
            </p>
            <p class="text-sm mb-4" style="color: var(--text-secondary);">
              Router, Auth, Scoring Engine, and UI Helpers ready
            </p>

            <ul class="text-sm text-left" style="color: var(--text-secondary); list-style: none; padding: 0;">
              <li> Supabase client initialized</li>
              <li> Hash-based routing for GitHub Pages</li>
              <li> Authentication manager with session handling</li>
              <li> Scoring engine with all competition rules</li>
              <li> Category classifier for teams and climbers</li>
              <li> Toast notifications and loading states</li>
            </ul>
          </div>

          <button class="btn btn-primary mt-6" onclick="window.location.hash='#/login'">
            Get Started
          </button>
        </div>
      </main>
    </div>
  `
}

// renderLogin and renderDashboard are now imported from separate modules

// Initialize router
router.init()

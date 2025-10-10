import './main.css'
import { router } from './lib/router.js'
import { authManager } from './auth/auth-manager.js'
import { renderLogin } from './auth/login.js'
import { renderDashboard } from './dashboard/dashboard.js'
import { showInfo, showSuccess } from './shared/ui-helpers.js'

// Application entry point
console.log('Quarry Madness Scorekeeper - Initializing...')

// Initialize authentication manager
authManager.init().then(() => {
  console.log('Auth manager ready')

  // Listen for auth state changes
  authManager.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      showSuccess('Successfully signed in!')
      router.navigate('/dashboard')
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
})

// Add auth guard for protected routes
router.beforeEach(async (to, from, next) => {
  const protectedRoutes = ['/dashboard']

  if (protectedRoutes.includes(to) && !authManager.isAuthenticated()) {
    console.log('Protected route - redirecting to login')
    next('/login')
    return false
  }

  return true
})

/**
 * Render home page
 */
function renderHome() {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: #fafbfc;">
      <!-- GitHub-style header -->
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness 2025</h1>
            </div>
            <button class="btn btn-secondary" onclick="window.location.hash='#/login'">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="container" style="padding-top: 32px;">
        <div class="card max-w-2xl mx-auto text-center">
          <h2 class="text-2xl font-semibold mb-4" style="color: #24292e;">
            Climbing Competition Scorekeeper
          </h2>
          <p class="mb-4" style="color: #586069;">
            Powered by Climbers Association of Western Australia
          </p>

          <div class="mt-6 p-4" style="background-color: #f6f8fa; border-radius: 6px;">
            <p class="text-sm font-semibold mb-2" style="color: #24292e;">
              ✅ Phase 2 Complete
            </p>
            <p class="text-sm mb-4" style="color: #586069;">
              Router, Auth, Scoring Engine, and UI Helpers ready
            </p>

            <ul class="text-sm text-left" style="color: #586069; list-style: none; padding: 0;">
              <li>✅ Supabase client initialized</li>
              <li>✅ Hash-based routing for GitHub Pages</li>
              <li>✅ Authentication manager with session handling</li>
              <li>✅ Scoring engine with all competition rules</li>
              <li>✅ Category classifier for teams and climbers</li>
              <li>✅ Toast notifications and loading states</li>
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

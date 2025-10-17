/**
 * Admin Login Page
 *
 * Separate authentication for admin users to access team management,
 * results viewing, and competition settings.
 * Includes Turnstile verification and partial login support.
 */

import { authManager } from '../auth/auth-manager.js'
import { router } from '../lib/router.js'
import { showLoading, hideLoading } from '../shared/ui-helpers.js'
import { supabase } from '../lib/supabase.js'

/**
 * Render admin login page
 */
export function renderAdminLogin() {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center" style="padding: 20px;">
      <div class="card" style="max-width: 450px; width: 100%;">
        <!-- CAWA Logo -->
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" style="height: 80px; margin: 0 auto;" />
          <h1 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-top: 16px;">
            Admin Portal
          </h1>
          <p style="color: var(--text-secondary); font-size: 14px; margin-top: 8px;">
            Team Management & Competition Control
          </p>
        </div>

        <!-- Login Form -->
        <form id="admin-login-form" style="margin-bottom: 24px;">
          <!-- Username Input -->
          <div style="margin-bottom: 16px;">
            <label for="admin-username" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
              Admin Username
            </label>
            <input
              type="text"
              id="admin-username"
              name="admin-username"
              placeholder="admin"
              required
              autocomplete="username"
              style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border-primary);
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                background-color: var(--bg-secondary);
              "
            />
            <p style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
              Enter 'admin' or full email
            </p>
          </div>

          <!-- Password Input -->
          <div style="margin-bottom: 16px;">
            <label for="admin-password" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
              Password
            </label>
            <div style="position: relative;">
              <input
                type="password"
                id="admin-password"
                name="admin-password"
                placeholder="Enter admin password"
                required
                autocomplete="current-password"
                style="
                  width: 100%;
                  padding: 8px 40px 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: var(--bg-secondary);
                "
              />
              <button
                type="button"
                id="toggle-admin-password"
                style="
                  position: absolute;
                  right: 8px;
                  top: 50%;
                  transform: translateY(-50%);
                  background: none;
                  border: none;
                  color: var(--text-secondary);
                  cursor: pointer;
                  padding: 4px 8px;
                  font-size: 12px;
                  font-weight: 500;
                "
              >
                Show
              </button>
            </div>
          </div>

          <!-- Cloudflare Turnstile Widget -->
          <div style="margin-bottom: 16px;">
            <div id="admin-turnstile-widget"></div>
          </div>

          <!-- Error Message Container -->
          <div id="admin-login-error" style="margin-bottom: 16px;"></div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%; padding: 10px; font-size: 16px;"
          >
            Sign In as Admin
          </button>
        </form>

        <!-- Back to Home Link -->
        <div style="text-align: center; align-items: center;">
          <a
            href="#/"
            style="color: var(--color-tertiary); text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Home
          </a>
          <span style="color: var(--border-primary); margin: 0 8px;">|</span>
          <a
            href="#/login"
            style="color: var(--color-tertiary); text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;"
          >
            Team Login
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
              <polyline points="9 6 15 12 9 18"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `

  // Initialize Turnstile widget
  initializeAdminTurnstile()

  // Setup form submission
  setupAdminLoginForm()
}

/**
 * Initialize Cloudflare Turnstile widget for admin
 */
function initializeAdminTurnstile() {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  if (!siteKey || siteKey === 'your-turnstile-site-key-here') {
    console.warn('Turnstile site key not configured for admin')
    document.getElementById('admin-turnstile-widget').innerHTML = `
      <div style="
        padding: 12px;
        background-color: #fff3cd;
        border: 1px solid #ffeeba;
        border-radius: 6px;
        color: #856404;
        font-size: 14px;
      ">
        [Warning] Turnstile not configured. Using development mode.
      </div>
    `
    return
  }

  // Wait for Turnstile API to load
  const checkTurnstile = setInterval(() => {
    if (window.turnstile) {
      clearInterval(checkTurnstile)

      try {
        window.turnstile.render('#admin-turnstile-widget', {
          sitekey: siteKey,
          theme: 'light',
          callback: (token) => {
            console.log('Admin Turnstile verification successful')
            window.adminTurnstileToken = token
          },
          'error-callback': () => {
            console.error('Admin Turnstile verification failed')
            showError('Verification failed. Please refresh and try again.', document.getElementById('admin-login-error'))
          },
        })
      } catch (error) {
        console.error('Failed to render Admin Turnstile:', error)
        document.getElementById('admin-turnstile-widget').innerHTML = `
          <div style="
            padding: 12px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            color: #721c24;
            font-size: 14px;
          ">
            [Error] Failed to load verification widget
          </div>
        `
      }
    }
  }, 100)

  // Timeout after 10 seconds
  setTimeout(() => {
    clearInterval(checkTurnstile)
  }, 10000)
}

/**
 * Setup admin login form submission
 */
function setupAdminLoginForm() {
  const form = document.getElementById('admin-login-form')
  const errorContainer = document.getElementById('admin-login-error')

  // Setup password toggle
  const passwordInput = document.getElementById('admin-password')
  const toggleButton = document.getElementById('toggle-admin-password')

  toggleButton.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type')
    if (type === 'password') {
      passwordInput.setAttribute('type', 'text')
      toggleButton.textContent = 'Hide'
    } else {
      passwordInput.setAttribute('type', 'password')
      toggleButton.textContent = 'Show'
    }
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorContainer.innerHTML = ''

    const username = document.getElementById('admin-username').value.trim()
    const password = document.getElementById('admin-password').value

    // Validate inputs
    if (!username || !password) {
      showError('Please enter both username and password', errorContainer)
      return
    }

    // Check Turnstile token (unless in dev mode)
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
    if (siteKey && siteKey !== 'your-turnstile-site-key-here' && !window.adminTurnstileToken) {
      showError('Please complete the verification challenge', errorContainer)
      return
    }

    // Convert partial username to full email
    let email = username
    if (!username.includes('@')) {
      // Partial login: "admin" -> "admin@quarrymadness.local"
      email = `${username}@quarrymadness.local`
    }

    try {
      showLoading()

      console.log('🔐 Admin login attempt:', email)

      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        hideLoading()
        console.error('Admin sign in error:', error)
        showError(error.message || 'Invalid admin credentials', errorContainer)
        return
      }

      console.log('[Auth] Successful, checking admin privileges...')

      // Verify user is admin
      const { data: isAdminData, error: adminError } = await supabase
        .rpc('is_admin')

      console.log('Admin check result:', { isAdminData, adminError })

      hideLoading()

      if (adminError || !isAdminData) {
        console.error('Not an admin or error:', { adminError, isAdminData })
        // Sign out non-admin user
        await supabase.auth.signOut()
        showError('Access denied: Admin privileges required', errorContainer)
        return
      }

      // Success - redirect to admin dashboard
      console.log('[Admin] Verified, redirecting to dashboard')
      authManager.currentSession = data.session
      authManager.currentUser = data.user

      router.navigate('/admin/dashboard')
    } catch (err) {
      hideLoading()
      console.error('Login error:', err)
      showError('An error occurred during login', errorContainer)
    }
  })
}

/**
 * Show error message in error container
 */
function showError(message, container) {
  container.innerHTML = `
    <div style="
      padding: 12px;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      color: #721c24;
      font-size: 14px;
    ">
      ${message}
    </div>
  `
}

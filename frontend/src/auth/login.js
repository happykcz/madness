/**
 * Login Page Implementation
 *
 * Handles team authentication with Cloudflare Turnstile verification.
 * User Story 2 - Team Authentication (T022-T027)
 */

import { authManager } from './auth-manager.js'
import { router } from '../lib/router.js'
import { showError, showLoading, hideLoading } from '../shared/ui-helpers.js'

/**
 * Render login page with Turnstile widget
 */
export function renderLogin() {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center" style="padding: 20px;">
      <div class="card" style="max-width: 450px; width: 100%;">
        <!-- CAWA Logo -->
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" style="height: 80px; margin: 0 auto;" />
          <h1 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-top: 16px;">
            Quarry Madness
          </h1>
          <p style="color: var(--text-secondary); font-size: 14px; margin-top: 8px;">
            Team Sign In
          </p>
        </div>

        <!-- Login Form -->
        <form id="login-form" style="margin-bottom: 24px;">
          <!-- Team ID Input -->
          <div style="margin-bottom: 16px;">
            <label for="team-id" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
              Team ID
            </label>
            <input
              type="text"
              id="team-id"
              name="team-id"
              placeholder="team_001"
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
          </div>

          <!-- Password Input -->
          <div style="margin-bottom: 16px;">
            <label for="password" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
              Password
            </label>
            <div style="position: relative;">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your team password"
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
                id="toggle-password"
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
            <div id="turnstile-widget"></div>
          </div>

          <!-- Error Message Container -->
          <div id="login-error" style="margin-bottom: 16px;"></div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%; padding: 10px; font-size: 16px;"
          >
            Sign In
          </button>
        </form>

        <!-- Back to Home Link -->
        <div style="text-align: center;">
          <a
            href="#/"
            style="color: var(--color-tertiary); text-decoration: none; font-size: 14px;"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  `

  // Initialize Turnstile widget
  initializeTurnstile()

  // Setup form submission handler
  setupLoginForm()
}

/**
 * Initialize Cloudflare Turnstile widget
 */
function initializeTurnstile() {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  if (!siteKey || siteKey === 'your-turnstile-site-key-here') {
    console.warn('Turnstile site key not configured')
    document.getElementById('turnstile-widget').innerHTML = `
      <div style="
        padding: 12px;
        background-color: #fff3cd;
        border: 1px solid #ffeeba;
        border-radius: 6px;
        color: #856404;
        font-size: 14px;
      ">
        ⚠️ Turnstile not configured. Using development mode.
      </div>
    `
    return
  }

  // Wait for Turnstile API to load
  const checkTurnstile = setInterval(() => {
    if (window.turnstile) {
      clearInterval(checkTurnstile)

      try {
        window.turnstile.render('#turnstile-widget', {
          sitekey: siteKey,
          theme: 'light',
          callback: (token) => {
            console.log('Turnstile verification successful')
            // Store token for form submission
            window.turnstileToken = token
          },
          'error-callback': () => {
            console.error('Turnstile verification failed')
            showError('Verification failed. Please refresh and try again.')
          },
        })
      } catch (error) {
        console.error('Failed to render Turnstile:', error)
        document.getElementById('turnstile-widget').innerHTML = `
          <div style="
            padding: 12px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            color: #721c24;
            font-size: 14px;
          ">
            ❌ Failed to load verification widget
          </div>
        `
      }
    }
  }, 100)

  // Timeout after 10 seconds
  setTimeout(() => {
    clearInterval(checkTurnstile)
    if (!window.turnstile) {
      console.error('Turnstile failed to load')
      document.getElementById('turnstile-widget').innerHTML = `
        <div style="
          padding: 12px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          color: #721c24;
          font-size: 14px;
        ">
          ❌ Verification widget failed to load. Please check your connection.
        </div>
      `
    }
  }, 10000)
}

/**
 * Setup login form submission handler
 */
function setupLoginForm() {
  const form = document.getElementById('login-form')
  const errorDiv = document.getElementById('login-error')

  // Setup password toggle
  const passwordInput = document.getElementById('password')
  const toggleButton = document.getElementById('toggle-password')

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

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    errorDiv.innerHTML = '' // Clear previous errors

    // Get form values
    const teamId = document.getElementById('team-id').value.trim()
    const password = document.getElementById('password').value

    // Validate inputs
    if (!teamId || !password) {
      errorDiv.innerHTML = `
        <div style="
          padding: 12px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          color: #721c24;
          font-size: 14px;
        ">
          ❌ Please enter both Team ID and Password
        </div>
      `
      return
    }

    // Get Turnstile token (or use dev mode)
    const turnstileToken = window.turnstileToken || 'dev-mode-token'

    if (!turnstileToken) {
      errorDiv.innerHTML = `
        <div style="
          padding: 12px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          color: #721c24;
          font-size: 14px;
        ">
          ❌ Please complete the verification challenge
        </div>
      `
      return
    }

    // Show loading
    showLoading('Signing in...')

    try {
      // Attempt sign in
      const result = await authManager.signIn(teamId, password, turnstileToken)

      hideLoading()

      if (result.success) {
        // Success! AuthManager will trigger navigation via auth state listener
        console.log('Login successful')
      } else {
        // Show error
        errorDiv.innerHTML = `
          <div style="
            padding: 12px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            color: #721c24;
            font-size: 14px;
          ">
            ❌ ${result.error || 'Login failed. Please check your credentials.'}
          </div>
        `

        // Reset Turnstile widget
        if (window.turnstile) {
          try {
            window.turnstile.reset()
            window.turnstileToken = null
          } catch (e) {
            console.error('Failed to reset Turnstile:', e)
          }
        }
      }
    } catch (error) {
      hideLoading()
      console.error('Login exception:', error)

      errorDiv.innerHTML = `
        <div style="
          padding: 12px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          color: #721c24;
          font-size: 14px;
        ">
          ❌ An unexpected error occurred. Please try again.
        </div>
      `

      // Reset Turnstile widget
      if (window.turnstile) {
        try {
          window.turnstile.reset()
          window.turnstileToken = null
        } catch (e) {
          console.error('Failed to reset Turnstile:', e)
        }
      }
    }
  })
}

export default renderLogin

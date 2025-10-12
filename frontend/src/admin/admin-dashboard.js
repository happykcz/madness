/**
 * Admin Dashboard - Main Hub
 *
 * Central navigation for admin functions:
 * - Team Management
 * - Results/Leaderboard
 * - Competition Settings
 */

import { router } from '../lib/router.js'
import { supabase } from '../lib/supabase.js'

/**
 * Render admin dashboard
 */
export async function renderAdminDashboard() {
  const app = document.querySelector('#app')

  // Show loading state
  app.innerHTML = `
    <div class="min-h-screen">
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 16px;">Loading admin dashboard...</p>
      </div>
    </div>
  `

  try {
    // Fetch dashboard stats
    const { data: stats, error } = await supabase
      .from('admin_dashboard_stats')
      .select('*')
      .single()

    if (error) throw error

    // Render dashboard
    renderDashboard(stats)
  } catch (error) {
    console.error('Error loading admin dashboard:', error)
    app.innerHTML = `
      <div class="min-h-screen" style="padding: 40px;">
        <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
          <h2 style="color: var(--color-primary); margin-bottom: 16px;">Error Loading Dashboard</h2>
          <p style="color: var(--text-secondary);">${error.message}</p>
          <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 16px;">
            Retry
          </button>
        </div>
      </div>
    `
  }
}

/**
 * Render dashboard with stats
 */
function renderDashboard(stats) {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen">
      <!-- Header -->
      <div class="header" style="padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="/12qm25/assets/cawa-logo.png" alt="CAWA" style="height: 40px;" />
          <h1 style="color: white; font-size: 18px; font-weight: 600; margin: 0;">
            Admin Portal
          </h1>
        </div>
        <button id="admin-signout" class="btn btn-secondary">
          Sign Out
        </button>
      </div>

      <!-- Main Content -->
      <div style="max-width: 1280px; margin: 0 auto; padding: 40px 24px;">
        <!-- Welcome -->
        <h2 style="color: var(--text-primary); font-size: 28px; font-weight: 600; margin-bottom: 8px;">
          Quarry Madness Admin
        </h2>
        <p style="color: var(--text-secondary); font-size: 16px; margin-bottom: 32px;">
          Manage teams, view results, and control competition settings
        </p>

        <!-- Stats Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
          <!-- Total Teams -->
          <div class="card">
            <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 4px;">Total Teams</div>
            <div style="color: var(--text-primary); font-size: 32px; font-weight: 600;">${stats.total_teams || 0}</div>
          </div>

          <!-- Total Climbers -->
          <div class="card">
            <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 4px;">Total Climbers</div>
            <div style="color: var(--text-primary); font-size: 32px; font-weight: 600;">${stats.total_climbers || 0}</div>
          </div>

          <!-- Total Ascents -->
          <div class="card">
            <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 4px;">Total Ascents</div>
            <div style="color: var(--text-primary); font-size: 32px; font-weight: 600;">${stats.total_ascents || 0}</div>
          </div>

          <!-- Active Windows -->
          <div class="card">
            <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 4px;">Active Windows</div>
            <div style="color: var(--text-primary); font-size: 32px; font-weight: 600;">${stats.active_windows || 0}</div>
          </div>
        </div>

        <!-- Current Leader (if there are ascents) -->
        ${stats.total_ascents > 0 ? `
          <div class="card" style="margin-bottom: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">🏆 Current Leader</div>
            <div style="font-size: 24px; font-weight: 600;">${stats.current_leader || 'Loading...'}</div>
          </div>
        ` : ''}

        <!-- Navigation Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          <!-- Team Management -->
          <div class="card hover-card" id="nav-teams" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: start; gap: 16px;">
              <div style="font-size: 40px;">👥</div>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 20px; font-weight: 600; margin-bottom: 8px;">
                  Team Management
                </h3>
                <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.5;">
                  Create new teams, view credentials, reset passwords, and manage team information
                </p>
                <div style="margin-top: 12px; color: var(--color-primary); font-weight: 500;">
                  Manage Teams →
                </div>
              </div>
            </div>
          </div>

          <!-- Results & Leaderboard -->
          <div class="card hover-card" id="nav-results" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: start; gap: 16px;">
              <div style="font-size: 40px;">📊</div>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 20px; font-weight: 600; margin-bottom: 8px;">
                  Results & Leaderboard
                </h3>
                <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.5;">
                  View current standings, filter by category, export results, and monitor live competition
                </p>
                <div style="margin-top: 12px; color: var(--color-primary); font-weight: 500;">
                  View Results →
                </div>
              </div>
            </div>
          </div>

          <!-- Competition Settings -->
          <div class="card hover-card" id="nav-settings" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: start; gap: 16px;">
              <div style="font-size: 40px;">⚙️</div>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 20px; font-weight: 600; margin-bottom: 8px;">
                  Competition Settings
                </h3>
                <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.5;">
                  Manage scoring windows, override times for teams, and control competition parameters
                </p>
                <div style="margin-top: 12px; color: var(--color-primary); font-weight: 500;">
                  Settings →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .hover-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }
    </style>
  `

  // Setup event listeners
  setupNavigationListeners()
}

/**
 * Setup navigation click handlers
 */
function setupNavigationListeners() {
  document.getElementById('nav-teams')?.addEventListener('click', () => {
    router.navigate('/admin/teams')
  })

  document.getElementById('nav-results')?.addEventListener('click', () => {
    router.navigate('/admin/results')
  })

  document.getElementById('nav-settings')?.addEventListener('click', () => {
    router.navigate('/admin/settings')
  })

  document.getElementById('admin-signout')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    router.navigate('/')
  })
}

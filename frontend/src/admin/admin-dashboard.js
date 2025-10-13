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

        <!-- Stats Cards (mobile-optimized) -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
          <!-- Total Teams -->
          <div class="card" style="padding: 12px;">
            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 2px;">Teams</div>
            <div style="color: var(--text-primary); font-size: 24px; font-weight: 600;">${stats.total_teams || 0}</div>
          </div>

          <!-- Total Climbers -->
          <div class="card" style="padding: 12px;">
            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 2px;">Climbers</div>
            <div style="color: var(--text-primary); font-size: 24px; font-weight: 600;">${stats.total_climbers || 0}</div>
          </div>

          <!-- Total Ascents -->
          <div class="card" style="padding: 12px;">
            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 2px;">Ascents</div>
            <div style="color: var(--text-primary); font-size: 24px; font-weight: 600;">${stats.total_ascents || 0}</div>
          </div>

          <!-- Active Windows -->
          <div class="card" style="padding: 12px;">
            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 2px;">Windows</div>
            <div style="color: var(--text-primary); font-size: 24px; font-weight: 600;">${stats.active_windows || 0}</div>
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
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <!-- Team Management -->
          <div class="card hover-card" id="nav-teams" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: start; gap: 12px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4 10v-2a4 4 0 0 0-3-3.87" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 6px;">
                  Team Management
                </h3>
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.4;">
                  Create and manage teams, view credentials, and edit team information
                </p>
                <div style="margin-top: 8px; color: var(--color-primary); font-weight: 500; font-size: 14px;">
                  Manage Teams →
                </div>
              </div>
            </div>
          </div>

          <!-- Results & Leaderboard -->
          <div class="card hover-card" id="nav-results" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: start; gap: 12px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <path d="M18 20V10M12 20V4M6 20v-6" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 6px;">
                  Results & Leaderboard
                </h3>
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.4;">
                  View standings, filter by category, and monitor live competition
                </p>
                <div style="margin-top: 8px; color: var(--color-primary); font-weight: 500; font-size: 14px;">
                  View Results →
                </div>
              </div>
            </div>
          </div>

          <!-- Competition Settings -->
          <div class="card hover-card" id="nav-settings" style="cursor: pointer; transition: all 0.2s;">
            <div style="display: flex; align-items: start; gap: 12px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <circle cx="12" cy="12" r="3" stroke="var(--color-primary)" stroke-width="2"/>
                <path d="M12 1v6m0 6v6M1 12h6m6 0h6m-2.5 8.66l-5.2-3m5.2-11.32l-5.2 3m0 8.32l5.2 3m-5.2-11.32l5.2-3" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <div style="flex: 1;">
                <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 6px;">
                  Competition Settings
                </h3>
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.4;">
                  Manage scoring windows and control competition parameters
                </p>
                <div style="margin-top: 8px; color: var(--color-primary); font-weight: 500; font-size: 14px;">
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
    router.navigate('/admin/leaderboards')
  })

  document.getElementById('nav-settings')?.addEventListener('click', () => {
    router.navigate('/admin/competition')
  })

  document.getElementById('admin-signout')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    router.navigate('/')
  })
}

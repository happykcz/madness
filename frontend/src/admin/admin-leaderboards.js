/**
 * Admin Leaderboards
 *
 * Real-time leaderboard views for:
 * - Team categories (Masters, Recreational, Intermediate, Advanced)
 * - Climber categories (same)
 * - Hardest sends
 * - Total ticks by climber/team
 */

import { supabase } from '../lib/supabase.js'
import { showError, showLoading, hideLoading } from '../shared/ui-helpers.js'

/**
 * Render admin leaderboards page
 */
export async function renderLeaderboards() {
  const app = document.querySelector('#app')

  // Show loading
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      <header class="header">
        <div class="container">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h1 style="color: white; font-size: 20px; font-weight: 600;">Leaderboards</h1>
            <button id="back-to-admin" class="btn btn-secondary">
              ← Admin Dashboard
            </button>
          </div>
        </div>
      </header>
      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <p style="color: var(--text-secondary); text-align: center;">Loading leaderboards...</p>
      </main>
    </div>
  `

  try {
    // Fetch all data
    const [teamScores, climberScores, hardestSends] = await Promise.all([
      fetchTeamScores(),
      fetchClimberScores(),
      fetchHardestSends()
    ])

    renderLeaderboardsContent(teamScores, climberScores, hardestSends)
  } catch (error) {
    console.error('Error loading leaderboards:', error)
    showError('Failed to load leaderboards')
  }
}

/**
 * Fetch team scores grouped by category
 */
async function fetchTeamScores() {
  const { data, error } = await supabase
    .from('team_scores')
    .select('*')
    .order('total_points', { ascending: false })

  if (error) throw error

  // Group by category
  return {
    masters: data.filter(t => t.category === 'masters'),
    recreational: data.filter(t => t.category === 'recreational'),
    intermediate: data.filter(t => t.category === 'intermediate'),
    advanced: data.filter(t => t.category === 'advanced')
  }
}

/**
 * Fetch climber scores grouped by category
 */
async function fetchClimberScores() {
  const { data, error } = await supabase
    .from('climber_scores')
    .select('*')
    .order('total_points', { ascending: false })

  if (error) throw error

  // Group by category
  return {
    recreational: data.filter(c => c.category === 'recreational'),
    intermediate: data.filter(c => c.category === 'intermediate'),
    advanced: data.filter(c => c.category === 'advanced')
  }
}

/**
 * Fetch hardest sends (top climbers by hardest route)
 */
async function fetchHardestSends() {
  const { data, error } = await supabase
    .from('climber_scores')
    .select('*')
    .order('hardest_send', { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}

/**
 * Render leaderboards content
 */
function renderLeaderboardsContent(teamScores, climberScores, hardestSends) {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      <header class="header">
        <div class="container">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h1 style="color: white; font-size: 20px; font-weight: 600;">Leaderboards</h1>
            <div style="display: flex; gap: 12px;">
              <button id="refresh-btn" class="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle;">
                  <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                Refresh
              </button>
              <button id="back-to-admin" class="btn btn-secondary">← Dashboard</button>
            </div>
          </div>
        </div>
      </header>

      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <!-- Tab Navigation -->
        <div style="
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid var(--border-secondary);
          overflow-x: auto;
        ">
          <button class="leaderboard-tab active" data-tab="teams">Team Categories</button>
          <button class="leaderboard-tab" data-tab="climbers">Climber Categories</button>
          <button class="leaderboard-tab" data-tab="hardest">Hardest Sends</button>
        </div>

        <!-- Tab Content -->
        <div id="tab-teams" class="tab-content active">
          ${renderTeamLeaderboards(teamScores)}
        </div>

        <div id="tab-climbers" class="tab-content" style="display: none;">
          ${renderClimberLeaderboards(climberScores)}
        </div>

        <div id="tab-hardest" class="tab-content" style="display: none;">
          ${renderHardestSends(hardestSends)}
        </div>
      </main>
    </div>

    <style>
      .leaderboard-tab {
        padding: 12px 20px;
        border: none;
        background: none;
        color: var(--text-secondary);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        white-space: nowrap;
      }

      .leaderboard-tab:hover {
        color: var(--text-primary);
      }

      .leaderboard-tab.active {
        color: var(--color-primary);
        border-bottom-color: var(--color-primary);
      }

      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
      }
    </style>
  `

  setupLeaderboardListeners()
}

/**
 * Render team category leaderboards
 */
function renderTeamLeaderboards(teamScores) {
  const categories = [
    { key: 'masters', label: 'Masters Teams', color: '#6f42c1' },
    { key: 'advanced', label: 'Advanced Teams', color: '#dc3545' },
    { key: 'intermediate', label: 'Intermediate Teams', color: '#fd7e14' },
    { key: 'recreational', label: 'Recreational Teams', color: '#28a745' }
  ]

  return categories.map(cat => `
    <div class="card" style="margin-bottom: 24px;">
      <h3 style="
        color: ${cat.color};
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid ${cat.color};
      ">
        ${cat.label}
      </h3>
      ${teamScores[cat.key].length > 0 ? `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-secondary);">
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">RANK</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">TEAM</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">POINTS</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">SENDS</th>
            </tr>
          </thead>
          <tbody>
            ${teamScores[cat.key].map((team, index) => `
              <tr style="border-bottom: 1px solid var(--border-secondary);">
                <td style="padding: 12px 8px;">
                  <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: ${index < 3 ? cat.color : 'var(--bg-secondary)'};
                    color: ${index < 3 ? 'white' : 'var(--text-primary)'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                  ">
                    ${index + 1}
                  </div>
                </td>
                <td style="padding: 12px 8px;">
                  <div style="font-weight: 600; color: var(--text-primary);">${team.team_name}</div>
                  <div style="font-size: 12px; color: var(--text-secondary);">${team.team_id}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="font-size: 20px; font-weight: 700; color: ${cat.color};">${team.total_points}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="color: var(--text-primary);">${team.total_ascents || 0}</div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No teams in this category yet
        </p>
      `}
    </div>
  `).join('')
}

/**
 * Render climber category leaderboards
 */
function renderClimberLeaderboards(climberScores) {
  const categories = [
    { key: 'advanced', label: 'Advanced Climbers', color: '#dc3545' },
    { key: 'intermediate', label: 'Intermediate Climbers', color: '#fd7e14' },
    { key: 'recreational', label: 'Recreational Climbers', color: '#28a745' }
  ]

  return categories.map(cat => `
    <div class="card" style="margin-bottom: 24px;">
      <h3 style="
        color: ${cat.color};
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid ${cat.color};
      ">
        ${cat.label}
      </h3>
      ${climberScores[cat.key].length > 0 ? `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-secondary);">
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">RANK</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">CLIMBER</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">POINTS</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">SENDS</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">HARDEST</th>
            </tr>
          </thead>
          <tbody>
            ${climberScores[cat.key].map((climber, index) => `
              <tr style="border-bottom: 1px solid var(--border-secondary);">
                <td style="padding: 12px 8px;">
                  <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: ${index < 3 ? cat.color : 'var(--bg-secondary)'};
                    color: ${index < 3 ? 'white' : 'var(--text-primary)'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                  ">
                    ${index + 1}
                  </div>
                </td>
                <td style="padding: 12px 8px;">
                  <div style="font-weight: 600; color: var(--text-primary);">${climber.name}</div>
                  <div style="font-size: 12px; color: var(--text-secondary);">Age ${climber.age || '?'}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="font-size: 20px; font-weight: 700; color: ${cat.color};">${climber.total_points}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="color: var(--text-primary);">${climber.route_ascents || 0}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="font-weight: 600; color: var(--text-primary);">${climber.hardest_send || 0}</div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No climbers in this category yet
        </p>
      `}
    </div>
  `).join('')
}

/**
 * Render hardest sends leaderboard
 */
function renderHardestSends(hardestSends) {
  return `
    <div class="card">
      <h3 style="
        color: var(--color-primary);
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 2px solid var(--color-primary);
      ">
        Top 20 Hardest Sends
      </h3>
      ${hardestSends.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-secondary);">
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">RANK</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">CLIMBER</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">CATEGORY</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">HARDEST GRADE</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">TOTAL POINTS</th>
            </tr>
          </thead>
          <tbody>
            ${hardestSends.map((climber, index) => `
              <tr style="border-bottom: 1px solid var(--border-secondary);">
                <td style="padding: 12px 8px;">
                  <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: ${index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : 'var(--bg-secondary)'};
                    color: ${index < 3 ? 'white' : 'var(--text-primary)'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                  ">
                    ${index + 1}
                  </div>
                </td>
                <td style="padding: 12px 8px;">
                  <div style="font-weight: 600; color: var(--text-primary);">${climber.name}</div>
                </td>
                <td style="padding: 12px 8px;">
                  <span style="
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 11px;
                    background-color: ${getCategoryColor(climber.category)};
                    color: white;
                    text-transform: capitalize;
                  ">
                    ${climber.category}
                  </span>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="font-size: 24px; font-weight: 700; color: var(--color-primary);">${climber.hardest_send || 0}</div>
                </td>
                <td style="padding: 12px 8px; text-align: right;">
                  <div style="color: var(--text-primary); font-weight: 600;">${climber.total_points}</div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : `
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No data yet
        </p>
      `}
    </div>
  `
}

/**
 * Get category color
 */
function getCategoryColor(category) {
  const colors = {
    masters: '#6f42c1',
    advanced: '#dc3545',
    intermediate: '#fd7e14',
    recreational: '#28a745'
  }
  return colors[category] || '#6c757d'
}

/**
 * Setup event listeners
 */
function setupLeaderboardListeners() {
  // Back button
  document.getElementById('back-to-admin')?.addEventListener('click', () => {
    window.location.hash = '#/admin/dashboard'
  })

  // Refresh button
  document.getElementById('refresh-btn')?.addEventListener('click', async () => {
    await renderLeaderboards()
  })

  // Tab switching
  document.querySelectorAll('.leaderboard-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab')

      // Update active tab
      document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')

      // Show corresponding content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none'
        content.classList.remove('active')
      })

      const targetContent = document.getElementById(`tab-${tabName}`)
      if (targetContent) {
        targetContent.style.display = 'block'
        targetContent.classList.add('active')
      }
    })
  })
}

export default {
  renderLeaderboards
}

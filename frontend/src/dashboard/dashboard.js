/**
 * Team Dashboard
 *
 * Shows team information, climbers, and current scores.
 * Phase 3 - Basic dashboard after successful login
 */

import { authManager } from '../auth/auth-manager.js'
import { supabase } from '../lib/supabase.js'
import { showError, showLoading, hideLoading } from '../shared/ui-helpers.js'
import { renderScoring } from './scoring.js'
import { renderNudgeBanner, setupNudgeBannerListeners } from '../shared/nudge-banner.js'

/**
 * Render team dashboard
 */
export async function renderDashboard() {
  const app = document.querySelector('#app')

  // Show loading while fetching data
  app.innerHTML = `
    <div class="min-h-screen" >
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness</h1>
            </div>
            <button class="btn btn-secondary" id="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main class="container" style="padding-top: 32px;">
        <div style="text-align: center; padding: 40px;">
          <p style="color: var(--text-secondary);">Loading your team data...</p>
        </div>
      </main>
    </div>
  `

  // Fetch team data
  try {
    const teamData = await fetchTeamData()

    if (!teamData) {
      renderError('Failed to load team data')
      return
    }

    await renderDashboardContent(teamData)
  } catch (error) {
    console.error('Dashboard error:', error)
    renderError('An error occurred while loading the dashboard')
  }

  // Setup sign out handler
  document.getElementById('sign-out-btn')?.addEventListener('click', async () => {
    await authManager.signOut()
  })
}

/**
 * Fetch team data from Supabase
 */
async function fetchTeamData() {
  const user = authManager.getUser()
  if (!user) return null

  try {
    // Fetch team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (teamError) throw teamError

    // Fetch climbers
    const { data: climbers, error: climbersError } = await supabase
      .from('climbers')
      .select('*')
      .eq('team_id', team.id)

    if (climbersError) throw climbersError

    // Fetch team score
    const { data: teamScore, error: scoreError } = await supabase
      .from('team_scores')
      .select('*')
      .eq('team_id', team.id)
      .single()

    // Score might not exist yet (no ascents logged)
    const score = scoreError ? null : teamScore

    // Fetch climber scores
    const { data: climberScores, error: climberScoresError } = await supabase
      .from('climber_scores')
      .select('*')
      .in('climber_id', climbers.map(c => c.id))

    const scores = climberScoresError ? [] : climberScores

    // Fetch bonus entries for all team climbers
    const { data: bonusEntries, error: bonusError } = await supabase
      .from('bonus_entries')
      .select(`
        climber_id,
        points_awarded,
        bonus_games (
          name
        )
      `)
      .in('climber_id', climbers.map(c => c.id))

    const bonuses = bonusError ? [] : bonusEntries

    return {
      team,
      climbers,
      teamScore: score,
      climberScores: scores,
      bonusEntries: bonuses,
    }
  } catch (error) {
    console.error('Failed to fetch team data:', error)
    showError('Failed to load team data: ' + error.message)
    return null
  }
}

/**
 * Render dashboard with team data
 */
async function renderDashboardContent(data) {
  const { team, climbers, teamScore, climberScores, bonusEntries } = data
  const app = document.querySelector('#app')

  const totalPoints = teamScore?.total_points || 0
  const totalAscents = teamScore?.total_ascents || 0

  // Fetch nudge banner HTML
  const nudgeBannerHTML = await renderNudgeBanner(team)

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness</h1>
            </div>
            <button class="btn btn-secondary" id="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main class="container" style="padding-top: 32px; padding-bottom: 32px;">
        <!-- Nudge Banner -->
        ${nudgeBannerHTML}

        <!-- Team Info Card -->
        <div class="card" style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 4px;">
                ${team.team_name}
              </h2>
              <p style="color: var(--text-secondary); font-size: 14px;">
                Team ID: ${team.team_id} • Category: ${capitalizeFirst(team.category)}
              </p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 32px; font-weight: 700; color: #ff0046;">
                ${totalPoints}
              </div>
              <div style="font-size: 14px; color: var(--text-secondary);">
                Total Points
              </div>
            </div>
          </div>

          <div style="padding-top: 16px; border-top: 1px solid var(--border-secondary);">
            <div style="display: flex; gap: 32px;">
              <div>
                <div style="font-size: 20px; font-weight: 600; color: var(--text-primary);">${totalAscents}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Total Ascents</div>
              </div>
              <div>
                <div style="font-size: 20px; font-weight: 600; color: var(--text-primary);">${climbers.length}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Team Members</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Climbers Section -->
        <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
          Team Members
        </h3>

        ${climbers.map(climber => {
          const climberScore = climberScores.find(s => s.climber_id === climber.id)
          const points = climberScore?.total_points || 0
          const ascents = climberScore?.route_ascents || 0

          // Get bonus entries for this climber
          const climberBonuses = bonusEntries.filter(b => b.climber_id === climber.id)
          const totalBonusPoints = climberBonuses.reduce((sum, b) => sum + b.points_awarded, 0)

          return `
            <div class="card" style="margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                  <h4 style="color: var(--text-primary); font-size: 16px; font-weight: 600; margin-bottom: 4px;">
                    ${climber.name}
                  </h4>
                  <p style="color: var(--text-secondary); font-size: 14px;">
                    Age: ${climber.age} • Grade: ${climber.redpoint_grade} • Category: ${capitalizeFirst(climber.category)}
                  </p>

                  ${climberBonuses.length > 0 ? `
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-secondary);">
                      <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; font-weight: 500;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        Bonus Points:
                      </div>
                      ${climberBonuses.map(bonus => `
                        <div style="font-size: 12px; color: var(--text-secondary); margin-left: 20px; margin-bottom: 2px;">
                          • ${bonus.bonus_games.name}: <span style="color: var(--color-primary); font-weight: 600;">+${bonus.points_awarded}</span>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
                <div style="text-align: right; margin-left: 16px;">
                  <div style="font-size: 24px; font-weight: 600; color: #ff0046;">
                    ${points}
                  </div>
                  <div style="font-size: 12px; color: var(--text-secondary);">
                    ${ascents} ascent${ascents !== 1 ? 's' : ''}
                  </div>
                  ${totalBonusPoints > 0 ? `
                    <div style="font-size: 11px; color: var(--color-primary); margin-top: 4px;">
                      +${totalBonusPoints} bonus
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          `
        }).join('')}

        <!-- Action Buttons -->
        <div style="margin-top: 32px;">
          <button id="goto-scoring" class="btn btn-primary" style="width: 100%;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
              <line x1="12" y1="20" x2="12" y2="10"/>
              <line x1="18" y1="20" x2="18" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="16"/>
            </svg>
            Start Scoring
          </button>
        </div>
      </main>
    </div>
  `

  // Re-attach sign out handler
  document.getElementById('sign-out-btn')?.addEventListener('click', async () => {
    await authManager.signOut()
  })

  // Setup nudge banner listeners
  setupNudgeBannerListeners()

  // Setup scoring button
  document.getElementById('goto-scoring')?.addEventListener('click', async () => {
    await renderScoring(data.team, data.climbers, data.climberScores)
  })
}

/**
 * Render error state
 */
function renderError(message) {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness</h1>
            </div>
            <button class="btn btn-secondary" id="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main class="container" style="padding-top: 32px;">
        <div class="card max-w-2xl mx-auto text-center">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 16px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Error
          </h2>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">
            ${message}
          </p>
          <button class="btn btn-primary" onclick="window.location.reload()">
            Reload Page
          </button>
        </div>
      </main>
    </div>
  `

  document.getElementById('sign-out-btn')?.addEventListener('click', async () => {
    await authManager.signOut()
  })
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default renderDashboard

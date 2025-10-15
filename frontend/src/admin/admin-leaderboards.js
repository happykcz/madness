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
import { renderAdminHeader, setupAdminHeader } from './admin-header.js'

/**
 * Render admin leaderboards page
 */
export async function renderLeaderboards() {
  const app = document.querySelector('#app')

  // Show loading
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderAdminHeader({ title: 'Leaderboards', currentPage: 'leaderboards' })}
      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <p style="color: var(--text-secondary); text-align: center;">Loading leaderboards...</p>
      </main>
    </div>
  `

  try {
    // Fetch all data
    const [teamScores, climberScores, hardestSends, mostTicks, bonusGames] = await Promise.all([
      fetchTeamScores(),
      fetchClimberScores(),
      fetchHardestSends(),
      fetchMostTicks(),
      fetchBonusGamesLeaderboard()
    ])

    renderLeaderboardsContent(teamScores, climberScores, hardestSends, mostTicks, bonusGames)
  } catch (error) {
    console.error('Error loading leaderboards:', error)
    showError('Failed to load leaderboards')
  }
}

/**
 * Fetch team scores grouped by category
 * Also fetch climber names for each team
 */
async function fetchTeamScores() {
  // Fetch team scores
  const { data: teamData, error: teamError } = await supabase
    .from('team_scores')
    .select('*')
    .order('total_points', { ascending: false })

  if (teamError) throw teamError

  // Fetch all climbers to get names
  const { data: climbersData, error: climbersError } = await supabase
    .from('climbers')
    .select('id, team_id, name')

  if (climbersError) throw climbersError

  // Add climber names to each team
  const teamsWithClimbers = teamData.map(team => {
    const teamClimbers = climbersData.filter(c => c.team_id === team.team_id)
    return {
      ...team,
      climber_names: teamClimbers.map(c => c.name).join(', ')
    }
  })

  // Group by category
  return {
    masters: teamsWithClimbers.filter(t => t.category === 'masters'),
    recreational: teamsWithClimbers.filter(t => t.category === 'recreational'),
    intermediate: teamsWithClimbers.filter(t => t.category === 'intermediate'),
    advanced: teamsWithClimbers.filter(t => t.category === 'advanced')
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
 * Tiebreaker: more route_ascents on that hardest grade wins
 */
async function fetchHardestSends() {
  const { data, error } = await supabase
    .from('climber_scores')
    .select('*')
    .order('hardest_send', { ascending: false })
    .order('route_ascents', { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}

/**
 * Fetch most ticks (climbers by total ascents)
 * Tiebreaker: lower category wins (recreational < intermediate < advanced)
 */
async function fetchMostTicks() {
  const { data, error } = await supabase
    .from('climber_scores')
    .select('*')
    .order('route_ascents', { ascending: false })
    .limit(20)

  if (error) throw error

  // Apply tiebreaker: lower category wins
  // Category order: recreational (1) < intermediate (2) < advanced (3)
  const categoryOrder = { recreational: 1, intermediate: 2, advanced: 3 }
  return data.sort((a, b) => {
    if (a.route_ascents !== b.route_ascents) {
      return b.route_ascents - a.route_ascents
    }
    // Tie: lower category wins
    return categoryOrder[a.category] - categoryOrder[b.category]
  })
}

/**
 * Fetch bonus games leaderboard
 * Shows top 5 climbers for each active bonus game
 */
async function fetchBonusGamesLeaderboard() {
  // Fetch all active bonus games
  const { data: games, error: gamesError } = await supabase
    .from('bonus_games')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (gamesError) throw gamesError

  if (!games || games.length === 0) {
    return []
  }

  // Fetch bonus entries with climber info for each game
  const gamesWithLeaders = await Promise.all(
    games.map(async (game) => {
      const { data: entries, error: entriesError } = await supabase
        .from('bonus_entries')
        .select(`
          points_awarded,
          climbers (
            id,
            name,
            category,
            team_id,
            teams (
              team_name
            )
          )
        `)
        .eq('bonus_game_id', game.id)
        .order('points_awarded', { ascending: false })
        .limit(5)

      if (entriesError) {
        console.error('Error fetching entries for game:', game.name, entriesError)
        return {
          ...game,
          topClimbers: []
        }
      }

      return {
        ...game,
        topClimbers: entries || []
      }
    })
  )

  return gamesWithLeaders
}

/**
 * Render leaderboards content
 */
function renderLeaderboardsContent(teamScores, climberScores, hardestSends, mostTicks, bonusGames) {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderAdminHeader({ title: 'Leaderboards', currentPage: 'leaderboards' })}

      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <!-- Page Header with Refresh -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin: 0;">
            Competition Leaderboards
          </h2>
          <button id="refresh-btn" class="btn btn-secondary" style="display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            Refresh
          </button>
        </div>

        <!-- Mobile-Friendly Tab Navigation (Dropdown) -->
        <div style="margin-bottom: 24px;">
          <label style="display: block; color: var(--text-secondary); font-size: 13px; margin-bottom: 6px;">
            Select Leaderboard
          </label>
          <select id="leaderboard-selector" class="form-input" style="width: 100%; font-size: 16px; padding: 12px;">
            <option value="teams">Team Categories</option>
            <option value="climbers">Climber Categories</option>
            <option value="hardest">Hardest Sends</option>
            <option value="ticks">Most Ticks</option>
            <option value="bonus">Bonus Games</option>
          </select>
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

        <div id="tab-ticks" class="tab-content" style="display: none;">
          ${renderMostTicks(mostTicks)}
        </div>

        <div id="tab-bonus" class="tab-content" style="display: none;">
          ${renderBonusGamesLeaderboard(bonusGames)}
        </div>
      </main>
    </div>

    <style>
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
                  <div style="font-size: 12px; color: var(--text-secondary);">${team.climber_names || 'No climbers'}</div>
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
 * Render most ticks leaderboard
 */
function renderMostTicks(mostTicks) {
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
        Top 20 Most Ticks (Total Sends)
      </h3>
      <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
        In case of tie, lower category wins (Recreational > Intermediate > Advanced)
      </p>
      ${mostTicks.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-secondary);">
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">RANK</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">CLIMBER</th>
              <th style="text-align: left; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">CATEGORY</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">TOTAL TICKS</th>
              <th style="text-align: right; padding: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 600;">TOTAL POINTS</th>
            </tr>
          </thead>
          <tbody>
            ${mostTicks.map((climber, index) => `
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
                  <div style="font-size: 24px; font-weight: 700; color: var(--color-primary);">${climber.route_ascents || 0}</div>
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
 * Render bonus games leaderboard
 * Shows top 5 climbers for each game
 */
function renderBonusGamesLeaderboard(bonusGames) {
  if (!bonusGames || bonusGames.length === 0) {
    return `
      <div class="card">
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No active bonus games yet
        </p>
      </div>
    `
  }

  return bonusGames.map(game => `
    <div class="card" style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin: 0;">
          ${game.name}
        </h3>
      </div>

      ${game.topClimbers && game.topClimbers.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-secondary);">
              <th style="padding: 8px; text-align: left; color: var(--text-secondary); font-size: 12px; font-weight: 500; width: 40px;">Rank</th>
              <th style="padding: 8px; text-align: left; color: var(--text-secondary); font-size: 12px; font-weight: 500;">Climber</th>
              <th style="padding: 8px; text-align: left; color: var(--text-secondary); font-size: 12px; font-weight: 500;">Team</th>
              <th style="padding: 8px; text-align: right; color: var(--text-secondary); font-size: 12px; font-weight: 500; width: 80px;">Points</th>
            </tr>
          </thead>
          <tbody>
            ${game.topClimbers.map((entry, index) => {
              const climber = entry.climbers
              const team = climber?.teams

              return `
                <tr style="border-bottom: 1px solid var(--border-tertiary);">
                  <td style="padding: 12px 8px;">
                    <div style="
                      width: 28px;
                      height: 28px;
                      border-radius: 50%;
                      background: ${index === 0 ? '#fbbf24' : index === 1 ? '#d1d5db' : index === 2 ? '#f59e0b' : 'var(--bg-tertiary)'};
                      color: ${index < 3 ? '#000' : 'var(--text-secondary)'};
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
                    <div style="color: var(--text-primary); font-weight: 500;">
                      ${climber?.name || 'Unknown'}
                    </div>
                    <div style="color: var(--text-secondary); font-size: 12px;">
                      ${climber?.category ? capitalizeFirst(climber.category) : ''}
                    </div>
                  </td>
                  <td style="padding: 12px 8px; color: var(--text-secondary); font-size: 14px;">
                    ${team?.team_name || 'N/A'}
                  </td>
                  <td style="padding: 12px 8px; text-align: right;">
                    <div style="color: var(--color-primary); font-weight: 600; font-size: 16px;">
                      ${entry.points_awarded}
                    </div>
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      ` : `
        <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
          No entries yet for this game
        </p>
      `}
    </div>
  `).join('')
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
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
  // Setup header (includes navigation and sign out)
  setupAdminHeader()

  // Refresh button
  document.getElementById('refresh-btn')?.addEventListener('click', async () => {
    await renderLeaderboards()
  })

  // Dropdown selector for tab switching (mobile-friendly)
  const selector = document.getElementById('leaderboard-selector')
  selector?.addEventListener('change', (e) => {
    const tabName = e.target.value

    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none'
      content.classList.remove('active')
    })

    // Show selected tab content
    const targetContent = document.getElementById(`tab-${tabName}`)
    if (targetContent) {
      targetContent.style.display = 'block'
      targetContent.classList.add('active')
    }
  })
}

export default {
  renderLeaderboards
}

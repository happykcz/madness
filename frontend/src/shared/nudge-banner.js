/**
 * Nudge Banner Component
 *
 * Displays leaderboard nudges/announcements to teams
 * Shows on both team dashboard and scoring page
 * Includes mini-leaderboard (top 3 + team position) when enabled
 */

import { supabase } from '../lib/supabase.js'
import { showError } from './ui-helpers.js'

/**
 * Fetch active nudges for current team
 */
export async function fetchActiveNudges(teamId) {
  try {
    const { data, error } = await supabase
      .from('active_team_nudges')
      .select('*')
      .eq('team_id', teamId)
      .order('sent_at', { ascending: false })
      .limit(1) // Only show most recent nudge

    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error('Error fetching nudges:', error)
    return null
  }
}

/**
 * Fetch mini leaderboard data (top 3 + team position)
 */
async function fetchMiniLeaderboard(teamId, teamCategory) {
  try {
    // Fetch all teams in same category, ordered by points
    const { data: allTeams, error } = await supabase
      .from('team_scores')
      .select('team_id, team_name, total_points, category')
      .eq('category', teamCategory)
      .order('total_points', { ascending: false })

    if (error) throw error

    // Find top 3
    const top3 = allTeams.slice(0, 3)

    // Find current team's position
    const teamIndex = allTeams.findIndex(t => t.team_id === teamId)
    const teamPosition = teamIndex !== -1 ? teamIndex + 1 : null
    const teamData = allTeams[teamIndex]

    return {
      top3,
      teamPosition,
      teamData,
      totalTeams: allTeams.length
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return null
  }
}

/**
 * Dismiss a nudge for current team
 */
async function dismissNudge(nudgeId, teamId) {
  try {
    const { error } = await supabase
      .from('nudge_dismissals')
      .insert({
        nudge_id: nudgeId,
        team_id: teamId
      })

    if (error) throw error
    return true
  } catch (error) {
    // Unique constraint violation means already dismissed
    if (error.code === '23505') {
      return true
    }
    console.error('Error dismissing nudge:', error)
    showError('Failed to dismiss nudge')
    return false
  }
}

/**
 * Render nudge banner
 * @param {Object} team - Team object with id, team_name, category
 * @returns {Promise<string>} HTML string for banner
 */
export async function renderNudgeBanner(team) {
  if (!team || !team.id) {
    return ''
  }

  // Fetch active nudge
  const nudge = await fetchActiveNudges(team.id)

  if (!nudge) {
    return '' // No active nudges
  }

  let leaderboardHTML = ''

  // If nudge includes leaderboard, fetch and render it
  if (nudge.show_leaderboard) {
    const leaderboard = await fetchMiniLeaderboard(team.id, team.category)

    if (leaderboard) {
      leaderboardHTML = renderMiniLeaderboard(leaderboard, team)
    }
  }

  const nudgeTypeColor = nudge.nudge_type === 'auto'
    ? 'rgba(102, 126, 234, 0.1)'
    : 'rgba(251, 191, 36, 0.1)'

  const nudgeTypeBorder = nudge.nudge_type === 'auto'
    ? '#667eea'
    : '#fbbf24'

  return `
    <div
      id="nudge-banner-${nudge.id}"
      class="nudge-banner"
      style="
        background: ${nudgeTypeColor};
        border: 2px solid ${nudgeTypeBorder};
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        position: relative;
      "
    >
      <!-- Close Button -->
      <button
        class="nudge-dismiss-btn"
        data-nudge-id="${nudge.id}"
        data-team-id="${team.id}"
        style="
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.1);
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.2s;
        "
        onmouseover="this.style.background='rgba(0, 0, 0, 0.2)'"
        onmouseout="this.style.background='rgba(0, 0, 0, 0.1)'"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <!-- Nudge Icon & Message -->
      <div style="display: flex; align-items: start; gap: 12px; margin-bottom: ${leaderboardHTML ? '16px' : '0'};">
        <div style="flex-shrink: 0; margin-top: 2px;">
          ${nudge.nudge_type === 'auto' ? `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${nudgeTypeBorder}" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          ` : `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${nudgeTypeBorder}" stroke="${nudgeTypeBorder}" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          `}
        </div>
        <div style="flex: 1; padding-right: 24px;">
          <div style="color: var(--text-primary); font-size: 15px; font-weight: 500; line-height: 1.5;">
            ${nudge.message}
          </div>
          <div style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
            ${new Date(nudge.sent_at).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      <!-- Mini Leaderboard (if enabled) -->
      ${leaderboardHTML}
    </div>
  `
}

/**
 * Render mini leaderboard display
 */
function renderMiniLeaderboard(leaderboard, team) {
  const { top3, teamPosition, teamData, totalTeams } = leaderboard

  const isInTop3 = teamPosition && teamPosition <= 3

  return `
    <div style="
      background: rgba(255, 255, 255, 0.5);
      border-radius: 6px;
      padding: 12px;
      margin-top: 12px;
    ">
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        color: var(--text-primary);
        font-weight: 600;
        font-size: 13px;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 20V10M12 20V4M6 20v-6"/>
        </svg>
        Current Standings - ${capitalizeFirst(team.category)}
      </div>

      <!-- Top 3 Teams -->
      ${top3.map((t, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
        const isCurrentTeam = t.team_id === team.id

        return `
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px;
            border-radius: 4px;
            margin-bottom: 4px;
            background: ${isCurrentTeam ? '#fff' : 'transparent'};
            border: ${isCurrentTeam ? '1px solid #667eea' : '1px solid transparent'};
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px;">${medal}</span>
              <div>
                <div style="
                  color: var(--text-primary);
                  font-size: 14px;
                  font-weight: ${isCurrentTeam ? '600' : '500'};
                ">
                  ${t.team_name}${isCurrentTeam ? ' (You)' : ''}
                </div>
              </div>
            </div>
            <div style="
              color: var(--color-primary);
              font-weight: 600;
              font-size: 16px;
            ">
              ${t.total_points}
            </div>
          </div>
        `
      }).join('')}

      <!-- Current Team Position (if not in top 3) -->
      ${!isInTop3 && teamPosition ? `
        <div style="
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        ">
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px;
            border-radius: 4px;
            background: rgba(102, 126, 234, 0.15);
            border: 1px solid #667eea;
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: var(--color-primary);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
              ">
                ${teamPosition}
              </div>
              <div>
                <div style="color: var(--text-primary); font-size: 14px; font-weight: 600;">
                  ${teamData.team_name} (You)
                </div>
                <div style="color: var(--text-secondary); font-size: 11px;">
                  ${teamPosition} of ${totalTeams} teams
                </div>
              </div>
            </div>
            <div style="color: var(--color-primary); font-weight: 600; font-size: 16px;">
              ${teamData.total_points}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `
}

/**
 * Setup nudge banner listeners
 * Call this after rendering the banner
 */
export function setupNudgeBannerListeners() {
  document.querySelectorAll('.nudge-dismiss-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const nudgeId = e.currentTarget.getAttribute('data-nudge-id')
      const teamId = e.currentTarget.getAttribute('data-team-id')

      const success = await dismissNudge(nudgeId, teamId)

      if (success) {
        // Fade out and remove banner
        const banner = document.getElementById(`nudge-banner-${nudgeId}`)
        if (banner) {
          banner.style.transition = 'opacity 0.3s, transform 0.3s'
          banner.style.opacity = '0'
          banner.style.transform = 'translateY(-10px)'

          setTimeout(() => {
            banner.remove()
          }, 300)
        }
      }
    })
  })
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

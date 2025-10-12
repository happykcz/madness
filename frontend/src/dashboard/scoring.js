/**
 * Team Scoring Interface
 *
 * Sprint 3: Route list, filters, attempt submission, and score display
 */

import { supabase } from '../lib/supabase.js'
import { showSuccess, showError, showLoading, hideLoading } from '../shared/ui-helpers.js'
import { calculateTickPoints, getTickMultiplier } from '../shared/scoring-engine.js'
import { router } from '../lib/router.js'

let currentFilters = {
  type: 'all', // 'all', 'sport', 'trad', 'boulder'
  gradeband: 'all', // 'all', 'recreational', 'intermediate', 'advanced'
  hideZeroPoint: false
}

let routes = []
let teamData = null
let selectedClimber = null
let climberAttempts = [] // All attempts for selected climber

/**
 * Render scoring interface
 */
export async function renderScoring(team, climbers, climberScores) {
  teamData = { team, climbers, climberScores }

  // Reset state on page load
  selectedClimber = null
  climberAttempts = []

  // Fetch routes
  await fetchRoutes()

  // Calculate team total
  const teamTotalPoints = climberScores.reduce((sum, score) => sum + (score?.total_points || 0), 0)
  const teamTotalAscents = climberScores.reduce((sum, score) => sum + (score?.route_ascents || 0), 0)

  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen">
      <!-- Header -->
      <header class="header" style="padding: 12px 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" style="height: 32px;" />
            <div style="flex: 1;">
              <h1 style="color: white; font-size: 16px; font-weight: 600; margin: 0;">
                ${team.team_name}
              </h1>
              <div style="color: rgba(255,255,255,0.8); font-size: 12px;">
                Team Total: <span style="color: var(--color-primary); font-weight: 600;">${teamTotalPoints} pts</span> • ${teamTotalAscents} sends
              </div>
            </div>
          </div>
          <button id="back-to-dashboard" class="btn btn-secondary" style="font-size: 13px; padding: 6px 12px; white-space: nowrap;">
            ← Dashboard
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container" style="padding-top: 16px; padding-bottom: 32px;">
        <!-- Climber Selection -->
        <div class="card" style="margin-bottom: 16px; padding: 12px;">
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
            Select Climber
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${climbers.map((climber, index) => {
              const score = climberScores?.find(s => s.climber_id === climber.id)
              const points = score?.total_points || 0
              const ascents = score?.route_ascents || 0

              return `
                <button
                  class="climber-select-btn"
                  data-climber-id="${climber.id}"
                  data-climber-index="${index}"
                  style="
                    padding: 12px;
                    background-color: var(--bg-secondary);
                    border: 2px solid var(--border-primary);
                    border-radius: 6px;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s;
                  "
                >
                  <div style="font-weight: 600; font-size: 14px; color: var(--text-primary);">
                    ${climber.name}
                  </div>
                  <div class="climber-score-display" style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
                    ${points} pts • ${ascents} ascents
                  </div>
                </button>
              `
            }).join('')}
          </div>
        </div>

        <!-- Filters -->
        <div class="card" style="margin-bottom: 16px; padding: 12px;">
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">
            Filters
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <!-- Type Filter -->
            <select id="filter-type" style="
              padding: 6px 10px;
              border: 1px solid var(--border-primary);
              border-radius: 6px;
              font-size: 13px;
              background-color: var(--bg-white);
            ">
              <option value="all">All Types</option>
              <option value="sport">Sport</option>
              <option value="trad">Trad</option>
              <option value="boulder">Boulder</option>
            </select>

            <!-- Grade Band Filter -->
            <select id="filter-gradeband" style="
              padding: 6px 10px;
              border: 1px solid var(--border-primary);
              border-radius: 6px;
              font-size: 13px;
              background-color: var(--bg-white);
            ">
              <option value="all">All Grades</option>
              <option value="recreational">Recreational (≤19)</option>
              <option value="intermediate">Intermediate (20-23)</option>
              <option value="advanced">Advanced (24+)</option>
            </select>

            <!-- Hide Zero Points -->
            <label style="
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 6px 10px;
              background-color: var(--bg-secondary);
              border-radius: 6px;
              font-size: 13px;
              cursor: pointer;
            ">
              <input type="checkbox" id="filter-hide-zero" />
              Hide 0 pts routes
            </label>
          </div>
        </div>

        <!-- Routes List -->
        <div id="routes-container">
          ${renderRoutesPlaceholder()}
        </div>
      </main>
    </div>
  `

  setupScoringListeners()
}

/**
 * Fetch routes from database
 */
async function fetchRoutes() {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('sector_order', { ascending: true })
      .order('route_order', { ascending: true })

    if (error) throw error

    routes = data || []
  } catch (error) {
    console.error('Error fetching routes:', error)
    showError('Failed to load routes')
    routes = []
  }
}

/**
 * Fetch fresh team data (scores)
 */
async function fetchFreshTeamData() {
  try {
    // Fetch updated climber scores
    const { data: climberScores, error } = await supabase
      .from('climber_scores')
      .select('*')
      .in('climber_id', teamData.climbers.map(c => c.id))

    if (error) throw error

    teamData.climberScores = climberScores || []

    // Refetch attempts for selected climber if one is selected
    if (selectedClimber) {
      await fetchClimberAttempts(selectedClimber.id)
    }

    // Update climber score displays
    updateClimberScoreDisplays()
  } catch (error) {
    console.error('Error fetching fresh team data:', error)
  }
}

/**
 * Update climber score displays
 */
function updateClimberScoreDisplays() {
  document.querySelectorAll('.climber-select-btn').forEach(btn => {
    const climberId = btn.getAttribute('data-climber-id')
    const score = teamData.climberScores?.find(s => s.climber_id === climberId)
    const points = score?.total_points || 0
    const ascents = score?.route_ascents || 0

    const scoreDiv = btn.querySelector('.climber-score-display')
    if (scoreDiv) {
      scoreDiv.textContent = `${points} pts • ${ascents} ascents`
    }
  })
}

/**
 * Render routes placeholder (when no routes exist)
 */
function renderRoutesPlaceholder() {
  if (routes.length === 0) {
    return `
      <div class="card" style="padding: 32px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 16px;">🧗</div>
        <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 8px;">
          No Routes Yet
        </h3>
        <p style="color: var(--text-secondary); font-size: 14px;">
          Routes will be imported before the competition starts.
        </p>
      </div>
    `
  }

  return renderRoutesList()
}

/**
 * Render routes list grouped by sector
 */
function renderRoutesList() {
  const filteredRoutes = filterRoutes(routes)

  if (filteredRoutes.length === 0) {
    return `
      <div class="card" style="padding: 24px; text-align: center;">
        <p style="color: var(--text-secondary);">No routes match current filters</p>
      </div>
    `
  }

  // Group routes by sector
  const sectors = {}
  filteredRoutes.forEach(route => {
    const sector = route.sector || 'Main Area'
    if (!sectors[sector]) {
      sectors[sector] = []
    }
    sectors[sector].push(route)
  })

  let html = ''
  Object.entries(sectors).forEach(([sectorName, sectorRoutes]) => {
    html += `
      <div class="card" style="margin-bottom: 16px; padding: 0; overflow: hidden;">
        <div style="background-color: var(--bg-secondary); padding: 12px 16px; border-bottom: 1px solid var(--border-secondary);">
          <h3 style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0;">
            ${sectorName}
          </h3>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
            ${sectorRoutes.length} routes
          </div>
        </div>
        <div style="padding: 8px;">
          ${sectorRoutes.map(route => renderRouteCard(route)).join('')}
        </div>
      </div>
    `
  })

  return html
}

/**
 * Generate 4-wedge progress indicator SVG
 */
function generateProgressIndicator(sendCount) {
  const maxSends = 4
  const filled = Math.min(sendCount, maxSends)
  const fillColor = '#28a745'
  const emptyColor = '#e1e4e8'

  // Create 4 wedges (90 degrees each)
  const wedges = []
  for (let i = 0; i < maxSends; i++) {
    const startAngle = (i * 90) - 90 // Start from top
    const endAngle = startAngle + 90
    const isFilled = i < filled
    const color = isFilled ? fillColor : emptyColor

    // Calculate arc path
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    const x1 = 50 + 45 * Math.cos(startRad)
    const y1 = 50 + 45 * Math.sin(startRad)
    const x2 = 50 + 45 * Math.cos(endRad)
    const y2 = 50 + 45 * Math.sin(endRad)

    wedges.push(`
      <path d="M 50 50 L ${x1} ${y1} A 45 45 0 0 1 ${x2} ${y2} Z"
            fill="${color}"
            stroke="white"
            stroke-width="2"/>
    `)
  }

  return `
    <svg width="40" height="40" viewBox="0 0 100 100" style="transform: rotate(0deg);">
      ${wedges.join('')}
      <circle cx="50" cy="50" r="20" fill="white"/>
      <text x="50" y="50" text-anchor="middle" dominant-baseline="middle"
            font-size="24" font-weight="600" fill="#333">
        ${sendCount}
      </text>
    </svg>
  `
}

/**
 * Render individual route card
 */
function renderRouteCard(route) {
  const isZeroPoint = route.base_points === 0
  const typeColor = route.gear_type === 'trad' ? '#ff0046' : route.gear_type === 'boulder' ? '#6f42c1' : '#0366d6'

  // Get sends for this route by current climber (all ascents are successful)
  const routeSends = climberAttempts.filter(a => a.route_id === route.id)
  const totalSends = routeSends.length
  const totalPoints = routeSends.reduce((sum, a) => sum + (a.points_earned || 0), 0)

  return `
    <div
      class="route-card"
      data-route-id="${route.id}"
      style="
        padding: 12px;
        margin: 8px 0;
        background-color: ${isZeroPoint ? '#f6f8fa' : 'var(--bg-white)'};
        border: 1px solid var(--border-secondary);
        border-radius: 6px;
        cursor: ${selectedClimber ? 'pointer' : 'not-allowed'};
        opacity: ${selectedClimber ? '1' : '0.6'};
        transition: all 0.2s;
      "
    >
      <div style="display: flex; justify-content: space-between; align-items: start; gap: 12px;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <div style="font-weight: 600; font-size: 14px; color: var(--text-primary);">
              ${route.name}
            </div>
            ${totalSends > 0 ? `
              <div style="
                font-size: 11px;
                padding: 2px 6px;
                background-color: #6c757d;
                color: white;
                border-radius: 10px;
              ">
                ${totalSends} ${totalSends === 1 ? 'send' : 'sends'} • ${totalPoints}pts
              </div>
            ` : ''}
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <span style="
              font-size: 12px;
              padding: 2px 6px;
              background-color: ${typeColor};
              color: white;
              border-radius: 3px;
            ">
              ${route.gear_type.toUpperCase()}
            </span>
            <span style="font-size: 13px; color: var(--text-secondary);">
              Grade ${route.grade}
            </span>
            ${isZeroPoint ? `
              <span style="font-size: 12px; color: var(--text-secondary); font-style: italic;">
                0 pts (navigation)
              </span>
            ` : `
              <span style="font-size: 13px; color: var(--color-primary); font-weight: 600;">
                ${route.base_points} pts${route.gear_type === 'trad' ? ' +50%' : ''}
              </span>
            `}
          </div>
        </div>
        ${!isZeroPoint ? `
          <div style="flex-shrink: 0; display: flex; align-items: center;">
            ${generateProgressIndicator(totalSends)}
          </div>
        ` : ''}
      </div>
    </div>
  `
}

/**
 * Filter routes based on current filters
 */
function filterRoutes(allRoutes) {
  return allRoutes.filter(route => {
    // Type filter
    if (currentFilters.type !== 'all' && route.gear_type !== currentFilters.type) {
      return false
    }

    // Grade band filter
    if (currentFilters.gradeband !== 'all') {
      const grade = route.grade
      if (currentFilters.gradeband === 'recreational' && grade > 19) return false
      if (currentFilters.gradeband === 'intermediate' && (grade < 20 || grade > 23)) return false
      if (currentFilters.gradeband === 'advanced' && grade < 24) return false
    }

    // Hide zero points filter
    if (currentFilters.hideZeroPoint && route.base_points === 0) {
      return false
    }

    return true
  })
}

/**
 * Setup event listeners
 */
function setupScoringListeners() {
  // Back to dashboard
  const backBtn = document.getElementById('back-to-dashboard')
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault()
      router.navigate('/dashboard')
    })
  }

  // Climber selection
  document.querySelectorAll('.climber-select-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const climberId = btn.getAttribute('data-climber-id')
      const climberIndex = parseInt(btn.getAttribute('data-climber-index'))
      await selectClimber(climberId, climberIndex)
    })
  })

  // Filter listeners
  document.getElementById('filter-type')?.addEventListener('change', (e) => {
    currentFilters.type = e.target.value
    updateRoutesList()
  })

  document.getElementById('filter-gradeband')?.addEventListener('change', (e) => {
    currentFilters.gradeband = e.target.value
    updateRoutesList()
  })

  document.getElementById('filter-hide-zero')?.addEventListener('change', (e) => {
    currentFilters.hideZeroPoint = e.target.checked
    updateRoutesList()
  })

  // Route card clicks
  document.querySelectorAll('.route-card').forEach(card => {
    card.addEventListener('click', () => {
      if (!selectedClimber) {
        showError('Please select a climber first')
        return
      }
      const routeId = card.getAttribute('data-route-id')
      const route = routes.find(r => r.id === routeId)
      if (route) {
        showAttemptModal(route)
      }
    })
  })
}

/**
 * Fetch climber attempts
 */
async function fetchClimberAttempts(climberId) {
  try {
    const { data, error } = await supabase
      .from('ascents')
      .select('*')
      .eq('climber_id', climberId)
      .order('logged_at', { ascending: true })

    if (error) throw error

    climberAttempts = data || []
  } catch (error) {
    console.error('Error fetching climber attempts:', error)
    climberAttempts = []
  }
}

/**
 * Select climber for scoring
 */
async function selectClimber(climberId, climberIndex) {
  selectedClimber = {
    id: climberId,
    data: teamData.climbers[climberIndex]
  }

  // Update UI to show selected climber
  document.querySelectorAll('.climber-select-btn').forEach(btn => {
    if (btn.getAttribute('data-climber-id') === climberId) {
      btn.style.borderColor = 'var(--color-primary)'
      btn.style.backgroundColor = '#fff5f7'
    } else {
      btn.style.borderColor = 'var(--border-primary)'
      btn.style.backgroundColor = 'var(--bg-secondary)'
    }
  })

  // Fetch attempts for this climber
  await fetchClimberAttempts(climberId)

  updateRoutesList()
  showSuccess(`Selected ${selectedClimber.data.name}`)
}

/**
 * Update routes list after filter change
 */
function updateRoutesList() {
  const container = document.getElementById('routes-container')
  if (container) {
    container.innerHTML = renderRoutesPlaceholder()
    // Re-attach route card listeners
    document.querySelectorAll('.route-card').forEach(card => {
      card.addEventListener('click', () => {
        if (!selectedClimber) {
          showError('Please select a climber first')
          return
        }
        const routeId = card.getAttribute('data-route-id')
        const route = routes.find(r => r.id === routeId)
        if (route) {
          showAttemptModal(route)
        }
      })
    })
  }
}

/**
 * Show attempt submission modal
 */
async function showAttemptModal(route) {
  // Fetch existing attempts to calculate tick number
  const { data: existingAttempts, error } = await supabase
    .from('ascents')
    .select('*')
    .eq('climber_id', selectedClimber.id)
    .eq('route_id', route.id)
    .order('logged_at', { ascending: true })

  if (error) {
    console.error('Error fetching attempts:', error)
    showError('Failed to load attempt history')
    return
  }

  const tickNumber = (existingAttempts?.length || 0) + 1
  const isTrad = route.gear_type === 'trad'
  const tickPoints = calculateTickPoints(route.base_points, tickNumber, isTrad)

  // Create modal overlay
  const modal = document.createElement('div')
  modal.id = 'attempt-modal'
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
  `

  modal.innerHTML = `
    <div class="card" style="max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="font-size: 20px; font-weight: 600; color: var(--text-primary); margin: 0;">
          Log Send
        </h2>
        <button id="close-modal" style="
          background: none;
          border: none;
          font-size: 24px;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">×</button>
      </div>

      <div style="background-color: var(--bg-secondary); padding: 12px; border-radius: 6px; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px; color: var(--text-primary); margin-bottom: 4px;">
          ${route.name}
        </div>
        <div style="font-size: 14px; color: var(--text-secondary);">
          ${route.gear_type.toUpperCase()} • Grade ${route.grade} • ${route.base_points} pts${isTrad ? ' +50%' : ''}
        </div>
      </div>

      <div style="background-color: #fff5f7; padding: 12px; border-radius: 6px; margin-bottom: ${existingAttempts?.length > 0 ? '16px' : '24px'};">
        <div style="font-weight: 600; font-size: 14px; color: var(--text-primary); margin-bottom: 4px;">
          ${selectedClimber.data.name}
        </div>
        <div style="font-size: 13px; color: var(--text-secondary);">
          Tick #${tickNumber} • <span style="color: var(--color-primary); font-weight: 600;">+${tickPoints} points</span>
        </div>
      </div>

      ${existingAttempts?.length > 0 ? `
        <div style="margin-bottom: 24px;">
          <div style="font-weight: 600; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
            Previous Sends
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${existingAttempts.map((attempt, index) => `
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background-color: var(--bg-secondary);
                border-radius: 4px;
                font-size: 13px;
              ">
                <div>
                  <span style="font-weight: 600;">Tick #${index + 1}</span>
                  <span style="color: var(--text-secondary);"> • ${attempt.points_earned}pts</span>
                  <span style="color: var(--text-secondary); font-size: 11px;"> • ${new Date(attempt.logged_at).toLocaleString()}</span>
                </div>
                <button
                  type="button"
                  class="delete-send-btn"
                  data-ascent-id="${attempt.id}"
                  style="
                    background: none;
                    border: none;
                    color: #dc3545;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 4px 8px;
                    line-height: 1;
                  "
                  title="Delete this send"
                >🗑️</button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <form id="attempt-form">
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button type="button" id="cancel-btn" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            ✅ Log Send
          </button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  // Close modal function
  const closeModal = () => {
    modal.remove()
  }

  // Close button handler
  document.getElementById('close-modal')?.addEventListener('click', closeModal)
  document.getElementById('cancel-btn')?.addEventListener('click', closeModal)

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })

  // Delete send handlers
  document.querySelectorAll('.delete-send-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const ascentId = btn.getAttribute('data-ascent-id')

      if (!confirm('Are you sure you want to delete this send?')) {
        return
      }

      try {
        showLoading('Deleting send...')

        const { error: deleteError } = await supabase
          .from('ascents')
          .delete()
          .eq('id', ascentId)

        if (deleteError) throw deleteError

        hideLoading()
        showSuccess('Send deleted')
        closeModal()

        // Refresh team data and update route list
        await fetchFreshTeamData()
        updateRoutesList()
      } catch (error) {
        hideLoading()
        console.error('Error deleting send:', error)
        showError('Failed to delete send: ' + error.message)
      }
    })
  })

  // Form submission handler
  document.getElementById('attempt-form')?.addEventListener('submit', async (e) => {
    e.preventDefault()

    try {
      showLoading('Logging send...')

      // Insert ascent record (team_id is auto-set by trigger)
      const { error: insertError } = await supabase
        .from('ascents')
        .insert({
          climber_id: selectedClimber.id,
          route_id: route.id,
          tick_number: tickNumber,
          tick_multiplier: getTickMultiplier(tickNumber),
          trad_bonus_applied: isTrad,
          points_earned: tickPoints,
          repeat_count: tickNumber,
          logged_at: new Date().toISOString()
        })

      if (insertError) throw insertError

      hideLoading()
      showSuccess(`Send logged! +${tickPoints} points`)
      closeModal()

      // Refresh team data and update route list
      await fetchFreshTeamData()
      updateRoutesList()
    } catch (error) {
      hideLoading()
      console.error('Error saving send:', error)
      showError('Failed to log send: ' + error.message)
    }
  })
}

export default {
  renderScoring
}

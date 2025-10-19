/**
 * Admin Leaderboards
 *
 * Enhanced leaderboard views matching team results page:
 * - Team categories (Masters, Recreational, Intermediate, Advanced)
 * - Individual climber categories
 * - Special Awards (Hardest Sends, Most Ticks) with discipline and category filters
 * - Game Rewards with category filters
 *
 * Shows FULL results (no top 10 limit) - accordion for bonus games to manage long lists
 */

import { supabase } from '../lib/supabase.js'
import { showError, showLoading, hideLoading } from '../shared/ui-helpers.js'
import { renderAdminHeader, setupAdminHeader } from './admin-header.js'

/**
 * Check if current user is an administrator
 */
async function isAdmin() {
  try {
    const { data, error } = await supabase.rpc('is_admin')
    if (error) throw error
    return data || false
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Check if results are open to teams
 */
async function checkResultsOpen() {
  try {
    const { data, error } = await supabase
      .from('competition_settings')
      .select('results_open')
      .single()

    if (error) throw error
    return data?.results_open || false
  } catch (error) {
    console.error('Error checking results status:', error)
    return false
  }
}

/**
 * Render leaderboards page (unified for both admins and teams)
 */
export async function renderLeaderboards() {
  const app = document.querySelector('#app')

  // Check user role and access
  const userIsAdmin = await isAdmin()
  const resultsOpen = await checkResultsOpen()

  // Non-admins can only access when results are open
  if (!userIsAdmin && !resultsOpen) {
    app.innerHTML = `
      <div class="min-h-screen" style="background-color: var(--bg-primary);">
        <header class="header">
          <div class="container">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <img src="/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
                <h1 class="ml-4 text-white text-xl font-semibold">Results</h1>
              </div>
              <button id="back-to-dashboard" class="btn btn-header btn-sm btn-inline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Dashboard
              </button>
            </div>
          </div>
        </header>

        <main class="container" style="padding-top: 40px; padding-bottom: 32px; text-align: center;">
          <div class="card" style="max-width: 500px; margin: 0 auto; padding: 40px;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; color: var(--text-secondary);">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <h3 style="color: var(--color-primary); font-size: 18px; font-weight: 600; margin-bottom: 8px;">
              Results Not Available Yet
            </h3>
            <p style="color: var(--text-secondary); font-size: 14px;">
              The competition results will be published here after the event.
            </p>
          </div>
        </main>
      </div>
    `
    setupBackButton()
    return
  }

  // Show loading
  const headerHtml = userIsAdmin
    ? renderAdminHeader({ title: 'Leaderboards', currentPage: 'leaderboards' })
    : `
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Results</h1>
            </div>
            <button id="back-to-dashboard" class="btn btn-header btn-sm btn-inline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Dashboard
            </button>
          </div>
        </div>
      </header>
    `

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${headerHtml}
      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <p style="color: var(--text-secondary); text-align: center;">Loading leaderboards...</p>
      </main>
    </div>
  `

  try {
    // Fetch all data with discipline breakdowns and bonus games
    const [teamScores, climberScores, hardestSendsByDiscipline, mostTicksByDiscipline, bonusGamesData] = await Promise.all([
      fetchTeamScores(),
      fetchClimberScores(),
      fetchHardestSendsByDiscipline(),
      fetchMostTicksByDiscipline(),
      fetchBonusGamesLeaderboard()
    ])

    renderLeaderboardsContent(teamScores, climberScores, hardestSendsByDiscipline, mostTicksByDiscipline, bonusGamesData, userIsAdmin)
  } catch (error) {
    console.error('Error loading leaderboards:', error)
    showError('Failed to load leaderboards')
  }
}

/**
 * Setup back button listener for team view
 */
function setupBackButton() {
  setTimeout(() => {
    const backBtn = document.getElementById('back-to-dashboard')
    if (backBtn) {
      backBtn.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        window.location.hash = '#/dashboard'
      }
    }
  }, 100)
}

/**
 * Fetch team scores grouped by category
 */
async function fetchTeamScores() {
  const { data: teamData, error: teamError } = await supabase
    .from('team_scores')
    .select('*')
    .order('total_points', { ascending: false })

  if (teamError) throw teamError

  const { data: climbersData, error: climbersError } = await supabase
    .from('climbers')
    .select('id, team_id, name')

  if (climbersError) throw climbersError

  const teamsWithClimbers = teamData.map(team => {
    const teamClimbers = climbersData.filter(c => c.team_id === team.team_id)
    return {
      ...team,
      climber_names: teamClimbers.map(c => c.name).join(', ')
    }
  })

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

  return {
    recreational: data.filter(c => c.category === 'recreational'),
    intermediate: data.filter(c => c.category === 'intermediate'),
    advanced: data.filter(c => c.category === 'advanced')
  }
}

/**
 * Fetch hardest sends by discipline with repeat counts
 */
async function fetchHardestSendsByDiscipline() {
  // Fetch climber data
  const { data: climbers, error: climbersError } = await supabase
    .from('climbers')
    .select('id, name, category')

  if (climbersError) throw climbersError

  // Fetch ascents with route details
  const { data: ascents, error: ascentsError } = await supabase
    .from('ascents')
    .select(`
      climber_id,
      route_id,
      routes (
        grade,
        grade_numeric,
        gear_type
      )
    `)

  if (ascentsError) throw ascentsError

  // Process data to get hardest sends by discipline with repeat counts
  const climberStats = {}

  climbers.forEach(climber => {
    climberStats[climber.id] = {
      id: climber.id,
      name: climber.name,
      category: climber.category,
      all: { hardest: 0, grade: '-', repeats: 0 },
      boulder: { hardest: 0, grade: '-', repeats: 0 },
      sport: { hardest: 0, grade: '-', repeats: 0 },
      trad: { hardest: 0, grade: '-', repeats: 0 }
    }
  })

  // Calculate hardest sends and repeat counts per discipline
  ascents.forEach(ascent => {
    if (!ascent.routes) return

    const climberId = ascent.climber_id
    const grade_numeric = ascent.routes.grade_numeric
    const gear_type = ascent.routes.gear_type
    const grade = ascent.routes.grade

    if (!climberStats[climberId]) return

    // Update all disciplines
    if (grade_numeric > climberStats[climberId].all.hardest) {
      climberStats[climberId].all.hardest = grade_numeric
      climberStats[climberId].all.grade = grade
      climberStats[climberId].all.repeats = 1
    } else if (grade_numeric === climberStats[climberId].all.hardest) {
      climberStats[climberId].all.repeats++
    }

    // Update specific discipline
    if (gear_type && climberStats[climberId][gear_type]) {
      if (grade_numeric > climberStats[climberId][gear_type].hardest) {
        climberStats[climberId][gear_type].hardest = grade_numeric
        climberStats[climberId][gear_type].grade = grade
        climberStats[climberId][gear_type].repeats = 1
      } else if (grade_numeric === climberStats[climberId][gear_type].hardest) {
        climberStats[climberId][gear_type].repeats++
      }
    }
  })

  return Object.values(climberStats)
}

/**
 * Fetch most ticks by discipline
 */
async function fetchMostTicksByDiscipline() {
  // Fetch climber data
  const { data: climbers, error: climbersError } = await supabase
    .from('climbers')
    .select('id, name, category')

  if (climbersError) throw climbersError

  // Fetch ascents with route details
  const { data: ascents, error: ascentsError } = await supabase
    .from('ascents')
    .select(`
      climber_id,
      routes (
        gear_type
      )
    `)

  if (ascentsError) throw ascentsError

  // Process data to get tick counts by discipline
  const climberStats = {}

  climbers.forEach(climber => {
    climberStats[climber.id] = {
      id: climber.id,
      name: climber.name,
      category: climber.category,
      all: 0,
      boulder: 0,
      sport: 0,
      trad: 0
    }
  })

  // Count ticks per discipline
  ascents.forEach(ascent => {
    if (!ascent.routes) return

    const climberId = ascent.climber_id
    const gear_type = ascent.routes.gear_type

    if (!climberStats[climberId]) return

    climberStats[climberId].all++
    if (gear_type && climberStats[climberId][gear_type] !== undefined) {
      climberStats[climberId][gear_type]++
    }
  })

  return Object.values(climberStats)
}

/**
 * Fetch bonus games leaderboard data
 */
async function fetchBonusGamesLeaderboard() {
  // Fetch all bonus games
  const { data: games, error: gamesError } = await supabase
    .from('bonus_games')
    .select('*')
    .order('created_at', { ascending: true })

  if (gamesError) throw gamesError

  // Fetch all bonus entries with climber info
  const { data: entries, error: entriesError } = await supabase
    .from('bonus_entries')
    .select(`
      id,
      bonus_game_id,
      climber_id,
      points_awarded,
      climbers (
        id,
        name,
        category
      )
    `)

  if (entriesError) throw entriesError

  // Calculate totals and per-game leaderboards
  const climberTotals = {}
  const gameLeaderboards = {}

  // Initialize game leaderboards
  games.forEach(game => {
    gameLeaderboards[game.id] = {
      game_name: game.name,
      game_id: game.id,
      climbers: []
    }
  })

  // Process entries
  entries.forEach(entry => {
    if (!entry.climbers) return

    const climberId = entry.climber_id
    const gameId = entry.bonus_game_id
    const points = entry.points_awarded
    const climber = entry.climbers

    // Add to totals
    if (!climberTotals[climberId]) {
      climberTotals[climberId] = {
        id: climberId,
        name: climber.name,
        category: climber.category,
        total_points: 0,
        games_played: 0
      }
    }
    climberTotals[climberId].total_points += points
    climberTotals[climberId].games_played++

    // Add to game leaderboard
    if (gameLeaderboards[gameId]) {
      gameLeaderboards[gameId].climbers.push({
        id: climberId,
        name: climber.name,
        category: climber.category,
        points: points
      })
    }
  })

  // Sort game leaderboards
  Object.values(gameLeaderboards).forEach(game => {
    game.climbers.sort((a, b) => b.points - a.points)
  })

  return {
    totals: Object.values(climberTotals),
    games: gameLeaderboards
  }
}

/**
 * Initialize pagination state
 */
function initializePaginationState() {
  if (!window.paginationState) {
    window.paginationState = {
      teamsMasters: 1,
      teamsRecreational: 1,
      teamsIntermediate: 1,
      teamsAdvanced: 1,
      climbersRecreational: 1,
      climbersIntermediate: 1,
      climbersAdvanced: 1,
      hardestSends: 1,
      mostTicks: 1,
      gamesTotals: 1
    }
  }
}

/**
 * Render pagination controls
 */
function renderPagination(tableId, totalItems, currentPage, itemsPerPage = 10) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) {
    return '' // No pagination needed
  }

  const pages = []
  const maxVisiblePages = 5

  // Calculate page range to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  // Build page numbers
  if (startPage > 1) {
    pages.push({ page: 1, label: '1' })
    if (startPage > 2) {
      pages.push({ page: null, label: '...' })
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push({ page: i, label: String(i) })
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push({ page: null, label: '...' })
    }
    pages.push({ page: totalPages, label: String(totalPages) })
  }

  return `
    <div class="pagination-container" style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-top: 1px solid var(--border-secondary);
      background-color: var(--bg-secondary);
    ">
      <button
        class="pagination-btn"
        data-table="${tableId}"
        data-page="${currentPage - 1}"
        ${currentPage === 1 ? 'disabled' : ''}
        style="
          padding: 4px 10px;
          border: 1px solid var(--border-secondary);
          border-radius: 999px;
          background: ${currentPage === 1 ? 'var(--bg-tertiary)' : 'var(--bg-primary)'};
          color: ${currentPage === 1 ? 'var(--text-tertiary)' : 'var(--text-secondary)'};
          cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'};
          font-size: 12px;
          font-weight: 500;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        "
      >
        « Previous
      </button>

      <div style="display: flex; gap: 4px; align-items: center;">
        ${pages.map(({ page, label }) => {
          if (page === null) {
            return `<span style="padding: 4px 10px; font-size: 12px; color: var(--text-tertiary);">${label}</span>`
          }
          const isActive = page === currentPage
          return `
            <button
              class="pagination-btn"
              data-table="${tableId}"
              data-page="${page}"
              style="
                min-width: 28px;
                height: 28px;
                padding: 0 10px;
                border: 1px solid ${isActive ? 'var(--border-secondary)' : 'var(--border-secondary)'};
                border-radius: 999px;
                background: ${isActive ? 'var(--bg-tertiary)' : 'var(--bg-primary)'};
                color: ${isActive ? 'var(--text-primary)' : 'var(--text-secondary)'};
                cursor: pointer;
                font-size: 12px;
                font-weight: ${isActive ? '600' : '500'};
                display: inline-flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
                transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
              "
            >
              ${label}
            </button>
          `
        }).join('')}
      </div>

      <button
        class="pagination-btn"
        data-table="${tableId}"
        data-page="${currentPage + 1}"
        ${currentPage === totalPages ? 'disabled' : ''}
        style="
          padding: 4px 10px;
          border: 1px solid var(--border-secondary);
          border-radius: 999px;
          background: ${currentPage === totalPages ? 'var(--bg-tertiary)' : 'var(--bg-primary)'};
          color: ${currentPage === totalPages ? 'var(--text-tertiary)' : 'var(--text-secondary)'};
          cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'};
          font-size: 12px;
          font-weight: 500;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        "
      >
        Next »
      </button>
    </div>

    <div style="
      padding: 8px 16px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 13px;
      background-color: var(--bg-secondary);
    ">
      Page ${currentPage} of ${totalPages} • Showing ${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} entries
    </div>
  `
}

/**
 * Setup all event listeners using event delegation (called once on initial load)
 */
function setupAllEventListeners() {
  const app = document.querySelector('#app')

  // Use event delegation - single listener on app container
  app.addEventListener('click', (e) => {
    const target = e.target

    // Handle pagination button clicks
    if (target.classList.contains('pagination-btn') || target.closest('.pagination-btn')) {
      const btn = target.classList.contains('pagination-btn') ? target : target.closest('.pagination-btn')
      if (btn.disabled) return

      const tableId = btn.getAttribute('data-table')
      const newPage = parseInt(btn.getAttribute('data-page'))

      if (!tableId || !newPage) return

      // Update pagination state
      window.paginationState[tableId] = newPage

      // Special handling for hardestSends and mostTicks - just re-render their cards
      if (tableId === 'hardestSends') {
        const hardestSendsCard = document.getElementById('hardest-sends-card')
        if (hardestSendsCard && window.leaderboardData) {
          const newContent = renderHardestSendsLeaderboard(window.leaderboardData.hardestSendsByDiscipline)
          hardestSendsCard.outerHTML = newContent
        }
        return
      }

      if (tableId === 'mostTicks') {
        const mostTicksCard = document.getElementById('most-ticks-card')
        if (mostTicksCard && window.leaderboardData) {
          const newContent = renderMostTicksLeaderboard(window.leaderboardData.mostTicksByDiscipline)
          mostTicksCard.outerHTML = newContent
        }
        return
      }

      // Special handling for game tables - just re-render the games container
      if (tableId === 'gamesTotals' || tableId.startsWith('game_')) {
        const gamesContainer = document.getElementById('games-tables-container')
        if (gamesContainer && window.leaderboardData) {
          // Use stored category filter state
          const currentCategory = window.gameFilterState?.selectedCategory || 'all'
          gamesContainer.innerHTML = renderBonusGamesLeaderboards(window.leaderboardData.bonusGamesData, currentCategory)
        }
        return
      }

      // For all other tables (team/climber categories), re-render the full category
      const container = document.getElementById('results-container')
      if (container && window.leaderboardData) {
        const activeTab = document.querySelector('.category-tab.active')
        if (activeTab) {
          const category = activeTab.getAttribute('data-category')
          showCategory(category)
        }
      }
      return
    }

    // Handle discipline filter clicks
    if (target.classList.contains('discipline-filter')) {
      const group = target.closest('.discipline-toggle-group')
      if (!group) return

      const leaderboard = group.getAttribute('data-leaderboard')
      const buttons = group.querySelectorAll('.discipline-filter')

      // Update active button styling
      buttons.forEach(btn => {
        btn.classList.remove('active')
        btn.style.background = 'var(--bg-primary)'
        btn.style.color = 'var(--text-secondary)'
      })
      target.classList.add('active')
      target.style.background = 'var(--color-primary)'
      target.style.color = 'white'

      // Reset pagination to page 1 when filter changes
      if (leaderboard === 'hardest-sends') {
        window.paginationState.hardestSends = 1
      } else if (leaderboard === 'most-ticks') {
        window.paginationState.mostTicks = 1
      }

      // Update the leaderboard content
      if (leaderboard === 'hardest-sends') {
        const tableContainer = document.getElementById('hardest-sends-card')
        if (tableContainer && window.leaderboardData) {
          const newContent = renderHardestSendsLeaderboard(window.leaderboardData.hardestSendsByDiscipline)
          tableContainer.outerHTML = newContent
        }
      } else if (leaderboard === 'most-ticks') {
        const tableContainer = document.getElementById('most-ticks-card')
        if (tableContainer && window.leaderboardData) {
          const newContent = renderMostTicksLeaderboard(window.leaderboardData.mostTicksByDiscipline)
          tableContainer.outerHTML = newContent
        }
      }
      return
    }

    // Handle category filter clicks
    if (target.classList.contains('category-filter-btn')) {
      const buttons = document.querySelectorAll('.category-filter-btn')

      // Update active button styling
      buttons.forEach(btn => {
        btn.classList.remove('active')
        btn.style.background = 'var(--bg-primary)'
        btn.style.color = 'var(--text-secondary)'
      })
      target.classList.add('active')
      target.style.background = 'var(--color-primary)'
      target.style.color = 'white'

      // Reset pagination to page 1 when category filter changes
      window.paginationState.hardestSends = 1
      window.paginationState.mostTicks = 1

      // Re-render both cards to update tables and pagination
      const hardestSendsCard = document.getElementById('hardest-sends-card')
      if (hardestSendsCard && window.leaderboardData) {
        const newContent = renderHardestSendsLeaderboard(window.leaderboardData.hardestSendsByDiscipline)
        hardestSendsCard.outerHTML = newContent
      }

      const mostTicksCard = document.getElementById('most-ticks-card')
      if (mostTicksCard && window.leaderboardData) {
        const newContent = renderMostTicksLeaderboard(window.leaderboardData.mostTicksByDiscipline)
        mostTicksCard.outerHTML = newContent
      }
      return
    }

    // Handle game category filter clicks
    if (target.classList.contains('game-category-filter-btn')) {
      const category = target.getAttribute('data-category')

      // Store selected category in a global state
      if (!window.gameFilterState) {
        window.gameFilterState = {}
      }
      window.gameFilterState.selectedCategory = category

      const buttons = document.querySelectorAll('.game-category-filter-btn')

      // Update active button styling
      buttons.forEach(btn => {
        btn.classList.remove('active')
        btn.style.background = 'var(--bg-primary)'
        btn.style.color = 'var(--text-secondary)'
      })
      target.classList.add('active')
      target.style.background = 'var(--color-primary)'
      target.style.color = 'white'

      // Reset game pagination to page 1
      window.paginationState.gamesTotals = 1
      if (window.leaderboardData?.bonusGamesData?.games) {
        Object.values(window.leaderboardData.bonusGamesData.games).forEach(game => {
          const tableId = `game_${game.game_id}`
          window.paginationState[tableId] = 1
        })
      }

      // Re-render only the games tables container
      const gamesContainer = document.getElementById('games-tables-container')
      if (gamesContainer && window.leaderboardData) {
        gamesContainer.innerHTML = renderBonusGamesLeaderboards(window.leaderboardData.bonusGamesData, category)
      }
      return
    }

    // Handle category tab clicks
    if (target.classList.contains('category-tab')) {
      const category = target.getAttribute('data-category')
      const tabs = document.querySelectorAll('.category-tab')

      // Update active tab styling
      tabs.forEach(tab => {
        tab.classList.remove('active')
        tab.style.borderBottom = '3px solid transparent'
        tab.style.color = 'var(--text-secondary)'
      })
      target.classList.add('active')
      target.style.borderBottom = '3px solid var(--color-primary)'
      target.style.color = 'var(--color-primary)'

      // Show the selected category
      showCategory(category)
      return
    }
  })
}

/**
 * Render leaderboards content with tabs
 */
function renderLeaderboardsContent(teamScores, climberScores, hardestSendsByDiscipline, mostTicksByDiscipline, bonusGamesData, userIsAdmin) {
  const app = document.querySelector('#app')

  const headerHtml = userIsAdmin
    ? renderAdminHeader({ title: 'Leaderboards', currentPage: 'leaderboards' })
    : `
      <header class="header">
        <div class="container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img src="/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
              <h1 class="ml-4 text-white text-xl font-semibold">Results</h1>
            </div>
            <button id="back-to-dashboard" class="btn btn-header btn-sm btn-inline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Dashboard
            </button>
          </div>
        </div>
      </header>
    `

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${headerHtml}

      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <!-- Page Header with Refresh -->
        <div class="page-header" style="margin-bottom: 24px;">
          <h2 class="page-title">Competition ${userIsAdmin ? 'Leaderboards' : 'Results'}</h2>
          <div class="page-actions">
            <button id="refresh-btn" class="btn btn-secondary btn-inline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- Category Selector Tabs -->
        <div class="card" style="margin-bottom: 24px; padding: 0; overflow: hidden;">
          <div style="display: flex; border-bottom: 1px solid var(--border-secondary); overflow-x: auto;">
            <button class="category-tab active" data-category="teams" style="
              flex: 1;
              padding: 16px;
              background: none;
              border: none;
              border-bottom: 3px solid var(--color-primary);
              color: var(--color-primary);
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.2s;
            ">
              Team Results
            </button>
            <button class="category-tab" data-category="climbers" style="
              flex: 1;
              padding: 16px;
              background: none;
              border: none;
              border-bottom: 3px solid transparent;
              color: var(--text-secondary);
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.2s;
            ">
              Individual Results
            </button>
            <button class="category-tab" data-category="special" style="
              flex: 1;
              padding: 16px;
              background: none;
              border: none;
              border-bottom: 3px solid transparent;
              color: var(--text-secondary);
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.2s;
            ">
              Special Awards
            </button>
            <button class="category-tab" data-category="games" style="
              flex: 1;
              padding: 16px;
              background: none;
              border: none;
              border-bottom: 3px solid transparent;
              color: var(--text-secondary);
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.2s;
            ">
              Game Rewards
            </button>
          </div>
        </div>

        <!-- Results Container -->
        <div id="results-container">
          <!-- Content will be injected here -->
        </div>

      </main>
    </div>
  `

  // Initialize pagination state
  initializePaginationState()

  // Store data for tab switching
  window.leaderboardData = {
    teamScores,
    climberScores,
    hardestSendsByDiscipline,
    mostTicksByDiscipline,
    bonusGamesData
  }

  // Show initial category
  showCategory('teams')

  // Setup single event listener using delegation (called once)
  setupAllEventListeners()

  if (userIsAdmin) {
    setupAdminHeader()
  } else {
    setupBackButton()
  }
  setupRefreshButton()
}

/**
 * Show specific category results
 */
function showCategory(category) {
  const container = document.getElementById('results-container')
  if (!container || !window.leaderboardData) return

  const { teamScores, climberScores, hardestSendsByDiscipline, mostTicksByDiscipline, bonusGamesData } = window.leaderboardData

  let content = ''

  if (category === 'teams') {
    content = renderTeamLeaderboards(teamScores)
  } else if (category === 'climbers') {
    content = renderClimberLeaderboards(climberScores)
  } else if (category === 'special') {
    content = `
      <!-- Category Filter for Special Awards -->
      <div class="card" style="margin-bottom: 16px; padding: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <h3 style="font-size: 14px; font-weight: 600; color: var(--text-secondary); margin: 0;">
            Filter by Category:
          </h3>
          <div class="category-filter-group" style="display: inline-flex; border: 1px solid var(--border-secondary); border-radius: 6px; overflow: hidden;">
            <button class="category-filter-btn active" data-category="all" style="
              padding: 6px 12px;
              background: var(--color-primary);
              color: white;
              border: none;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">All</button>
            <button class="category-filter-btn" data-category="recreational" style="
              padding: 6px 12px;
              background: var(--bg-primary);
              color: var(--text-secondary);
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Recreational</button>
            <button class="category-filter-btn" data-category="intermediate" style="
              padding: 6px 12px;
              background: var(--bg-primary);
              color: var(--text-secondary);
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Intermediate</button>
            <button class="category-filter-btn" data-category="advanced" style="
              padding: 6px 12px;
              background: var(--bg-primary);
              color: var(--text-secondary);
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Advanced</button>
          </div>
        </div>
      </div>

      ${renderHardestSendsLeaderboard(hardestSendsByDiscipline)}
      ${renderMostTicksLeaderboard(mostTicksByDiscipline)}
    `
  } else if (category === 'games') {
    // Initialize game filter state if needed
    if (!window.gameFilterState) {
      window.gameFilterState = { selectedCategory: 'all' }
    }
    const currentCategory = getCurrentGameCategoryFilter()
    content = `
      <!-- Category Filter for Game Rewards -->
      <div class="card" style="margin-bottom: 16px; padding: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <h3 style="font-size: 14px; font-weight: 600; color: var(--text-secondary); margin: 0;">
            Filter by Category:
          </h3>
          <div class="game-category-filter-group" style="display: inline-flex; border: 1px solid var(--border-secondary); border-radius: 6px; overflow: hidden;">
            <button class="game-category-filter-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all" style="
              padding: 6px 12px;
              background: ${currentCategory === 'all' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentCategory === 'all' ? 'white' : 'var(--text-secondary)'};
              border: none;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">All</button>
            <button class="game-category-filter-btn ${currentCategory === 'recreational' ? 'active' : ''}" data-category="recreational" style="
              padding: 6px 12px;
              background: ${currentCategory === 'recreational' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentCategory === 'recreational' ? 'white' : 'var(--text-secondary)'};
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Recreational</button>
            <button class="game-category-filter-btn ${currentCategory === 'intermediate' ? 'active' : ''}" data-category="intermediate" style="
              padding: 6px 12px;
              background: ${currentCategory === 'intermediate' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentCategory === 'intermediate' ? 'white' : 'var(--text-secondary)'};
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Intermediate</button>
            <button class="game-category-filter-btn ${currentCategory === 'advanced' ? 'active' : ''}" data-category="advanced" style="
              padding: 6px 12px;
              background: ${currentCategory === 'advanced' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentCategory === 'advanced' ? 'white' : 'var(--text-secondary)'};
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Advanced</button>
          </div>
        </div>
      </div>

      <div id="games-tables-container">
        ${renderBonusGamesLeaderboards(bonusGamesData, currentCategory)}
      </div>
    `
  }

  container.innerHTML = content

  // Setup filter listeners
  // No need to setup listeners - using event delegation
}

/**
 * Render team leaderboards (full results with pagination)
 */
function renderTeamLeaderboards(teamScores) {
  const categories = [
    { key: 'masters', label: 'Masters Teams', tableId: 'teamsMasters' },
    { key: 'advanced', label: 'Advanced Teams', tableId: 'teamsAdvanced' },
    { key: 'intermediate', label: 'Intermediate Teams', tableId: 'teamsIntermediate' },
    { key: 'recreational', label: 'Recreational Teams', tableId: 'teamsRecreational' }
  ]

  return categories.map(cat => renderCategoryLeaderboard(cat.label, teamScores[cat.key], 'team', cat.tableId)).join('')
}

/**
 * Render climber leaderboards (full results with pagination)
 */
function renderClimberLeaderboards(climberScores) {
  return `
    ${renderCategoryLeaderboard('Recreational Climbers', climberScores.recreational, 'climber', 'climbersRecreational')}
    ${renderCategoryLeaderboard('Intermediate Climbers', climberScores.intermediate, 'climber', 'climbersIntermediate')}
    ${renderCategoryLeaderboard('Advanced Climbers', climberScores.advanced, 'climber', 'climbersAdvanced')}
  `
}

/**
 * Render category leaderboard with pagination
 */
function renderCategoryLeaderboard(title, data, type, tableId) {
  if (!data || data.length === 0) {
    return `
      <div class="card" style="margin-bottom: 16px; padding: 24px; text-align: center;">
        <h3 style="font-size: 16px; font-weight: 600; color: var(--color-primary); margin-bottom: 8px;">
          ${title}
        </h3>
        <p style="color: var(--text-secondary); font-size: 14px;">No entries yet</p>
      </div>
    `
  }

  // Get current page from pagination state
  const currentPage = window.paginationState?.[tableId] || 1
  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = data.slice(startIndex, endIndex)

  return `
    <div class="card" style="margin-bottom: 16px; padding: 0; overflow: hidden;">
      <div style="padding: 16px; border-bottom: 1px solid var(--border-secondary);">
        <h3 style="font-size: 16px; font-weight: 600; color: var(--color-primary); margin: 0;">
          ${title}
        </h3>
      </div>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background-color: var(--bg-secondary);">
            <tr>
              <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Rank</th>
              <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">${type === 'team' ? 'Team' : 'Climber'}</th>
              ${type === 'team' ? '<th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Climbers</th>' : ''}
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Points</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Sends</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedData.map((entry, pageIndex) => {
              const rank = startIndex + pageIndex + 1
              const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : ''
              const name = type === 'team' ? entry.team_name : entry.name

              return `
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: 12px; font-size: 14px; font-weight: 600; color: var(--text-primary);">
                    ${medalEmoji} ${rank}
                  </td>
                  <td style="padding: 12px; font-size: 14px; color: var(--text-primary); font-weight: 500;">
                    ${name}
                  </td>
                  ${type === 'team' ? `<td style="padding: 12px; font-size: 13px; color: var(--text-secondary);">${entry.climber_names || '-'}</td>` : ''}
                  <td style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: var(--color-primary);">
                    ${entry.total_points}
                  </td>
                  <td style="padding: 12px; text-align: right; font-size: 14px; color: var(--text-secondary);">
                    ${type === 'team' ? entry.total_ascents : entry.route_ascents}
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
      ${renderPagination(tableId, data.length, currentPage, itemsPerPage)}
    </div>
  `
}

/* Continue in next message due to length...
 * Render hardest sends leaderboard with discipline filter
 */
function renderHardestSendsLeaderboard(data) {
  // Get current discipline and category filters
  const currentDiscipline = getCurrentDiscipline('hardest-sends') || 'boulder'
  const currentCategory = getCurrentCategoryFilter()

  return `
    <div class="card" id="hardest-sends-card" style="margin-bottom: 16px; padding: 0; overflow: hidden;">
      <div style="padding: 16px; border-bottom: 1px solid var(--border-secondary);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <h3 style="font-size: 16px; font-weight: 600; color: var(--color-primary); margin: 0;">
            Hardest Sends
          </h3>
          <div class="discipline-toggle-group" data-leaderboard="hardest-sends" style="display: inline-flex; border: 1px solid var(--border-secondary); border-radius: 6px; overflow: hidden;">
            <button class="discipline-filter ${currentDiscipline === 'boulder' ? 'active' : ''}" data-discipline="boulder" style="
              padding: 6px 12px;
              background: ${currentDiscipline === 'boulder' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentDiscipline === 'boulder' ? 'white' : 'var(--text-secondary)'};
              border: none;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Boulder</button>
            <button class="discipline-filter ${currentDiscipline === 'sport' ? 'active' : ''}" data-discipline="sport" style="
              padding: 6px 12px;
              background: ${currentDiscipline === 'sport' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentDiscipline === 'sport' ? 'white' : 'var(--text-secondary)'};
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Sport</button>
            <button class="discipline-filter ${currentDiscipline === 'trad' ? 'active' : ''}" data-discipline="trad" style="
              padding: 6px 12px;
              background: ${currentDiscipline === 'trad' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentDiscipline === 'trad' ? 'white' : 'var(--text-secondary)'};
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Trad</button>
          </div>
        </div>
      </div>
      ${renderHardestSendsTable(data, currentDiscipline, currentCategory)}
    </div>
  `
}

/**
 * Render hardest sends table for specific discipline and category with pagination
 */
function renderHardestSendsTable(data, discipline, categoryFilter = 'all') {
  // Ensure data is an array
  if (!Array.isArray(data)) {
    console.error('renderHardestSendsTable: data is not an array', data)
    return `
      <div style="padding: 40px; text-align: center;">
        <p style="color: var(--text-secondary); font-size: 14px;">No data available</p>
      </div>
    `
  }

  // Sort by hardest send for the selected discipline
  const sorted = [...data]
    .filter(c => categoryFilter === 'all' || c.category === categoryFilter)
    .map(climber => ({
      ...climber,
      displayGrade: climber[discipline].grade,
      displayHardest: climber[discipline].hardest,
      displayRepeats: climber[discipline].repeats
    }))
    .filter(c => c.displayHardest > 0)
    .sort((a, b) => {
      if (b.displayHardest !== a.displayHardest) {
        return b.displayHardest - a.displayHardest
      }
      return b.displayRepeats - a.displayRepeats
    })

  if (sorted.length === 0) {
    return `
      <div style="padding: 40px; text-align: center;">
        <p style="color: var(--text-secondary); font-size: 14px;">No sends recorded for this discipline</p>
      </div>
    `
  }

  // Get current page and paginate
  const currentPage = window.paginationState?.hardestSends || 1
  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sorted.slice(startIndex, endIndex)

  return `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background-color: var(--bg-secondary);">
          <tr>
            <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Rank</th>
            <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Climber</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Hardest Grade</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Repeats</th>
          </tr>
        </thead>
        <tbody>
          ${paginatedData.map((climber, pageIndex) => {
            const rank = startIndex + pageIndex + 1
            const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : ''

            return `
              <tr style="border-bottom: 1px solid var(--border-secondary);">
                <td style="padding: 12px; font-size: 14px; font-weight: 600; color: var(--text-primary);">
                  ${medalEmoji} ${rank}
                </td>
                <td style="padding: 12px; font-size: 14px; color: var(--text-primary); font-weight: 500;">
                  ${climber.name}
                </td>
                <td style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: var(--color-primary);">
                  ${climber.displayGrade}
                </td>
                <td style="padding: 12px; text-align: right; font-size: 14px; color: var(--text-secondary);">
                  ×${climber.displayRepeats}
                </td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    </div>
    ${renderPagination('hardestSends', sorted.length, currentPage, itemsPerPage)}
  `
}

/**
 * Render most ticks leaderboard with discipline filter
 */
function renderMostTicksLeaderboard(data) {
  // Get current discipline and category filters
  const currentDiscipline = getCurrentDiscipline('most-ticks') || 'all'
  const currentCategory = getCurrentCategoryFilter()

  return `
    <div class="card" id="most-ticks-card" style="margin-bottom: 16px; padding: 0; overflow: hidden;">
      <div style="padding: 16px; border-bottom: 1px solid var(--border-secondary);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <h3 style="font-size: 16px; font-weight: 600; color: var(--color-primary); margin: 0;">
            Most Ticks
          </h3>
          <div class="discipline-toggle-group" data-leaderboard="most-ticks" style="display: inline-flex; border: 1px solid var(--border-secondary); border-radius: 6px; overflow: hidden;">
            <button class="discipline-filter ${currentDiscipline === 'all' ? 'active' : ''}" data-discipline="all" style="
              padding: 6px 12px;
              background: ${currentDiscipline === 'all' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentDiscipline === 'all' ? 'white' : 'var(--text-secondary)'};
              border: none;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">All</button>
            <button class="discipline-filter ${currentDiscipline === 'boulder' ? 'active' : ''}" data-discipline="boulder" style="
              padding: 6px 12px;
              background: ${currentDiscipline === 'boulder' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentDiscipline === 'boulder' ? 'white' : 'var(--text-secondary)'};
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Boulder</button>
            <button class="discipline-filter ${currentDiscipline === 'sport' ? 'active' : ''}" data-discipline="sport" style="
              padding: 6px 12px;
              background: ${currentDiscipline === 'sport' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentDiscipline === 'sport' ? 'white' : 'var(--text-secondary)'};
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Sport</button>
            <button class="discipline-filter ${currentDiscipline === 'trad' ? 'active' : ''}" data-discipline="trad" style="
              padding: 6px 12px;
              background: ${currentDiscipline === 'trad' ? 'var(--color-primary)' : 'var(--bg-primary)'};
              color: ${currentDiscipline === 'trad' ? 'white' : 'var(--text-secondary)'};
              border: none;
              border-left: 1px solid var(--border-secondary);
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Trad</button>
          </div>
        </div>
      </div>
      ${renderMostTicksTable(data, currentDiscipline, currentCategory)}
    </div>
  `
}

/**
 * Render most ticks table for specific discipline and category
 */
function renderMostTicksTable(data, discipline, categoryFilter = 'all') {
  // Ensure data is an array
  if (!Array.isArray(data)) {
    console.error('renderMostTicksTable: data is not an array', data)
    return `
      <div style="padding: 40px; text-align: center;">
        <p style="color: var(--text-secondary); font-size: 14px;">No data available</p>
      </div>
    `
  }

  // Sort by tick count for the selected discipline
  const sorted = [...data]
    .filter(c => categoryFilter === 'all' || c.category === categoryFilter)
    .map(climber => ({
      ...climber,
      displayTicks: climber[discipline],
      boulder: climber.boulder,
      sport: climber.sport,
      trad: climber.trad
    }))
    .filter(c => c.displayTicks > 0)
    .sort((a, b) => b.displayTicks - a.displayTicks)

  if (sorted.length === 0) {
    return `
      <div style="padding: 40px; text-align: center;">
        <p style="color: var(--text-secondary); font-size: 14px;">No ticks recorded for this discipline</p>
      </div>
    `
  }

  // Get current page and paginate
  const currentPage = window.paginationState?.mostTicks || 1
  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sorted.slice(startIndex, startIndex + itemsPerPage)

  return `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background-color: var(--bg-secondary);">
          <tr>
            <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Rank</th>
            <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Climber</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Total Ticks</th>
            ${discipline === 'all' ? '<th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Breakdown</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${paginatedData.map((climber, pageIndex) => {
            const rank = startIndex + pageIndex + 1
            const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : ''
            const breakdown = discipline === 'all'
              ? `B:${climber.boulder} S:${climber.sport} T:${climber.trad}`
              : ''

            return `
              <tr style="border-bottom: 1px solid var(--border-secondary);">
                <td style="padding: 12px; font-size: 14px; font-weight: 600; color: var(--text-primary);">
                  ${medalEmoji} ${rank}
                </td>
                <td style="padding: 12px; font-size: 14px; color: var(--text-primary); font-weight: 500;">
                  ${climber.name}
                </td>
                <td style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: var(--color-primary);">
                  ${climber.displayTicks}
                </td>
                ${discipline === 'all' ? `<td style="padding: 12px; text-align: right; font-size: 12px; color: var(--text-secondary);">${breakdown}</td>` : ''}
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    </div>
    ${renderPagination('mostTicks', sorted.length, currentPage, itemsPerPage)}
  `
}

// Old setup functions removed - now using event delegation in setupAllEventListeners()

/**
 * Get current category filter selection
 */
function getCurrentCategoryFilter() {
  const activeBtn = document.querySelector('.category-filter-btn.active')
  return activeBtn ? activeBtn.getAttribute('data-category') : 'all'
}

/**
 * Get current discipline filter for a leaderboard
 */
function getCurrentDiscipline(leaderboardName) {
  const group = document.querySelector(`[data-leaderboard="${leaderboardName}"]`)
  if (!group) return 'boulder' // default for hardest sends or 'all' for most ticks

  const activeBtn = group.querySelector('.discipline-filter.active')
  return activeBtn ? activeBtn.getAttribute('data-discipline') : 'boulder'
}

/**
 * Get current game category filter selection
 */
function getCurrentGameCategoryFilter() {
  // Use stored state if available, otherwise try to read from DOM
  if (window.gameFilterState?.selectedCategory) {
    return window.gameFilterState.selectedCategory
  }
  const activeBtn = document.querySelector('.game-category-filter-btn.active')
  return activeBtn ? activeBtn.getAttribute('data-category') : 'all'
}

/**
 * Render bonus games leaderboards (total + individual games)
 */
function renderBonusGamesLeaderboards(bonusGamesData, categoryFilter = 'all') {
  if (!bonusGamesData) {
    return `
      <div class="card" style="margin-bottom: 16px; padding: 24px; text-align: center;">
        <p style="color: var(--text-secondary); font-size: 14px;">No game data available</p>
      </div>
    `
  }

  const { totals, games } = bonusGamesData

  // Render total game rewards card
  let html = renderGameTotalsCard(totals, categoryFilter)

  // Render individual game cards
  Object.values(games).forEach(game => {
    html += renderIndividualGameCard(game, categoryFilter)
  })

  return html
}

/**
 * Render total game rewards card
 */
function renderGameTotalsCard(totals, categoryFilter = 'all') {
  // Filter and sort totals by category
  const filtered = totals
    .filter(c => categoryFilter === 'all' || c.category === categoryFilter)
    .sort((a, b) => b.total_points - a.total_points)

  if (filtered.length === 0) {
    return `
      <div class="card" style="margin-bottom: 16px; padding: 24px; text-align: center;">
        <h3 style="font-size: 16px; font-weight: 600; color: var(--color-primary); margin-bottom: 8px;">
          Total Game Rewards
        </h3>
        <p style="color: var(--text-secondary); font-size: 14px;">No game rewards recorded</p>
      </div>
    `
  }

  // Get current page and paginate
  const currentPage = window.paginationState?.gamesTotals || 1
  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage)

  return `
    <div class="card" style="margin-bottom: 16px; padding: 0; overflow: hidden;">
      <div style="padding: 16px; border-bottom: 1px solid var(--border-secondary);">
        <h3 style="font-size: 16px; font-weight: 600; color: var(--color-primary); margin: 0;">
          Total Game Rewards
        </h3>
      </div>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background-color: var(--bg-secondary);">
            <tr>
              <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Rank</th>
              <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Climber</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Total Points</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Games Played</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedData.map((climber, pageIndex) => {
              const rank = startIndex + pageIndex + 1
              const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : ''

              return `
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: 12px; font-size: 14px; font-weight: 600; color: var(--text-primary);">
                    ${medalEmoji} ${rank}
                  </td>
                  <td style="padding: 12px; font-size: 14px; color: var(--text-primary); font-weight: 500;">
                    ${climber.name}
                  </td>
                  <td style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: var(--color-primary);">
                    ${climber.total_points}
                  </td>
                  <td style="padding: 12px; text-align: right; font-size: 14px; color: var(--text-secondary);">
                    ${climber.games_played}
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
      ${renderPagination('gamesTotals', filtered.length, currentPage, itemsPerPage)}
    </div>
  `
}

/**
 * Render individual game card
 */
function renderIndividualGameCard(game, categoryFilter = 'all') {
  // Filter and sort game climbers by category
  const filtered = game.climbers
    .filter(c => categoryFilter === 'all' || c.category === categoryFilter)
    .sort((a, b) => b.points - a.points)

  if (filtered.length === 0) {
    return `
      <div class="card" style="margin-bottom: 16px; padding: 24px; text-align: center;">
        <h3 style="font-size: 16px; font-weight: 600; color: var(--color-primary); margin-bottom: 8px;">
          ${game.game_name}
        </h3>
        <p style="color: var(--text-secondary); font-size: 14px;">No participants</p>
      </div>
    `
  }

  // Create unique table ID for this game
  const tableId = `game_${game.game_id}`

  // Get current page and paginate
  const currentPage = window.paginationState?.[tableId] || 1
  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage)

  return `
    <div class="card" style="margin-bottom: 16px; padding: 0; overflow: hidden;">
      <div style="padding: 16px; border-bottom: 1px solid var(--border-secondary);">
        <h3 style="font-size: 16px; font-weight: 600; color: var(--color-primary); margin: 0;">
          ${game.game_name}
        </h3>
      </div>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background-color: var(--bg-secondary);">
            <tr>
              <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Rank</th>
              <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Climber</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Points</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedData.map((climber, pageIndex) => {
              const rank = startIndex + pageIndex + 1
              const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : ''

              return `
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: 12px; font-size: 14px; font-weight: 600; color: var(--text-primary);">
                    ${medalEmoji} ${rank}
                  </td>
                  <td style="padding: 12px; font-size: 14px; color: var(--text-primary); font-weight: 500;">
                    ${climber.name}
                  </td>
                  <td style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: var(--color-primary);">
                    ${climber.points}
                  </td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
      ${renderPagination(tableId, filtered.length, currentPage, itemsPerPage)}
    </div>
  `
}

// setupGameCategoryFilters removed - now using event delegation in setupAllEventListeners()

/**
 * Setup refresh button listener
 */
function setupRefreshButton() {
  document.getElementById('refresh-btn')?.addEventListener('click', async () => {
    await renderLeaderboards()
  })
}

export default { renderLeaderboards }

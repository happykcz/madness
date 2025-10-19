/**
 * Admin Bonus Games Management
 *
 * Create and manage bonus games, award points to climbers
 */

import { router } from '../lib/router.js'
import { supabase } from '../lib/supabase.js'
import { showSuccess, showError, showWarning } from '../shared/ui-helpers.js'
import { renderAdminHeader, setupAdminHeader } from './admin-header.js'

let currentView = 'list' // 'list', 'create', 'award'
let selectedGame = null

/**
 * Render bonus games management page
 */
export async function renderBonusGames() {
  const app = document.querySelector('#app')

  // Show loading
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderAdminHeader({ title: 'Bonus Games', currentPage: 'bonus' })}
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 16px;">Loading bonus games...</p>
      </div>
    </div>
  `

  try {
    if (currentView === 'list') {
      await renderGamesList()
    } else if (currentView === 'create') {
      renderCreateGame()
    } else if (currentView === 'award') {
      await renderAwardPoints()
    }
  } catch (error) {
    console.error('Error rendering bonus games:', error)
    showError('Error loading bonus games: ' + error.message)
  }
}

/**
 * Render bonus games list
 */
async function renderGamesList() {
  const app = document.querySelector('#app')

  // Fetch all bonus games
  const { data: games, error } = await supabase
    .from('bonus_games')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  // Fetch bonus entry counts for each game
  const { data: entryCounts, error: countError } = await supabase
    .from('bonus_entries')
    .select('bonus_game_id, climber_id')

  if (countError) throw countError

  // Count entries per game
  const gameEntryCounts = {}
  entryCounts.forEach(entry => {
    gameEntryCounts[entry.bonus_game_id] = (gameEntryCounts[entry.bonus_game_id] || 0) + 1
  })

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderAdminHeader({ title: 'Bonus Games', currentPage: 'bonus' })}

      <div style="max-width: 1280px; margin: 0 auto; padding: 40px 24px;">
        <!-- Page Header -->
        <div class="page-header" style="margin-bottom: 32px;">
          <div style="flex: 1 1 auto;">
            <h2 class="page-title" style="font-size: 28px;">Bonus Games (${games.length})</h2>
            <p style="color: var(--text-secondary);">
              Create bonus challenges and award points to climbers
            </p>
          </div>
          <div class="page-actions">
            <button id="create-game-btn" class="btn btn-secondary btn-inline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Bonus Game
            </button>
          </div>
        </div>

        ${games.length === 0 ? `
          <!-- Empty State -->
          <div class="card" style="text-align: center; padding: 60px 20px;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; color: var(--text-secondary);">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <h3 style="color: var(--text-primary); font-size: 18px; margin-bottom: 8px;">
              No Bonus Games Yet
            </h3>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">
              Create bonus games to award extra points for special challenges
            </p>
            <button id="create-game-btn-empty" class="btn btn-primary">
              Create First Bonus Game
            </button>
          </div>
        ` : `
          <!-- Games Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
            ${games.map(game => {
              const safeName = escapeHtml(game.name)
              const safeDescription = escapeHtml(game.description || '')
              const encodedName = encodeURIComponent(game.name || '')
              const encodedDescription = encodeURIComponent(game.description || '')
              const statusLabel = game.is_active ? 'Active' : 'Inactive'
              const statusColor = game.is_active ? 'var(--color-success)' : 'var(--text-secondary)'
              return `
              <div class="card" style="position: relative;">
                <!-- Game Info -->
                <div id="game-name-wrapper-${game.id}" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                  <div style="flex: 1; min-width: 0;">
                    <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin: 0 0 6px;">
                      ${safeName}
                    </h3>
                    ${safeDescription
                      ? `<p style="color: var(--text-secondary); font-size: 13px; margin: 0;">${safeDescription}</p>`
                      : ''}
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                    <span style="
                      display: inline-flex;
                      align-items: center;
                      gap: 6px;
                      padding: 2px 10px;
                      background-color: var(--bg-tertiary);
                      color: ${statusColor};
                      border: 1px solid var(--border-secondary);
                      border-radius: 999px;
                      font-size: 12px;
                      font-weight: 600;
                      text-transform: uppercase;
                      white-space: nowrap;
                    ">
                      <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${statusColor}; display: inline-block;"></span>
                      ${statusLabel}
                    </span>
                    <button
                      class="btn btn-secondary btn-sm rename-game-btn"
                      data-game-id="${game.id}"
                      data-game-name="${encodedName}"
                      data-game-description="${encodedDescription}"
                      data-game-points="${game.points}"
                      style="flex-shrink: 0;"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div id="rename-form-${game.id}" style="display: none; margin-bottom: 12px;">
                  <label for="rename-input-${game.id}" style="display: block; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px;">
                    Update game name
                  </label>
                  <input
                    type="text"
                    id="rename-input-${game.id}"
                    class="form-input"
                    value="${safeName}"
                    style="width: 100%; box-sizing: border-box; margin-bottom: 12px;"
                  />
                  <label for="rename-description-${game.id}" style="display: block; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px;">
                    Short description
                  </label>
                  <textarea
                    id="rename-description-${game.id}"
                    class="form-input"
                    rows="3"
                    style="width: 100%; box-sizing: border-box; margin-bottom: 12px; resize: vertical;"
                  >${safeDescription}</textarea>
                  <label for="rename-points-${game.id}" style="display: block; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px;">
                    Suggested points
                  </label>
                  <input
                    type="number"
                    id="rename-points-${game.id}"
                    class="form-input"
                    value="${game.points}"
                    min="1"
                    max="1000"
                    style="width: 100%; box-sizing: border-box; margin-bottom: 12px;"
                  />
                  <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary btn-sm save-rename-btn" data-game-id="${game.id}">
                      Save
                    </button>
                    <button class="btn btn-secondary btn-sm cancel-rename-btn" data-game-id="${game.id}">
                      Cancel
                    </button>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                  <div>
                    <div style="color: var(--text-secondary); font-size: 12px;">Suggested Points</div>
                    <div style="color: var(--color-primary); font-size: 24px; font-weight: 600;">${game.points}</div>
                  </div>
                  <div>
                    <div style="color: var(--text-secondary); font-size: 12px;">Awarded To</div>
                    <div style="color: var(--text-primary); font-size: 24px; font-weight: 600;">${gameEntryCounts[game.id] || 0}</div>
                  </div>
                </div>

                <!-- Actions -->
                <div style="display: flex; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-secondary);">
                  <button class="btn btn-primary award-points-btn" data-game-id="${game.id}" style="flex: 1;">
                    Award Points
                  </button>
                  <button class="btn btn-secondary toggle-active-btn" data-game-id="${game.id}" data-is-active="${game.is_active}">
                    ${game.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            `}).join('')}
          </div>
        `}
      </div>
    </div>
  `

  setupAdminHeader()
  setupGamesListListeners()
}

/**
 * Render create bonus game form
 */
function renderCreateGame() {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderAdminHeader({ title: 'Bonus Games', currentPage: 'bonus' })}

      <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
        <!-- Back Button -->
        <button id="back-to-list" class="btn btn-secondary" style="margin-bottom: 24px; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Bonus Games
        </button>

        <!-- Create Form -->
        <div class="card">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 24px;">
            Create Bonus Game
          </h2>

          <form id="create-game-form">
            <!-- Game Name -->
            <div style="margin-bottom: 20px;">
              <label for="game-name" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Game Name *
              </label>
              <input
                type="text"
                id="game-name"
                name="name"
                placeholder="e.g., Fastest Flash, Hardest Boulder, Team Spirit"
                required
                class="form-input"
                style="width: 100%; box-sizing: border-box;"
              />
              <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">
                Choose a descriptive name for the bonus challenge
              </p>
            </div>

            <!-- Description -->
            <div style="margin-bottom: 20px;">
              <label for="game-description" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Short Description
              </label>
              <textarea
                id="game-description"
                name="description"
                rows="3"
                placeholder="Add context for admin team (e.g., qualifying criteria, time window)"
                class="form-input"
                style="width: 100%; box-sizing: border-box; resize: vertical;"
              ></textarea>
              <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">
                Optional one-liner that explains how this bonus works
              </p>
            </div>

            <!-- Suggested Points -->
            <div style="margin-bottom: 20px;">
              <label for="game-points" style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Suggested Points *
              </label>
              <input
                type="number"
                id="game-points"
                name="points"
                min="1"
                max="1000"
                value="10"
                required
                class="form-input"
                style="width: 100%; box-sizing: border-box;"
              />
              <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">
                Default number of points to suggest when awarding (admins can override per climber)
              </p>
            </div>

            <!-- Active Status -->
            <div style="margin-bottom: 24px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input
                  type="checkbox"
                  id="game-active"
                  name="is_active"
                  checked
                  style="width: 18px; height: 18px; cursor: pointer;"
                />
                <span style="color: var(--text-primary); font-weight: 500;">
                  Active (can be awarded immediately)
                </span>
              </label>
            </div>

            <!-- Error Container -->
            <div id="form-error" style="margin-bottom: 16px;"></div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              Create Bonus Game
            </button>
          </form>
        </div>
      </div>
    </div>
  `

  setupAdminHeader()
  setupCreateFormListeners()
}

/**
 * Render award points interface
 */
async function renderAwardPoints() {
  const app = document.querySelector('#app')

  if (!selectedGame) {
    currentView = 'list'
    await renderGamesList()
    return
  }

  // Fetch game details
  const { data: game, error: gameError } = await supabase
    .from('bonus_games')
    .select('*')
    .eq('id', selectedGame)
    .single()

  if (gameError) throw gameError

  // Fetch all teams and climbers
  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select(`
      *,
      climbers (*)
    `)
    .order('team_name')

  if (teamsError) throw teamsError

  // Fetch existing bonus entries for this game with full details
  const { data: existingEntries, error: entriesError } = await supabase
    .from('bonus_entries')
    .select('id, climber_id, points_awarded')
    .eq('bonus_game_id', selectedGame)

  if (entriesError) throw entriesError

  // Create map of climber_id -> entry details for awarded climbers
  const awardedClimbersMap = {}
  existingEntries.forEach(entry => {
    awardedClimbersMap[entry.climber_id] = {
      entryId: entry.id,
      points: entry.points_awarded
    }
  })

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderAdminHeader({ title: 'Bonus Games', currentPage: 'bonus' })}

      <div style="max-width: 900px; margin: 0 auto; padding: 40px 24px;">
        <!-- Back Button -->
        <button id="back-to-list" class="btn btn-secondary" style="margin-bottom: 24px; display: inline-flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Bonus Games
        </button>

        <!-- Game Info Card -->
        <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);">
          <h2 style="color: white; font-size: 24px; font-weight: 600; margin-bottom: 8px;">
            ${escapeHtml(game.name)}
          </h2>
          <div style="color: rgba(255,255,255,0.9); font-size: 16px;">
            <strong>${game.points} pts suggested</strong> &bull; Override as needed for each climber
          </div>
          ${game.description ? `
            <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 8px;">
              ${escapeHtml(game.description)}
            </p>
          ` : ''}
        </div>

        <!-- Search/Filter -->
        <div class="card" style="margin-bottom: 24px;">
          <input
            type="text"
            id="search-climbers"
            placeholder="Search by climber or team name..."
            class="form-input"
            style="width: 100%; box-sizing: border-box;"
          />
        </div>

        <!-- Climbers List -->
        <div class="card">
          <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
            Select Climbers to Award
          </h3>

          <div id="climbers-list">
            ${teams.map(team => `
              <div class="team-section" data-team-name="${team.team_name.toLowerCase()}">
                <h4 style="color: var(--text-secondary); font-size: 14px; font-weight: 600; margin: 16px 0 8px; text-transform: uppercase;">
                  ${team.team_name}
                </h4>
                ${team.climbers.map(climber => {
                  const awardedEntry = awardedClimbersMap[climber.id]
                  const alreadyAwarded = !!awardedEntry
                  return `
                    <div class="climber-item" data-climber-name="${climber.name.toLowerCase()}" style="
                      padding: 12px;
                      border: 1px solid var(--border-secondary);
                      border-radius: 6px;
                      margin-bottom: 8px;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      background: ${alreadyAwarded ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'};
                    ">
                      <div>
                        <div style="color: var(--text-primary); font-weight: 500;">
                          ${climber.name}
                        </div>
                        <div style="color: var(--text-secondary); font-size: 13px;">
                          ${climber.category} • Grade ${climber.redpoint_grade}
                        </div>
                      </div>
                      ${alreadyAwarded ? `
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <div style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: var(--bg-secondary); border-radius: 4px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-success);">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                              <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            <span style="color: var(--text-primary); font-weight: 600; font-size: 14px;">
                              ${awardedEntry.points} pts
                            </span>
                          </div>
                          <button class="btn btn-secondary edit-award-btn"
                                  data-entry-id="${awardedEntry.entryId}"
                                  data-climber-id="${climber.id}"
                                  data-current-points="${awardedEntry.points}"
                                  style="padding: 6px 12px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button class="btn delete-award-btn"
                                  data-entry-id="${awardedEntry.entryId}"
                                  data-climber-name="${climber.name}"
                                  style="padding: 6px 12px; background: #fee2e2; color: #dc2626; border: 1px solid #fecaca;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      ` : `
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <input
                            type="number"
                            class="form-input points-input"
                            data-climber-id="${climber.id}"
                            value="${game.points}"
                            min="1"
                            max="1000"
                            style="width: 80px; padding: 6px 8px; font-size: 14px;"
                            placeholder="Points"
                          />
                          <button class="btn btn-primary award-to-climber-btn" data-climber-id="${climber.id}" data-climber-name="${climber.name}" style="padding: 6px 16px;">
                            Award
                          </button>
                        </div>
                      `}
                    </div>
                  `
                }).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `

  setupAdminHeader()
  setupAwardPointsListeners()
}

/**
 * Setup listeners for games list
 */
function setupGamesListListeners() {
  // Create game button
  document.querySelectorAll('#create-game-btn, #create-game-btn-empty').forEach(btn => {
    btn?.addEventListener('click', () => {
      currentView = 'create'
      renderCreateGame()
    })
  })

  // Award points buttons
  document.querySelectorAll('.award-points-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      selectedGame = e.target.getAttribute('data-game-id')
      currentView = 'award'
      await renderAwardPoints()
    })
  })

  // Toggle active/inactive
  document.querySelectorAll('.toggle-active-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const gameId = e.target.getAttribute('data-game-id')
      const isActive = e.target.getAttribute('data-is-active') === 'true'

      const { error } = await supabase
        .from('bonus_games')
        .update({ is_active: !isActive })
        .eq('id', gameId)

      if (error) {
        showError('Failed to update game: ' + error.message)
      } else {
        showSuccess(`Game ${!isActive ? 'activated' : 'deactivated'}`)
        await renderGamesList()
      }
    })
  })

  // Rename toggles
  document.querySelectorAll('.rename-game-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const gameId = e.currentTarget.getAttribute('data-game-id')
      const currentName = decodeURIComponent(e.currentTarget.getAttribute('data-game-name') || '')
      const currentDescription = decodeURIComponent(e.currentTarget.getAttribute('data-game-description') || '')
      const currentPoints = parseInt(e.currentTarget.getAttribute('data-game-points') || '0', 10)
      openRenameForm(gameId, currentName, currentDescription, currentPoints)
    })
  })

  // Cancel rename
  document.querySelectorAll('.cancel-rename-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const gameId = e.currentTarget.getAttribute('data-game-id')
      closeRenameForm(gameId)
    })
  })

  // Save rename
  document.querySelectorAll('.save-rename-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault()
      const button = e.currentTarget
      const gameId = button.getAttribute('data-game-id')
      const input = document.getElementById(`rename-input-${gameId}`)
      const descriptionInput = document.getElementById(`rename-description-${gameId}`)
      const pointsInput = document.getElementById(`rename-points-${gameId}`)

      if (!input) return

      const newName = input.value.trim()
      if (!newName) {
        showWarning('Please enter a game name before saving')
        input.focus()
        return
      }

      const newDescription = descriptionInput ? descriptionInput.value : ''
      const newPoints = pointsInput ? parseInt(pointsInput.value, 10) : NaN

      if (!Number.isInteger(newPoints) || newPoints < 1 || newPoints > 1000) {
        showWarning('Suggested points must be between 1 and 1000')
        pointsInput?.focus()
        button.disabled = false
        button.textContent = 'Save'
        return
      }

      try {
        button.disabled = true
        button.textContent = 'Saving...'
        await renameBonusGame(gameId, newName, newDescription, newPoints)
      } catch (error) {
        showError('Failed to rename bonus game: ' + error.message)
      } finally {
        // Button state resets on re-render, but in case of error, restore text
        if (button) {
          button.disabled = false
          button.textContent = 'Save'
        }
      }
    })
  })
}

/**
 * Setup listeners for create form
 */
function setupCreateFormListeners() {
  document.getElementById('back-to-list')?.addEventListener('click', () => {
    currentView = 'list'
    renderGamesList()
  })

  document.getElementById('create-game-form')?.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const name = (formData.get('name') || '').toString().trim()
    const description = (formData.get('description') || '').toString().trim()
    const points = parseInt(formData.get('points'))
    const isActive = formData.get('is_active') === 'on'

    if (!name) {
      showWarning('Please provide a name for the bonus game')
      return
    }

    try {
      const { data: admin } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('bonus_games')
        .insert({
          name,
          description,
          points,
          is_active: isActive,
          created_by: admin.user.id
        })

      if (error) throw error

      showSuccess('Bonus game created successfully!')
      currentView = 'list'
      await renderGamesList()
    } catch (error) {
      showError('Failed to create bonus game: ' + error.message)
    }
  })
}

/**
 * Setup listeners for award points interface
 */
function setupAwardPointsListeners() {
  document.getElementById('back-to-list')?.addEventListener('click', () => {
    selectedGame = null
    currentView = 'list'
    renderGamesList()
  })

  // Search functionality
  const searchInput = document.getElementById('search-climbers')
  searchInput?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase()
    const climberItems = document.querySelectorAll('.climber-item')
    const teamSections = document.querySelectorAll('.team-section')

    climberItems.forEach(item => {
      const climberName = item.getAttribute('data-climber-name')
      if (climberName.includes(searchTerm)) {
        item.style.display = 'flex'
      } else {
        item.style.display = 'none'
      }
    })

    // Hide/show team sections based on visible climbers
    teamSections.forEach(section => {
      const teamName = section.getAttribute('data-team-name')
      const visibleClimbers = section.querySelectorAll('.climber-item[style*="display: flex"]')

      if (visibleClimbers.length > 0 || teamName.includes(searchTerm)) {
        section.style.display = 'block'
      } else {
        section.style.display = 'none'
      }
    })
  })

  // Award to climber buttons
  document.querySelectorAll('.award-to-climber-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const climberId = e.target.getAttribute('data-climber-id')
      const climberName = e.target.getAttribute('data-climber-name')

      // Get points from input field
      const pointsInput = document.querySelector(`.points-input[data-climber-id="${climberId}"]`)
      const pointsAwarded = parseInt(pointsInput?.value || '0', 10)

      // Validate points
      if (!pointsAwarded || pointsAwarded < 1 || pointsAwarded > 1000) {
        showError('Please enter valid points (1-1000)')
        return
      }

      try {
        const { error } = await supabase
          .from('bonus_entries')
          .insert({
            climber_id: climberId,
            bonus_game_id: selectedGame,
            points_awarded: pointsAwarded
          })

        if (error) throw error

        showSuccess(`${pointsAwarded} bonus points awarded to ${climberName}!`)
        await renderAwardPoints()
      } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
          showError('Points already awarded to this climber')
        } else {
          showError('Failed to award points: ' + error.message)
        }
      }
    })
  })

  // Edit award buttons
  document.querySelectorAll('.edit-award-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const entryId = e.currentTarget.getAttribute('data-entry-id')
      const currentPoints = parseInt(e.currentTarget.getAttribute('data-current-points'))

      // Prompt for new points value
      const newPointsStr = prompt(`Enter new points value (current: ${currentPoints}):`, currentPoints)

      if (newPointsStr === null) {
        return // User cancelled
      }

      const newPoints = parseInt(newPointsStr, 10)

      // Validate points
      if (!newPoints || newPoints < 1 || newPoints > 1000) {
        showError('Please enter valid points (1-1000)')
        return
      }

      try {
        const { error } = await supabase
          .from('bonus_entries')
          .update({ points_awarded: newPoints })
          .eq('id', entryId)

        if (error) throw error

        showSuccess(`Points updated to ${newPoints}!`)
        await renderAwardPoints()
      } catch (error) {
        showError('Failed to update points: ' + error.message)
      }
    })
  })

  // Delete award buttons
  document.querySelectorAll('.delete-award-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const entryId = e.currentTarget.getAttribute('data-entry-id')
      const climberName = e.currentTarget.getAttribute('data-climber-name')

      if (!confirm(`Remove bonus points from ${climberName}?`)) {
        return
      }

      try {
        const { error } = await supabase
          .from('bonus_entries')
          .delete()
          .eq('id', entryId)

        if (error) throw error

        showSuccess(`Bonus points removed from ${climberName}`)
        await renderAwardPoints()
      } catch (error) {
        showError('Failed to delete award: ' + error.message)
      }
    })
  })
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function openRenameForm(gameId, currentName, currentDescription = '', currentPoints = 0) {
  document.querySelectorAll('[id^="rename-form-"]').forEach(formEl => {
    formEl.style.display = 'none'
  })
  document.querySelectorAll('[id^="game-name-wrapper-"]').forEach(wrapperEl => {
    wrapperEl.style.display = 'flex'
  })

  const wrapper = document.getElementById(`game-name-wrapper-${gameId}`)
  const form = document.getElementById(`rename-form-${gameId}`)
  const input = document.getElementById(`rename-input-${gameId}`)
  const descriptionInput = document.getElementById(`rename-description-${gameId}`)
  const pointsInput = document.getElementById(`rename-points-${gameId}`)

  if (!wrapper || !form || !input) return

  wrapper.style.display = 'none'
  form.style.display = 'block'
  input.value = currentName
  if (descriptionInput) {
    descriptionInput.value = currentDescription
  }
  if (pointsInput) {
    pointsInput.value = currentPoints || ''
  }

  requestAnimationFrame(() => {
    input.focus()
    input.select()
  })
}

function closeRenameForm(gameId) {
  const wrapper = document.getElementById(`game-name-wrapper-${gameId}`)
  const form = document.getElementById(`rename-form-${gameId}`)

  if (!wrapper || !form) return

  form.style.display = 'none'
  wrapper.style.display = 'flex'
}

async function renameBonusGame(gameId, newName, newDescription = '', newPoints = 0) {
  const trimmedName = newName.trim()
  const trimmedDescription = newDescription.trim()
  const normalizedPoints = Number(newPoints)

  if (!trimmedName) {
    showWarning('Game name cannot be empty')
    return
  }

  if (!Number.isInteger(normalizedPoints) || normalizedPoints < 1 || normalizedPoints > 1000) {
    showWarning('Suggested points must be between 1 and 1000')
    return
  }

  const { error } = await supabase
    .from('bonus_games')
    .update({
      name: trimmedName,
      description: trimmedDescription,
      points: normalizedPoints
    })
    .eq('id', gameId)

  if (error) {
    throw error
  }

  showSuccess('Bonus game renamed')
  await renderGamesList()
}

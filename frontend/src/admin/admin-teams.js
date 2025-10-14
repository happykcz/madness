/**
 * Admin Team Management Page
 *
 * Create teams with manual team IDs (e.g., Jeff_Peter, Alice_Bob)
 * Display credentials, reset passwords, view all teams
 */

import { router } from '../lib/router.js'
import { supabase } from '../lib/supabase.js'
import { showSuccess, showError, showLoading, hideLoading } from '../shared/ui-helpers.js'
import { classifyTeam, classifyClimber } from '../shared/category-classifier.js'
import { renderAdminHeader, setupAdminHeader } from './admin-header.js'

let currentView = 'list' // 'list', 'create', 'view'
let selectedTeam = null

/**
 * Render team management page
 */
export async function renderTeamManagement() {
  const app = document.querySelector('#app')

  // Show loading
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderHeader()}
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
        <p style="color: var(--text-secondary); margin-top: 16px;">Loading teams...</p>
      </div>
    </div>
  `

  try {
    if (currentView === 'list') {
      await renderTeamList()
    } else if (currentView === 'create') {
      renderCreateTeamForm()
    } else if (currentView === 'view' && selectedTeam) {
      await renderTeamDetail(selectedTeam)
    }
  } catch (error) {
    console.error('Error rendering team management:', error)
    showError('Error loading teams: ' + error.message)
  }
}

/**
 * Render header with navigation (using shared component)
 */
function renderHeader() {
  return renderAdminHeader({ title: 'Team Management', currentPage: 'teams' })
}

/**
 * Render team list view
 */
async function renderTeamList() {
  const app = document.querySelector('#app')

  // Fetch all teams
  const { data: teams, error } = await supabase
    .from('teams')
    .select(`
      *,
      climbers (*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderHeader()}

      <div style="max-width: 1280px; margin: 0 auto; padding: 40px 24px;">
        <!-- Page Title and Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h2 style="color: var(--text-primary); font-size: 28px; font-weight: 600; margin-bottom: 8px;">
              Teams (${teams.length})
            </h2>
            <p style="color: var(--text-secondary);">
              Manage team registrations and credentials
            </p>
          </div>
          <button id="create-team-btn" class="btn btn-primary" style="padding: 10px 20px; opacity: 0.5;" disabled title="Use manual SQL creation for now">
            + Create New Team (Disabled)
          </button>
        </div>

        <!-- Teams Table -->
        ${teams.length === 0 ? renderEmptyState() : renderTeamsTable(teams)}
      </div>
    </div>
  `

  setupTeamListListeners()
}

/**
 * Render empty state when no teams exist
 */
function renderEmptyState() {
  return `
    <div class="card" style="text-align: center; padding: 60px 40px;">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 16px; color: var(--text-secondary);">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <h3 style="color: var(--text-primary); font-size: 20px; margin-bottom: 8px;">No teams yet</h3>
      <p style="color: var(--text-secondary); margin-bottom: 24px;">
        Create your first team to get started with the competition
      </p>
      <button id="create-first-team" class="btn btn-primary">
        Create First Team
      </button>
    </div>
  `
}

/**
 * Render teams table (mobile-friendly cards)
 */
function renderTeamsTable(teams) {
  return `
    <div style="display: grid; gap: 12px;">
      ${teams.map(team => `
        <div class="card" style="padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 16px; color: var(--text-primary); margin-bottom: 4px;">
                ${team.team_name}
              </div>
              <code style="background-color: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-size: 12px;">
                ${team.team_id}
              </code>
            </div>
            <span style="
              display: inline-block;
              padding: 4px 10px;
              background-color: ${getCategoryColor(team.category)};
              color: white;
              border-radius: 12px;
              font-size: 12px;
              text-transform: capitalize;
              white-space: nowrap;
            ">
              ${team.category}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #e1e4e8;">
            <div style="font-size: 13px; color: var(--text-secondary);">
              ${team.climbers?.length || 0} climbers • ${new Date(team.created_at).toLocaleDateString()}
            </div>
            <button
              class="btn-view-team"
              data-team-id="${team.id}"
              style="
                padding: 6px 12px;
                background-color: var(--color-primary);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                white-space: nowrap;
              "
            >
              View
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

/**
 * Get category badge color
 */
function getCategoryColor(category) {
  const colors = {
    masters: '#6f42c1',
    recreational: '#28a745',
    intermediate: 'var(--color-primary)',
    advanced: '#d73a49'
  }
  return colors[category] || '#6c757d'
}

/**
 * Render create team form
 */
function renderCreateTeamForm() {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderHeader()}

      <div style="max-width: 800px; margin: 0 auto; padding: 40px 24px;">
        <!-- Back Button -->
        <button id="back-to-list" class="btn" style="margin-bottom: 24px;">
          ← Back to Teams
        </button>

        <!-- Form Card -->
        <div class="card">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 24px;">
            Create New Team
          </h2>

          <form id="create-team-form">
            <!-- Team ID -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Team ID <span style="color: #d73a49;">*</span>
              </label>
              <input
                type="text"
                id="team-id-input"
                name="team-id"
                placeholder="Jeff_Peter or AliceAndBob"
                required
                pattern="[a-zA-Z0-9_]{3,50}"
                title="3-50 characters, letters, numbers and underscore only"
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
              />
              <p style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
                Used for login. 3-50 characters, alphanumeric and underscore only (e.g., Jeff_Peter, AliceAndBob)
              </p>
            </div>

            <!-- Team Name -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Team Name <span style="color: #d73a49;">*</span>
              </label>
              <input
                type="text"
                id="team-name-input"
                name="team-name"
                placeholder="Team Alpha"
                required
                maxlength="100"
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
              />
            </div>

            <!-- Password -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Password <span style="color: #d73a49;">*</span>
              </label>
              <input
                type="text"
                id="password-input"
                name="password"
                value="12qm2025"
                required
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
              />
              <p style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
                Default: 12qm2025 (can be customized)
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 32px 0;" />

            <!-- Climber 1 -->
            <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
              Climber 1
            </h3>

            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Name <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="text"
                  id="climber1-name"
                  required
                  placeholder="Alice"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Age <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="number"
                  id="climber1-age"
                  required
                  min="10"
                  max="100"
                  placeholder="30"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Grade <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="number"
                  id="climber1-grade"
                  required
                  min="10"
                  max="35"
                  placeholder="22"
                  title="Ewbank grade 10-35"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
            </div>

            <!-- Climber 2 -->
            <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
              Climber 2
            </h3>

            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 32px;">
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Name <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="text"
                  id="climber2-name"
                  required
                  placeholder="Bob"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Age <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="number"
                  id="climber2-age"
                  required
                  min="10"
                  max="100"
                  placeholder="28"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                  Grade <span style="color: #d73a49;">*</span>
                </label>
                <input
                  type="number"
                  id="climber2-grade"
                  required
                  min="10"
                  max="35"
                  placeholder="20"
                  title="Ewbank grade 10-35"
                  style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid var(--border-primary);
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
            </div>

            <!-- Error Container -->
            <div id="form-error" style="margin-bottom: 16px;"></div>

            <!-- Submit Buttons -->
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button type="button" id="cancel-create" class="btn">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" style="padding: 10px 24px;">
                Create Team
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `

  setupCreateFormListeners()
}

/**
 * Setup team list listeners
 */
function setupTeamListListeners() {
  document.getElementById('create-team-btn')?.addEventListener('click', () => {
    currentView = 'create'
    renderTeamManagement()
  })

  document.getElementById('create-first-team')?.addEventListener('click', () => {
    currentView = 'create'
    renderTeamManagement()
  })

  document.querySelectorAll('.btn-view-team').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const teamId = e.target.dataset.teamId
      selectedTeam = teamId
      currentView = 'view'
      await renderTeamManagement()
    })
  })

  setupAdminHeader()
}

/**
 * Setup create form listeners
 */
function setupCreateFormListeners() {
  const form = document.getElementById('create-team-form')
  const errorContainer = document.getElementById('form-error')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorContainer.innerHTML = ''

    const teamId = document.getElementById('team-id-input').value.trim()
    const teamName = document.getElementById('team-name-input').value.trim()
    const password = document.getElementById('password-input').value

    const climber1 = {
      name: document.getElementById('climber1-name').value.trim(),
      age: parseInt(document.getElementById('climber1-age').value),
      redpointGrade: parseInt(document.getElementById('climber1-grade').value)
    }

    const climber2 = {
      name: document.getElementById('climber2-name').value.trim(),
      age: parseInt(document.getElementById('climber2-age').value),
      redpointGrade: parseInt(document.getElementById('climber2-grade').value)
    }

    try {
      showLoading()

      // Validate team ID format and uniqueness
      const { error: validateError } = await supabase
        .rpc('validate_team_id', { p_team_id: teamId })

      if (validateError) {
        throw new Error(validateError.message)
      }

      // Determine team category
      const category = classifyTeam(climber1, climber2)

      // Call edge function to create team (requires service role)
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/admin-create-team`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            teamId,
            teamName,
            password,
            climber1,
            climber2,
            category
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create team')
      }

      hideLoading()

      // Show success and credentials
      showTeamCredentials(teamId, password, teamName)

    } catch (error) {
      hideLoading()
      console.error('Error creating team:', error)
      errorContainer.innerHTML = `
        <div style="
          padding: 12px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 6px;
          color: #721c24;
        ">
          ${error.message}
        </div>
      `
    }
  })

  document.getElementById('cancel-create')?.addEventListener('click', () => {
    currentView = 'list'
    renderTeamManagement()
  })

  document.getElementById('back-to-list')?.addEventListener('click', () => {
    currentView = 'list'
    renderTeamManagement()
  })

  setupAdminHeader()
}

/**
 * Show team credentials after successful creation
 */
function showTeamCredentials(teamId, password, teamName) {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderHeader()}

      <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
        <!-- Success Card -->
        <div class="card" style="text-align: center;">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" style="margin-bottom: 16px;">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          <h2 style="color: #28a745; font-size: 24px; font-weight: 600; margin-bottom: 8px;">
            Team Created Successfully!
          </h2>
          <p style="color: var(--text-secondary); margin-bottom: 32px;">
            ${teamName} is ready to compete
          </p>

          <!-- Credentials Box -->
          <div style="
            background-color: #f6f8fa;
            border: 2px solid var(--color-primary);
            border-radius: 6px;
            padding: 24px;
            margin-bottom: 24px;
            text-align: left;
          ">
            <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
              🔑 Login Credentials
            </h3>
            <div style="margin-bottom: 12px;">
              <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 4px;">Team ID:</div>
              <code style="
                display: block;
                background-color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 16px;
                font-weight: 600;
              ">${teamId}</code>
            </div>
            <div style="margin-bottom: 12px;">
              <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 4px;">Password:</div>
              <code style="
                display: block;
                background-color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 16px;
                font-weight: 600;
              ">${password}</code>
            </div>
            <div>
              <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 4px;">Login URL:</div>
              <code style="
                display: block;
                background-color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 13px;
              ">${window.location.origin}/12qm25/#/login</code>
            </div>
          </div>

          <!-- Copy Button -->
          <button id="copy-credentials" class="btn btn-primary" style="width: 100%; margin-bottom: 12px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy Credentials to Clipboard
          </button>

          <!-- Done Button -->
          <button id="done-btn" class="btn" style="width: 100%;">
            Done - Back to Teams
          </button>
        </div>
      </div>
    </div>
  `

  // Copy credentials functionality
  document.getElementById('copy-credentials')?.addEventListener('click', () => {
    const text = `
Team Login Credentials
══════════════════════
Team ID:  ${teamId}
Password: ${password}
Login:    ${window.location.origin}/12qm25/#/login

Instructions:
1. Go to the login page
2. Enter your Team ID and Password
3. Complete verification
4. Click Sign In
    `.trim()

    navigator.clipboard.writeText(text)
    showSuccess('Credentials copied to clipboard!')
  })

  document.getElementById('done-btn')?.addEventListener('click', () => {
    currentView = 'list'
    renderTeamManagement()
  })

  setupAdminHeader()
}

/**
 * Render team detail view
 */
async function renderTeamDetail(teamId) {
  const app = document.querySelector('#app')

  // Fetch team details
  const { data: team, error } = await supabase
    .from('teams')
    .select(`
      *,
      climbers (*)
    `)
    .eq('id', teamId)
    .single()

  if (error) {
    showError('Error loading team details: ' + error.message)
    currentView = 'list'
    renderTeamManagement()
    return
  }

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderHeader()}

      <div style="max-width: 800px; margin: 0 auto; padding: 40px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <button id="back-to-list" class="btn">
            ← Back to Teams
          </button>
          <button id="edit-team-btn" class="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Team
          </button>
        </div>

        <!-- Team Info Card -->
        <div class="card" style="margin-bottom: 24px;">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 24px;">
            ${team.team_name}
          </h2>

          <!-- Credentials -->
          <div style="background-color: #f6f8fa; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <h3 style="color: var(--text-primary); font-size: 16px; font-weight: 600; margin-bottom: 12px;">
              🔑 Login Credentials
            </h3>
            <div style="margin-bottom: 8px;">
              <span style="color: var(--text-secondary);">Team ID:</span>
              <code style="background-color: white; padding: 2px 6px; border-radius: 3px; margin-left: 8px;">
                ${team.team_id}
              </code>
            </div>
            <div style="margin-bottom: 12px;">
              <span style="color: var(--text-secondary);">Password:</span>
              <span style="color: var(--text-secondary); font-style: italic; margin-left: 8px;">
                Contact admin to reset
              </span>
              <button id="reset-password-btn" class="btn" style="padding: 4px 8px; font-size: 12px; margin-left: 8px; opacity: 0.5;" disabled title="Feature temporarily disabled">
                Reset Password
              </button>
            </div>
          </div>

          <!-- Team Info -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
            <div>
              <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 4px;">Category</div>
              <span style="
                display: inline-block;
                padding: 4px 12px;
                background-color: ${getCategoryColor(team.category)};
                color: white;
                border-radius: 12px;
                font-size: 14px;
                text-transform: capitalize;
              ">
                ${team.category}
              </span>
            </div>
            <div>
              <div style="color: var(--text-secondary); font-size: 13px; margin-bottom: 4px;">Created</div>
              <div style="color: var(--text-primary);">${new Date(team.created_at).toLocaleString()}</div>
            </div>
          </div>

          <!-- Climbers -->
          <h3 style="color: var(--text-primary); font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Team Members
          </h3>
          ${team.climbers.map(climber => `
            <div style="
              background-color: #f6f8fa;
              padding: 12px 16px;
              border-radius: 6px;
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <div>
                <div style="font-weight: 500; color: var(--text-primary);">${climber.name}</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                  Age ${climber.age} • Grade ${climber.redpoint_grade} • ${climber.category}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `

  setupTeamDetailListeners(team)
}

/**
 * Setup team detail listeners
 */
function setupTeamDetailListeners(team) {
  document.getElementById('back-to-list')?.addEventListener('click', () => {
    currentView = 'list'
    renderTeamManagement()
  })

  document.getElementById('edit-team-btn')?.addEventListener('click', () => {
    showEditTeamModal(team)
  })

  document.getElementById('show-password')?.addEventListener('click', () => {
    const display = document.getElementById('password-display')
    const btn = document.getElementById('show-password')
    const isVisible = display.getAttribute('data-visible') === 'true'
    const actualPassword = display.getAttribute('data-password')

    if (isVisible) {
      // Hide password
      display.textContent = '••••••••'
      display.setAttribute('data-visible', 'false')
      btn.textContent = 'Show'
    } else {
      // Show actual password
      display.textContent = actualPassword
      display.setAttribute('data-visible', 'true')
      btn.textContent = 'Hide'
    }
  })

  document.getElementById('reset-password-btn')?.addEventListener('click', async () => {
    const newPassword = prompt('Enter new password (or leave blank for default 12qm2025):')
    const password = newPassword || '12qm2025'

    try {
      showLoading()

      // Call edge function to reset password (requires service role)
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/admin-reset-password`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: team.auth_user_id,
            newPassword: password,
            teamId: team.team_id
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password')
      }

      // Update password reset tracking
      await supabase
        .from('teams')
        .update({
          password_reset_count: (team.password_reset_count || 0) + 1,
          last_password_reset: new Date().toISOString()
        })
        .eq('id', team.id)

      hideLoading()
      showSuccess(`Password reset to: ${password}`)

      // Update the stored and displayed password
      const passwordDisplay = document.getElementById('password-display')
      if (passwordDisplay) {
        passwordDisplay.setAttribute('data-password', password)
        const isVisible = passwordDisplay.getAttribute('data-visible') === 'true'
        if (isVisible) {
          passwordDisplay.textContent = password
        }
      }

    } catch (error) {
      hideLoading()
      showError('Error resetting password: ' + error.message)
    }
  })

  setupAdminHeader()
}

/**
 * Show edit team modal
 */
function showEditTeamModal(team) {
  // Create modal overlay
  const modal = document.createElement('div')
  modal.id = 'edit-team-modal'
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  `

  modal.innerHTML = `
    <div class="card" style="
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin: 0;">
          Edit Team
        </h2>
        <button id="close-modal" class="btn" style="padding: 4px 12px;">
          ✕
        </button>
      </div>

      <form id="edit-team-form">
        <!-- Team Name -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
            Team Name
          </label>
          <input
            type="text"
            id="edit-team-name"
            value="${team.team_name}"
            required
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

        <!-- Team Category -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
            Team Category
          </label>
          <select
            id="edit-team-category"
            required
            style="
              width: 100%;
              padding: 8px 12px;
              border: 1px solid var(--border-primary);
              border-radius: 6px;
              font-size: 14px;
              box-sizing: border-box;
              background-color: var(--bg-secondary);
              cursor: pointer;
            "
          >
            <option value="recreational" ${team.category === 'recreational' ? 'selected' : ''}>Recreational</option>
            <option value="intermediate" ${team.category === 'intermediate' ? 'selected' : ''}>Intermediate</option>
            <option value="advanced" ${team.category === 'advanced' ? 'selected' : ''}>Advanced</option>
            <option value="masters" ${team.category === 'masters' ? 'selected' : ''}>Masters</option>
          </select>
        </div>

        <!-- Team ID (read-only) -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
            Team ID (cannot be changed)
          </label>
          <input
            type="text"
            value="${team.team_id}"
            disabled
            style="
              width: 100%;
              padding: 8px 12px;
              border: 1px solid var(--border-primary);
              border-radius: 6px;
              font-size: 14px;
              box-sizing: border-box;
              background-color: #f6f8fa;
              color: var(--text-secondary);
            "
          />
        </div>

        <!-- Climber 1 -->
        <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
          Climber 1
        </h3>
        <div style="background-color: #f6f8fa; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
              Name
            </label>
            <input
              type="text"
              id="edit-climber1-name"
              value="${team.climbers[0].name}"
              required
              style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border-primary);
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                background-color: white;
              "
            />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Age
              </label>
              <input
                type="number"
                id="edit-climber1-age"
                value="${team.climbers[0].age}"
                min="10"
                max="100"
                required
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: white;
                "
              />
            </div>
            <div>
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Grade (Ewbank)
              </label>
              <input
                type="number"
                id="edit-climber1-grade"
                value="${team.climbers[0].redpoint_grade}"
                min="10"
                max="35"
                required
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: white;
                "
              />
            </div>
          </div>
        </div>

        <!-- Climber 2 -->
        <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
          Climber 2
        </h3>
        <div style="background-color: #f6f8fa; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
              Name
            </label>
            <input
              type="text"
              id="edit-climber2-name"
              value="${team.climbers[1].name}"
              required
              style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border-primary);
                border-radius: 6px;
                font-size: 14px;
                box-sizing: border-box;
                background-color: white;
              "
            />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Age
              </label>
              <input
                type="number"
                id="edit-climber2-age"
                value="${team.climbers[1].age}"
                min="10"
                max="100"
                required
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: white;
                "
              />
            </div>
            <div>
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary);">
                Grade (Ewbank)
              </label>
              <input
                type="number"
                id="edit-climber2-grade"
                value="${team.climbers[1].redpoint_grade}"
                min="10"
                max="35"
                required
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid var(--border-primary);
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                  background-color: white;
                "
              />
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button type="button" id="cancel-edit" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  `

  document.body.appendChild(modal)

  // Setup event listeners
  const closeModal = () => {
    modal.remove()
  }

  document.getElementById('close-modal').addEventListener('click', closeModal)
  document.getElementById('cancel-edit').addEventListener('click', closeModal)

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  // Handle form submission
  document.getElementById('edit-team-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    await handleEditTeamSubmit(team, closeModal)
  })
}

/**
 * Handle edit team form submission
 */
async function handleEditTeamSubmit(originalTeam, closeModal) {
  try {
    showLoading('Saving changes...')

    // Get form values
    const teamName = document.getElementById('edit-team-name').value.trim()
    const teamCategory = document.getElementById('edit-team-category').value
    const climber1Name = document.getElementById('edit-climber1-name').value.trim()
    const climber1Age = parseInt(document.getElementById('edit-climber1-age').value)
    const climber1Grade = parseInt(document.getElementById('edit-climber1-grade').value)
    const climber2Name = document.getElementById('edit-climber2-name').value.trim()
    const climber2Age = parseInt(document.getElementById('edit-climber2-age').value)
    const climber2Grade = parseInt(document.getElementById('edit-climber2-grade').value)

    // Validate inputs
    if (!teamName || !climber1Name || !climber2Name) {
      throw new Error('All name fields are required')
    }

    if (climber1Age < 10 || climber1Age > 100 || climber2Age < 10 || climber2Age > 100) {
      throw new Error('Age must be between 10 and 100')
    }

    if (climber1Grade < 10 || climber1Grade > 35 || climber2Grade < 10 || climber2Grade > 35) {
      throw new Error('Grade must be between 10 and 35 (Ewbank)')
    }

    // Calculate individual climber categories
    const climber1IndividualCategory = classifyClimber(climber1Grade)
    const climber2IndividualCategory = classifyClimber(climber2Grade)

    // Update team name and category (from manual selection)
    const { error: teamError } = await supabase
      .from('teams')
      .update({ team_name: teamName, category: teamCategory })
      .eq('id', originalTeam.id)

    if (teamError) throw teamError

    // Update climber 1
    const { error: climber1Error } = await supabase
      .from('climbers')
      .update({
        name: climber1Name,
        age: climber1Age,
        redpoint_grade: climber1Grade,
        category: climber1IndividualCategory
      })
      .eq('id', originalTeam.climbers[0].id)

    if (climber1Error) throw climber1Error

    // Update climber 2
    const { error: climber2Error } = await supabase
      .from('climbers')
      .update({
        name: climber2Name,
        age: climber2Age,
        redpoint_grade: climber2Grade,
        category: climber2IndividualCategory
      })
      .eq('id', originalTeam.climbers[1].id)

    if (climber2Error) throw climber2Error

    hideLoading()
    showSuccess('Team updated successfully!')
    closeModal()

    // Reload team detail view
    await renderTeamDetail(originalTeam.id)

  } catch (error) {
    hideLoading()
    showError('Error updating team: ' + error.message)
  }
}

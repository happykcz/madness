/**
 * Admin Team Management Page
 *
 * Create teams with manual team IDs (e.g., Jeff_Peter, Alice_Bob)
 * Display credentials, reset passwords, view all teams
 */

import { router } from '../lib/router.js'
import { supabase } from '../lib/supabase.js'
import { showSuccess, showError, showLoading, hideLoading } from '../shared/ui-helpers.js'
import { classifyTeam } from '../shared/category-classifier.js'

let currentView = 'list' // 'list', 'create', 'view'
let selectedTeam = null

/**
 * Render team management page
 */
export async function renderTeamManagement() {
  const app = document.querySelector('#app')

  // Show loading
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: #fafbfc;">
      ${renderHeader()}
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
        <p style="color: #586069; margin-top: 16px;">Loading teams...</p>
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
 * Render header with navigation
 */
function renderHeader() {
  return `
    <div class="header" style="padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <img src="/12qm25/assets/cawa-logo.png" alt="CAWA" style="height: 40px;" />
        <h1 style="color: white; font-size: 18px; font-weight: 600; margin: 0;">
          Team Management
        </h1>
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <button id="back-to-dashboard" class="btn" style="background-color: #444d56; color: white;">
          ← Dashboard
        </button>
        <button id="admin-signout" class="btn" style="background-color: #444d56; color: white;">
          Sign Out
        </button>
      </div>
    </div>
  `
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
    <div class="min-h-screen" style="background-color: #fafbfc;">
      ${renderHeader()}

      <div style="max-width: 1280px; margin: 0 auto; padding: 40px 24px;">
        <!-- Page Title and Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h2 style="color: #24292e; font-size: 28px; font-weight: 600; margin-bottom: 8px;">
              Teams (${teams.length})
            </h2>
            <p style="color: #586069;">
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
      <div style="font-size: 64px; margin-bottom: 16px;">👥</div>
      <h3 style="color: #24292e; font-size: 20px; margin-bottom: 8px;">No teams yet</h3>
      <p style="color: #586069; margin-bottom: 24px;">
        Create your first team to get started with the competition
      </p>
      <button id="create-first-team" class="btn btn-primary">
        Create First Team
      </button>
    </div>
  `
}

/**
 * Render teams table
 */
function renderTeamsTable(teams) {
  return `
    <div class="card" style="padding: 0; overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #fafbfc; border-bottom: 1px solid #e1e4e8;">
            <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #24292e;">Team ID</th>
            <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #24292e;">Team Name</th>
            <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #24292e;">Category</th>
            <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #24292e;">Members</th>
            <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #24292e;">Created</th>
            <th style="padding: 12px 16px; text-align: right; font-weight: 600; color: #24292e;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${teams.map(team => `
            <tr style="border-bottom: 1px solid #e1e4e8;" class="team-row">
              <td style="padding: 12px 16px;">
                <code style="background-color: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-size: 13px;">
                  ${team.team_id}
                </code>
              </td>
              <td style="padding: 12px 16px; font-weight: 500;">${team.team_name}</td>
              <td style="padding: 12px 16px;">
                <span style="
                  display: inline-block;
                  padding: 2px 8px;
                  background-color: ${getCategoryColor(team.category)};
                  color: white;
                  border-radius: 12px;
                  font-size: 12px;
                  text-transform: capitalize;
                ">
                  ${team.category}
                </span>
              </td>
              <td style="padding: 12px 16px; color: #586069;">${team.climbers?.length || 0} climbers</td>
              <td style="padding: 12px 16px; color: #586069; font-size: 13px;">
                ${new Date(team.created_at).toLocaleDateString()}
              </td>
              <td style="padding: 12px 16px; text-align: right;">
                <button
                  class="btn-view-team"
                  data-team-id="${team.id}"
                  style="
                    padding: 6px 12px;
                    background-color: #0366d6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                  "
                >
                  View Details
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
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
    intermediate: '#0366d6',
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
    <div class="min-h-screen" style="background-color: #fafbfc;">
      ${renderHeader()}

      <div style="max-width: 800px; margin: 0 auto; padding: 40px 24px;">
        <!-- Back Button -->
        <button id="back-to-list" class="btn" style="margin-bottom: 24px;">
          ← Back to Teams
        </button>

        <!-- Form Card -->
        <div class="card">
          <h2 style="color: #24292e; font-size: 24px; font-weight: 600; margin-bottom: 24px;">
            Create New Team
          </h2>

          <form id="create-team-form">
            <!-- Team ID -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #24292e;">
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
                  border: 1px solid #d1d5da;
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
              />
              <p style="color: #586069; font-size: 12px; margin-top: 4px;">
                Used for login. 3-50 characters, alphanumeric and underscore only (e.g., Jeff_Peter, AliceAndBob)
              </p>
            </div>

            <!-- Team Name -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #24292e;">
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
                  border: 1px solid #d1d5da;
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
              />
            </div>

            <!-- Password -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #24292e;">
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
                  border: 1px solid #d1d5da;
                  border-radius: 6px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
              />
              <p style="color: #586069; font-size: 12px; margin-top: 4px;">
                Default: 12qm2025 (can be customized)
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 32px 0;" />

            <!-- Climber 1 -->
            <h3 style="color: #24292e; font-size: 18px; font-weight: 600; margin-bottom: 16px;">
              Climber 1
            </h3>

            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #24292e;">
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
                    border: 1px solid #d1d5da;
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #24292e;">
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
                    border: 1px solid #d1d5da;
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #24292e;">
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
                    border: 1px solid #d1d5da;
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
            </div>

            <!-- Climber 2 -->
            <h3 style="color: #24292e; font-size: 18px; font-weight: 600; margin-bottom: 16px;">
              Climber 2
            </h3>

            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 32px;">
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #24292e;">
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
                    border: 1px solid #d1d5da;
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #24292e;">
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
                    border: 1px solid #d1d5da;
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                  "
                />
              </div>
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #24292e;">
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
                    border: 1px solid #d1d5da;
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

  document.getElementById('back-to-dashboard')?.addEventListener('click', () => {
    router.navigate('/admin/dashboard')
  })

  document.getElementById('admin-signout')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    router.navigate('/')
  })
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

  document.getElementById('back-to-dashboard')?.addEventListener('click', () => {
    router.navigate('/admin/dashboard')
  })

  document.getElementById('admin-signout')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    router.navigate('/')
  })
}

/**
 * Show team credentials after successful creation
 */
function showTeamCredentials(teamId, password, teamName) {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: #fafbfc;">
      ${renderHeader()}

      <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
        <!-- Success Card -->
        <div class="card" style="text-align: center;">
          <div style="font-size: 64px; margin-bottom: 16px;">✅</div>
          <h2 style="color: #28a745; font-size: 24px; font-weight: 600; margin-bottom: 8px;">
            Team Created Successfully!
          </h2>
          <p style="color: #586069; margin-bottom: 32px;">
            ${teamName} is ready to compete
          </p>

          <!-- Credentials Box -->
          <div style="
            background-color: #f6f8fa;
            border: 2px solid #0366d6;
            border-radius: 6px;
            padding: 24px;
            margin-bottom: 24px;
            text-align: left;
          ">
            <h3 style="color: #24292e; font-size: 18px; font-weight: 600; margin-bottom: 16px;">
              🔑 Login Credentials
            </h3>
            <div style="margin-bottom: 12px;">
              <div style="color: #586069; font-size: 13px; margin-bottom: 4px;">Team ID:</div>
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
              <div style="color: #586069; font-size: 13px; margin-bottom: 4px;">Password:</div>
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
              <div style="color: #586069; font-size: 13px; margin-bottom: 4px;">Login URL:</div>
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
            📋 Copy Credentials to Clipboard
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

  document.getElementById('back-to-dashboard')?.addEventListener('click', () => {
    router.navigate('/admin/dashboard')
  })

  document.getElementById('admin-signout')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    router.navigate('/')
  })
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
    <div class="min-h-screen" style="background-color: #fafbfc;">
      ${renderHeader()}

      <div style="max-width: 800px; margin: 0 auto; padding: 40px 24px;">
        <button id="back-to-list" class="btn" style="margin-bottom: 24px;">
          ← Back to Teams
        </button>

        <!-- Team Info Card -->
        <div class="card" style="margin-bottom: 24px;">
          <h2 style="color: #24292e; font-size: 24px; font-weight: 600; margin-bottom: 24px;">
            ${team.team_name}
          </h2>

          <!-- Credentials -->
          <div style="background-color: #f6f8fa; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <h3 style="color: #24292e; font-size: 16px; font-weight: 600; margin-bottom: 12px;">
              🔑 Login Credentials
            </h3>
            <div style="margin-bottom: 8px;">
              <span style="color: #586069;">Team ID:</span>
              <code style="background-color: white; padding: 2px 6px; border-radius: 3px; margin-left: 8px;">
                ${team.team_id}
              </code>
            </div>
            <div style="margin-bottom: 12px;">
              <span style="color: #586069;">Password:</span>
              <span style="color: #586069; font-style: italic; margin-left: 8px;">
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
              <div style="color: #586069; font-size: 13px; margin-bottom: 4px;">Category</div>
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
              <div style="color: #586069; font-size: 13px; margin-bottom: 4px;">Created</div>
              <div style="color: #24292e;">${new Date(team.created_at).toLocaleString()}</div>
            </div>
          </div>

          <!-- Climbers -->
          <h3 style="color: #24292e; font-size: 16px; font-weight: 600; margin-bottom: 12px;">
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
                <div style="font-weight: 500; color: #24292e;">${climber.name}</div>
                <div style="font-size: 13px; color: #586069;">
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

  document.getElementById('back-to-dashboard')?.addEventListener('click', () => {
    router.navigate('/admin/dashboard')
  })

  document.getElementById('admin-signout')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    router.navigate('/')
  })
}

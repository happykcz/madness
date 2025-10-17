/**
 * Admin Leaderboard Nudge Management
 *
 * Send manual nudges/announcements to teams
 * View nudge history and auto-nudge status
 */

import { supabase } from '../lib/supabase.js'
import { renderAdminHeader, setupAdminHeader } from './admin-header.js'
import { showError, showSuccess } from '../shared/ui-helpers.js'

/**
 * Render nudge management page
 */
export async function renderNudgeManagement() {
  const app = document.querySelector('#app')

  // Show loading
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderAdminHeader({ title: 'Leaderboard Nudges', currentPage: 'nudge' })}
      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <p style="color: var(--text-secondary); text-align: center;">Loading nudge settings...</p>
      </main>
    </div>
  `

  try {
    // Fetch competition settings for auto-nudge config
    const { data: settings, error: settingsError } = await supabase
      .from('competition_settings')
      .select('*')
      .single()

    if (settingsError) throw settingsError

    // Fetch recent nudges
    const { data: nudges, error: nudgesError } = await supabase
      .from('leaderboard_nudges')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(10)

    const recentNudges = nudgesError ? [] : nudges

    renderNudgeContent(settings, recentNudges)
  } catch (error) {
    console.error('Error loading nudge settings:', error)
    showError('Failed to load nudge settings')
  }
}

/**
 * Render nudge management content
 */
function renderNudgeContent(settings, recentNudges) {
  const app = document.querySelector('#app')

  const lastAutoNudge = settings?.last_auto_nudge_sent
    ? new Date(settings.last_auto_nudge_sent).toLocaleString()
    : 'Never'

  app.innerHTML = `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      ${renderAdminHeader({ title: 'Leaderboard Nudges', currentPage: 'nudge' })}

      <main class="container" style="padding-top: 24px; padding-bottom: 32px;">
        <!-- Page Header -->
        <div class="page-header" style="margin-bottom: 24px;">
          <div style="flex: 1 1 auto;">
            <h2 class="page-title">Leaderboard Nudges & Announcements</h2>
            <p style="color: var(--text-secondary); font-size: 14px;">
              Send manual nudges or announcements to all teams
            </p>
          </div>
        </div>

        <!-- Auto-Nudge Status Card -->
        <div class="card gradient-primary" style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
            <div>
              <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px; opacity: 0.9;">
                Auto-Nudge Status
              </h3>
              <p style="font-size: 13px; opacity: 0.8;">
                Automatic nudges every ${settings?.nudge_interval_hours || 3} hours during competition
              </p>
            </div>
            <div style="
              padding: 4px 12px;
              border-radius: 20px;
              background: ${settings?.auto_nudge_enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
              font-size: 12px;
              font-weight: 600;
            ">
              ${settings?.auto_nudge_enabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <div style="font-size: 13px; opacity: 0.9;">
            <strong>Last auto-nudge:</strong> ${lastAutoNudge}
          </div>
          <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">
            <strong>Next scheduled:</strong> ${getNextAutoNudgeTime(settings)}
          </div>
        </div>

        <!-- Send Manual Nudge Card -->
        <div class="card" style="margin-bottom: 24px;">
          <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
            Send Manual Nudge
          </h3>

          <form id="nudge-form">
            <!-- Message Input -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; color: var(--text-secondary); font-size: 13px; margin-bottom: 6px;">
                Message *
              </label>
              <textarea
                id="nudge-message"
                class="form-input"
                rows="3"
                placeholder="e.g., 'Check out the current standings!' or 'Lunch break in 30 minutes!'"
                required
                style="width: 100%; resize: vertical;"
              ></textarea>
              <div style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
                This message will be shown to all teams
              </div>
            </div>

            <!-- Show Leaderboard Toggle -->
            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input
                  type="checkbox"
                  id="show-leaderboard"
                  style="width: 18px; height: 18px; margin-right: 8px;"
                />
                <span style="color: var(--text-primary); font-size: 14px;">
                  Show leaderboard with nudge
                </span>
              </label>
              <div style="color: var(--text-secondary); font-size: 12px; margin-top: 4px; margin-left: 26px;">
                When enabled, shows top 3 teams + team's current position
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary btn-inline btn-center" style="width: 100%;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                <path d="M22 2L11 13"/>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
              Send Nudge Now
            </button>
          </form>
        </div>

        <!-- Recent Nudges History -->
        <div class="card">
          <h3 style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 16px;">
            Recent Nudges
          </h3>

          <div id="recent-nudges-list">
            ${renderNudgesList(recentNudges)}
          </div>
        </div>
      </main>
    </div>
  `

  setupNudgeListeners()
}

/**
 * Render nudges list
 */
function renderNudgesList(nudges) {
  if (!nudges || nudges.length === 0) {
    return `
      <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
        No nudges sent yet
      </p>
    `
  }

  return nudges.map(nudge => `
    <div class="nudge-item" style="
      border: 1px solid var(--border-secondary);
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 12px;
      background: var(--bg-secondary);
    ">
      <!-- Row 1: Type, Status, Delete Button -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            background: ${nudge.nudge_type === 'auto' ? 'var(--bg-tertiary)' : '#dbeafe'};
            color: ${nudge.nudge_type === 'auto' ? 'var(--text-secondary)' : '#1e40af'};
          ">
            ${nudge.nudge_type.toUpperCase()}
          </span>
          <span style="
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            background: ${nudge.is_active ? '#d1fae5' : '#fee2e2'};
            color: ${nudge.is_active ? '#065f46' : '#991b1b'};
          ">
            ${nudge.is_active ? 'Active' : 'Inactive'}
          </span>
          ${nudge.show_leaderboard ? `
            <span title="Shows leaderboard" style="color: var(--color-primary);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            </span>
          ` : ''}
        </div>
        <button
          class="delete-nudge-btn"
          data-nudge-id="${nudge.id}"
          style="
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s;
          "
          onmouseover="this.style.background='#fee2e2'; this.style.color='#dc2626'"
          onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)'"
          title="Delete nudge"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>

      <!-- Row 2: Message -->
      <div style="color: var(--text-primary); font-size: 14px; margin-bottom: 8px; line-height: 1.4;">
        ${nudge.message}
      </div>

      <!-- Row 3: Timestamp -->
      <div style="color: var(--text-secondary); font-size: 12px;">
        ${new Date(nudge.sent_at).toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  `).join('')
}

/**
 * Calculate next auto-nudge time
 */
function getNextAutoNudgeTime(settings) {
  if (!settings?.auto_nudge_enabled) {
    return 'Disabled'
  }

  // Next nudge times: 9am, 12pm, 3pm (every 3 hours from 6am, excluding 6pm)
  const now = new Date()
  const nudgeTimes = [9, 12, 15] // 9am, 12pm, 3pm

  const currentHour = now.getHours()
  const nextHour = nudgeTimes.find(h => h > currentHour)

  if (nextHour) {
    const next = new Date(now)
    next.setHours(nextHour, 0, 0, 0)
    return next.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // If past 3pm today, show tomorrow's 9am
  return 'Tomorrow 9:00 AM'
}

/**
 * Refresh only the recent nudges list
 */
async function refreshNudgesList() {
  try {
    const { data: nudges, error } = await supabase
      .from('leaderboard_nudges')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(10)

    if (error) throw error

    const listContainer = document.getElementById('recent-nudges-list')
    if (listContainer) {
      listContainer.innerHTML = renderNudgesList(nudges || [])
      setupDeleteListeners()
    }
  } catch (error) {
    console.error('Error refreshing nudges list:', error)
    showError('Failed to refresh nudges list')
  }
}

/**
 * Delete a nudge
 */
async function deleteNudge(nudgeId) {
  try {
    const { error } = await supabase
      .from('leaderboard_nudges')
      .delete()
      .eq('id', nudgeId)

    if (error) throw error

    showSuccess('Nudge deleted successfully')
    return true
  } catch (error) {
    console.error('Error deleting nudge:', error)
    showError('Failed to delete nudge: ' + error.message)
    return false
  }
}

/**
 * Setup delete button listeners
 */
function setupDeleteListeners() {
  document.querySelectorAll('.delete-nudge-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const nudgeId = e.currentTarget.getAttribute('data-nudge-id')

      if (confirm('Delete this nudge? Teams who haven\'t dismissed it will no longer see it.')) {
        const success = await deleteNudge(nudgeId)
        if (success) {
          await refreshNudgesList()
        }
      }
    })
  })
}

/**
 * Setup event listeners
 */
function setupNudgeListeners() {
  setupAdminHeader()

  // Handle nudge form submission
  const form = document.getElementById('nudge-form')
  form?.addEventListener('submit', async (e) => {
    e.preventDefault()

    const message = document.getElementById('nudge-message').value.trim()
    const showLeaderboard = document.getElementById('show-leaderboard').checked

    if (!message) {
      showError('Please enter a message')
      return
    }

    try {
      const { error } = await supabase
        .from('leaderboard_nudges')
        .insert({
          message,
          nudge_type: 'manual',
          show_leaderboard: showLeaderboard,
          sent_by: (await supabase.auth.getUser()).data.user?.id
        })

      if (error) throw error

      showSuccess('Nudge sent successfully!')

      // Clear form
      form.reset()

      // Refresh only the nudge list (not full page)
      setTimeout(() => refreshNudgesList(), 500)
    } catch (error) {
      console.error('Error sending nudge:', error)
      showError('Failed to send nudge: ' + error.message)
    }
  })

  // Setup delete button listeners for initial load
  setupDeleteListeners()
}

export default {
  renderNudgeManagement
}

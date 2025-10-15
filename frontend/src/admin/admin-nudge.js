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
        <div style="margin-bottom: 24px;">
          <h2 style="color: var(--text-primary); font-size: 24px; font-weight: 600; margin-bottom: 8px;">
            Leaderboard Nudges & Announcements
          </h2>
          <p style="color: var(--text-secondary); font-size: 14px;">
            Send manual nudges or announcements to all teams
          </p>
        </div>

        <!-- Auto-Nudge Status Card -->
        <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
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
            <button type="submit" class="btn btn-primary" style="width: 100%;">
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

          ${recentNudges.length > 0 ? `
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-secondary);">
                    <th style="padding: 8px; text-align: left; color: var(--text-secondary); font-size: 12px; font-weight: 500;">Time</th>
                    <th style="padding: 8px; text-align: left; color: var(--text-secondary); font-size: 12px; font-weight: 500;">Type</th>
                    <th style="padding: 8px; text-align: left; color: var(--text-secondary); font-size: 12px; font-weight: 500;">Message</th>
                    <th style="padding: 8px; text-align: center; color: var(--text-secondary); font-size: 12px; font-weight: 500;">Leaderboard</th>
                    <th style="padding: 8px; text-align: center; color: var(--text-secondary); font-size: 12px; font-weight: 500;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentNudges.map(nudge => `
                    <tr style="border-bottom: 1px solid var(--border-tertiary);">
                      <td style="padding: 12px 8px; color: var(--text-secondary); font-size: 13px;">
                        ${new Date(nudge.sent_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style="padding: 12px 8px;">
                        <span style="
                          padding: 2px 8px;
                          border-radius: 12px;
                          font-size: 11px;
                          font-weight: 600;
                          background: ${nudge.nudge_type === 'auto' ? 'var(--bg-tertiary)' : '#dbeafe'};
                          color: ${nudge.nudge_type === 'auto' ? 'var(--text-secondary)' : '#1e40af'};
                        ">
                          ${nudge.nudge_type.toUpperCase()}
                        </span>
                      </td>
                      <td style="padding: 12px 8px; color: var(--text-primary); font-size: 14px;">
                        ${nudge.message}
                      </td>
                      <td style="padding: 12px 8px; text-align: center;">
                        ${nudge.show_leaderboard ?
                          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' :
                          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                        }
                      </td>
                      <td style="padding: 12px 8px; text-align: center;">
                        <span style="
                          padding: 2px 8px;
                          border-radius: 12px;
                          font-size: 11px;
                          font-weight: 600;
                          background: ${nudge.is_active ? '#d1fae5' : '#fee2e2'};
                          color: ${nudge.is_active ? '#065f46' : '#991b1b'};
                        ">
                          ${nudge.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <p style="color: var(--text-secondary); text-align: center; padding: 24px;">
              No nudges sent yet
            </p>
          `}
        </div>
      </main>
    </div>
  `

  setupNudgeListeners()
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

      // Reload page to show new nudge
      setTimeout(() => renderNudgeManagement(), 1000)
    } catch (error) {
      console.error('Error sending nudge:', error)
      showError('Failed to send nudge: ' + error.message)
    }
  })
}

export default {
  renderNudgeManagement
}

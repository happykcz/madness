/**
 * Admin Competition Control Interface
 * Clean design matching scoring page style
 */

import { supabase } from '../lib/supabase.js'
import { router } from '../lib/router.js'
import { showSuccess, showError, showWarning } from '../shared/ui-helpers.js'

export async function renderCompetitionControl() {
  const app = document.getElementById('app')

  app.innerHTML = `
    <div style="min-height: 100vh; background-color: var(--bg-primary);">
      <!-- Header -->
      <header class="header" style="padding: 12px 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h1 style="color: white; font-size: 18px; font-weight: 600; margin: 0;">
            Competition Control
          </h1>
          <button id="back-to-dashboard" class="btn btn-secondary" style="font-size: 13px; padding: 6px 12px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        </div>
      </header>

      <main class="container" style="padding: 16px 16px 32px;">

        <!-- Current Status Card -->
        <div class="card" style="margin-bottom: 16px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h2 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0;">
              Current Status
            </h2>
            <button id="refresh-btn" class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px; display: flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              Refresh
            </button>
          </div>

          <!-- Status Display -->
          <div id="status-display">
            <div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 13px;">
              Loading...
            </div>
          </div>
        </div>

        <!-- Manual Control Card -->
        <div class="card" style="margin-bottom: 16px; padding: 16px;">
          <h2 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">
            Manual Control
          </h2>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <button id="btn-open" class="btn" style="
              background-color: #28a745;
              color: white;
              border: none;
              padding: 10px;
              font-size: 13px;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v12M6 12h12"/>
              </svg>
              Open
            </button>

            <button id="btn-close" class="btn" style="
              background-color: #dc3545;
              color: white;
              border: none;
              padding: 10px;
              font-size: 13px;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6M9 9l6 6"/>
              </svg>
              Close
            </button>
          </div>

          <div style="
            padding: 8px 10px;
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            border-radius: 4px;
            font-size: 11px;
            color: #856404;
            line-height: 1.4;
          ">
            <strong>Note:</strong> Manual control overrides automatic window timing
          </div>
        </div>

        <!-- Scoring Window Times Card -->
        <div class="card" style="padding: 16px;">
          <h2 style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">
            Scoring Window Times
          </h2>

          <form id="window-form">
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 12px;">

              <!-- Start Time -->
              <div>
                <label style="display: block; font-size: 12px; font-weight: 500; color: var(--text-primary); margin-bottom: 4px;">
                  Competition Start (AWST)
                </label>
                <input
                  type="datetime-local"
                  id="comp-start"
                  required
                  class="form-input"
                  style="width: 100%; padding: 8px; font-size: 13px; border: 1px solid var(--border-primary); border-radius: 4px; background-color: var(--bg-secondary);"
                />
              </div>

              <!-- End Time -->
              <div>
                <label style="display: block; font-size: 12px; font-weight: 500; color: var(--text-primary); margin-bottom: 4px;">
                  Competition End (AWST)
                </label>
                <input
                  type="datetime-local"
                  id="comp-end"
                  required
                  class="form-input"
                  style="width: 100%; padding: 8px; font-size: 13px; border: 1px solid var(--border-primary); border-radius: 4px; background-color: var(--bg-secondary);"
                />
              </div>

            </div>

            <button type="submit" class="btn btn-primary" style="
              width: 100%;
              padding: 10px;
              font-size: 13px;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Window Times
            </button>
          </form>
        </div>

      </main>
    </div>

    <style>
      @media (min-width: 640px) {
        #window-form > div {
          grid-template-columns: 1fr 1fr !important;
        }
      }
    </style>
  `

  setupListeners()
  await loadStatus()
}

async function loadStatus() {
  const statusDisplay = document.getElementById('status-display')

  try {
    const { data: settings, error } = await supabase
      .from('competition_settings')
      .select('*')
      .single()

    if (error) throw error

    const now = new Date()
    const start = new Date(settings.competition_start)
    const end = new Date(settings.competition_end)

    const isInWindow = now >= start && now <= end
    const isActive = settings.is_open || isInWindow

    // Format times
    const formatTime = (date) => {
      return new Date(date).toLocaleString('en-AU', {
        timeZone: 'Australia/Perth',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }

    // Populate form
    const toLocalString = (date) => {
      const d = new Date(date)
      const offset = d.getTimezoneOffset() * 60000
      return new Date(d.getTime() - offset).toISOString().slice(0, 16)
    }

    document.getElementById('comp-start').value = toLocalString(settings.competition_start)
    document.getElementById('comp-end').value = toLocalString(settings.competition_end)

    // Render status
    const statusColor = isActive ? '#28a745' : '#dc3545'
    const statusText = isActive ? 'OPEN' : 'CLOSED'
    const statusIcon = isActive
      ? '<circle cx="12" cy="12" r="10" fill="#28a745"/>'
      : '<circle cx="12" cy="12" r="10" fill="#dc3545"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" stroke-width="2"/>'

    const statusReason = settings.is_open
      ? 'Manually opened by admin'
      : isInWindow ? 'Within scheduled window' : 'Outside scheduled window'

    statusDisplay.innerHTML = `
      <!-- Main Status -->
      <div style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background-color: ${isActive ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'};
        border: 2px solid ${statusColor};
        border-radius: 6px;
        margin-bottom: 12px;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          ${statusIcon}
        </svg>
        <div style="flex: 1;">
          <div style="font-size: 18px; font-weight: 700; color: ${statusColor};">
            ${statusText}
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
            ${statusReason}
          </div>
        </div>
      </div>

      <!-- Details Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <div style="padding: 10px; background-color: var(--bg-secondary); border-radius: 4px;">
          <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">
            Manual Override
          </div>
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
            ${settings.is_open ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div style="padding: 10px; background-color: var(--bg-secondary); border-radius: 4px;">
          <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 4px; text-transform: uppercase; font-weight: 600;">
            Scheduled Window
          </div>
          <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
            ${isInWindow ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      <!-- Window Times -->
      <div style="padding: 10px; background-color: var(--bg-secondary); border-radius: 4px;">
        <div style="font-size: 10px; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; font-weight: 600;">
          Scheduled Times
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">Start:</span>
            <span style="color: var(--text-primary); font-weight: 500;">${formatTime(settings.competition_start)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">End:</span>
            <span style="color: var(--text-primary); font-weight: 500;">${formatTime(settings.competition_end)}</span>
          </div>
        </div>
      </div>
    `

  } catch (error) {
    console.error('Error loading status:', error)
    statusDisplay.innerHTML = `
      <div style="padding: 12px; background-color: rgba(220,53,69,0.1); border: 1px solid #dc3545; border-radius: 4px; color: #dc3545; font-size: 12px;">
        Error loading status: ${error.message}
      </div>
    `
  }
}

async function openCompetition() {
  try {
    const { data: settings, error: fetchError } = await supabase
      .from('competition_settings')
      .select('id')
      .single()

    if (fetchError) throw fetchError

    const { error: updateError } = await supabase
      .from('competition_settings')
      .update({ is_open: true, updated_at: new Date().toISOString() })
      .eq('id', settings.id)

    if (updateError) throw updateError

    showSuccess('Competition opened successfully')
    await loadStatus()

  } catch (error) {
    console.error('Error opening competition:', error)
    showError('Failed to open competition: ' + error.message)
  }
}

async function closeCompetition() {
  try {
    const { data: settings, error: fetchError } = await supabase
      .from('competition_settings')
      .select('id')
      .single()

    if (fetchError) throw fetchError

    const { error: updateError } = await supabase
      .from('competition_settings')
      .update({ is_open: false, updated_at: new Date().toISOString() })
      .eq('id', settings.id)

    if (updateError) throw updateError

    showSuccess('Competition closed successfully')
    await loadStatus()

  } catch (error) {
    console.error('Error closing competition:', error)
    showError('Failed to close competition: ' + error.message)
  }
}

async function updateWindowTimes(e) {
  e.preventDefault()

  const startInput = document.getElementById('comp-start').value
  const endInput = document.getElementById('comp-end').value

  if (!startInput || !endInput) {
    showWarning('Please fill in both start and end times')
    return
  }

  const start = new Date(startInput)
  const end = new Date(endInput)

  if (end <= start) {
    showWarning('End time must be after start time')
    return
  }

  try {
    const { data: settings, error: fetchError } = await supabase
      .from('competition_settings')
      .select('id')
      .single()

    if (fetchError) throw fetchError

    const { error: updateError } = await supabase
      .from('competition_settings')
      .update({
        competition_start: start.toISOString(),
        competition_end: end.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', settings.id)

    if (updateError) throw updateError

    showSuccess('Window times updated successfully')
    await loadStatus()

  } catch (error) {
    console.error('Error updating window times:', error)
    showError('Failed to update times: ' + error.message)
  }
}

function setupListeners() {
  document.getElementById('back-to-dashboard')?.addEventListener('click', () => {
    router.navigate('/admin/dashboard')
  })

  document.getElementById('refresh-btn')?.addEventListener('click', loadStatus)
  document.getElementById('btn-open')?.addEventListener('click', openCompetition)
  document.getElementById('btn-close')?.addEventListener('click', closeCompetition)
  document.getElementById('window-form')?.addEventListener('submit', updateWindowTimes)
}

/**
 * Admin Competition Control Interface
 * Allows admins to:
 * - View current competition status
 * - Manually open/close competition
 * - Set scoring window times
 */

import { supabase } from '../lib/supabase.js'
import { router } from '../lib/router.js'

export async function renderCompetitionControl() {
  const app = document.getElementById('app')
  
  app.innerHTML = `
    <div style="min-height: 100vh; background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%); padding: 24px;">
      <div style="max-width: 1000px; margin: 0 auto;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h1 style="margin: 0 0 8px 0; color: var(--text-primary); font-size: 28px; font-weight: 700;">
              Competition Control
            </h1>
            <p style="margin: 0; color: var(--text-secondary); font-size: 14px;">
              Manage competition status and scoring windows
            </p>
          </div>
          
          <button id="back-to-dashboard" style="
            padding: 10px 20px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            border: 1px solid var(--border-primary);
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
        </div>

        <!-- Current Status Card -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: var(--text-primary); font-size: 20px; font-weight: 600;">
              Current Status
            </h2>
            <button id="refresh-status" style="
              padding: 8px 16px;
              background: var(--bg-primary);
              color: var(--text-primary);
              border: 1px solid var(--border-primary);
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 6px;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              Refresh
            </button>
          </div>
          
          <div id="status-display" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
              Loading status...
            </div>
          </div>
        </div>

        <!-- Manual Control Card -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 20px 0; color: var(--text-primary); font-size: 20px; font-weight: 600;">
            Manual Control
          </h2>
          
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button id="btn-open-competition" style="
              flex: 1;
              min-width: 200px;
              padding: 14px 20px;
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 2px 8px rgba(40,167,69,0.3);
            ">
              🟢 Open Competition
            </button>
            
            <button id="btn-close-competition" style="
              flex: 1;
              min-width: 200px;
              padding: 14px 20px;
              background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 2px 8px rgba(220,53,69,0.3);
            ">
              🔴 Close Competition
            </button>
          </div>
          
          <div style="margin-top: 16px; padding: 12px; background: var(--bg-primary); border-radius: 6px; border-left: 3px solid #ffc107;">
            <p style="margin: 0; font-size: 13px; color: var(--text-secondary);">
              <strong>Note:</strong> Manual open/close overrides automatic window timing. Teams will be able to log sends regardless of scheduled times when manually opened.
            </p>
          </div>
        </div>

        <!-- Scoring Window Settings Card -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 20px 0; color: var(--text-primary); font-size: 20px; font-weight: 600;">
            Scoring Window Times
          </h2>
          
          <form id="window-settings-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              
              <!-- Start Time -->
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                  Competition Start (AWST)
                </label>
                <input
                  type="datetime-local"
                  id="competition-start"
                  required
                  style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-primary); border-radius: 6px; font-size: 14px; box-sizing: border-box; background: var(--bg-primary);"
                />
                <p style="margin: 6px 0 0 0; font-size: 12px; color: var(--text-secondary);">
                  When the scoring window opens
                </p>
              </div>
              
              <!-- End Time -->
              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 8px; color: var(--text-primary); font-size: 14px;">
                  Competition End (AWST)
                </label>
                <input
                  type="datetime-local"
                  id="competition-end"
                  required
                  style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-primary); border-radius: 6px; font-size: 14px; box-sizing: border-box; background: var(--bg-primary);"
                />
                <p style="margin: 6px 0 0 0; font-size: 12px; color: var(--text-secondary);">
                  When the scoring window closes
                </p>
              </div>
              
            </div>
            
            <button type="submit" style="
              width: 100%;
              padding: 14px 20px;
              background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 2px 8px rgba(0,123,255,0.3);
            ">
              💾 Save Window Times
            </button>
          </form>
        </div>

      </div>
    </div>
  `

  // Setup event listeners
  setupCompetitionListeners()
  
  // Load initial status
  await loadCompetitionStatus()
}

async function loadCompetitionStatus() {
  const statusDisplay = document.getElementById('status-display')
  
  try {
    // Fetch competition settings
    const { data: settings, error } = await supabase
      .from('competition_settings')
      .select('*')
      .single()
    
    if (error) throw error
    
    // Calculate current status
    const now = new Date()
    const start = new Date(settings.competition_start)
    const end = new Date(settings.competition_end)
    
    const isInWindow = now >= start && now <= end
    const isActive = settings.is_open || isInWindow
    
    // Format times for display
    const formatDateTime = (date) => {
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
    
    // Populate form fields (convert to local datetime-local format)
    const toLocalDateTimeString = (date) => {
      const d = new Date(date)
      const offset = d.getTimezoneOffset() * 60000
      const localDate = new Date(d.getTime() - offset)
      return localDate.toISOString().slice(0, 16)
    }
    
    document.getElementById('competition-start').value = toLocalDateTimeString(settings.competition_start)
    document.getElementById('competition-end').value = toLocalDateTimeString(settings.competition_end)
    
    // Render status display
    statusDisplay.innerHTML = `
      <!-- Overall Status -->
      <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: ${isActive ? 'linear-gradient(135deg, rgba(40,167,69,0.1) 0%, rgba(32,201,151,0.1) 100%)' : 'linear-gradient(135deg, rgba(220,53,69,0.1) 0%, rgba(200,35,51,0.1) 100%)'}; border-radius: 8px; border: 2px solid ${isActive ? '#28a745' : '#dc3545'};">
        <div style="font-size: 48px;">
          ${isActive ? '🟢' : '🔴'}
        </div>
        <div style="flex: 1;">
          <div style="font-size: 24px; font-weight: 700; color: ${isActive ? '#28a745' : '#dc3545'}; margin-bottom: 4px;">
            ${isActive ? 'OPEN' : 'CLOSED'}
          </div>
          <div style="font-size: 14px; color: var(--text-secondary);">
            ${settings.is_open ? 'Manually opened by admin' : isInWindow ? 'Within scheduled window' : 'Outside scheduled window'}
          </div>
        </div>
      </div>
      
      <!-- Details Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
        
        <!-- Manual Override -->
        <div style="padding: 16px; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border-primary);">
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; text-transform: uppercase; font-weight: 600;">
            Manual Override
          </div>
          <div style="font-size: 18px; font-weight: 600; color: var(--text-primary);">
            ${settings.is_open ? '✅ Active' : '❌ Inactive'}
          </div>
        </div>
        
        <!-- Scheduled Window -->
        <div style="padding: 16px; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border-primary);">
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; text-transform: uppercase; font-weight: 600;">
            Scheduled Window
          </div>
          <div style="font-size: 18px; font-weight: 600; color: var(--text-primary);">
            ${isInWindow ? '✅ Active' : '❌ Inactive'}
          </div>
        </div>
        
      </div>
      
      <!-- Window Times -->
      <div style="padding: 16px; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border-primary);">
        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; text-transform: uppercase; font-weight: 600;">
          Scheduled Window Times
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--text-secondary); font-size: 14px;">Start:</span>
            <span style="color: var(--text-primary); font-weight: 500; font-size: 14px;">${formatDateTime(settings.competition_start)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--text-secondary); font-size: 14px;">End:</span>
            <span style="color: var(--text-primary); font-weight: 500; font-size: 14px;">${formatDateTime(settings.competition_end)}</span>
          </div>
        </div>
      </div>
    `
    
  } catch (error) {
    console.error('Error loading competition status:', error)
    statusDisplay.innerHTML = `
      <div style="padding: 16px; background: rgba(220,53,69,0.1); border-radius: 8px; border: 1px solid #dc3545; color: #dc3545;">
        ❌ Error loading status: ${error.message}
      </div>
    `
  }
}

async function openCompetition() {
  try {
    // Get settings ID first
    const { data: settings, error: fetchError } = await supabase
      .from('competition_settings')
      .select('id')
      .single()

    if (fetchError) throw fetchError

    // Update the settings
    const { error: updateError } = await supabase
      .from('competition_settings')
      .update({ is_open: true, updated_at: new Date().toISOString() })
      .eq('id', settings.id)

    if (updateError) throw updateError

    showNotification('✅ Competition opened successfully', 'success')
    await loadCompetitionStatus()

  } catch (error) {
    console.error('Error opening competition:', error)
    showNotification('❌ Error opening competition: ' + error.message, 'error')
  }
}

async function closeCompetition() {
  try {
    // Get settings ID first
    const { data: settings, error: fetchError } = await supabase
      .from('competition_settings')
      .select('id')
      .single()

    if (fetchError) throw fetchError

    // Update the settings
    const { error: updateError } = await supabase
      .from('competition_settings')
      .update({ is_open: false, updated_at: new Date().toISOString() })
      .eq('id', settings.id)

    if (updateError) throw updateError

    showNotification('✅ Competition closed successfully', 'success')
    await loadCompetitionStatus()

  } catch (error) {
    console.error('Error closing competition:', error)
    showNotification('❌ Error closing competition: ' + error.message, 'error')
  }
}

async function updateWindowTimes(e) {
  e.preventDefault()
  
  const startInput = document.getElementById('competition-start').value
  const endInput = document.getElementById('competition-end').value
  
  if (!startInput || !endInput) {
    showNotification('⚠️ Please fill in both start and end times', 'warning')
    return
  }
  
  const start = new Date(startInput)
  const end = new Date(endInput)
  
  if (end <= start) {
    showNotification('⚠️ End time must be after start time', 'warning')
    return
  }
  
  try {
    // Get settings ID first
    const { data: settings, error: fetchError } = await supabase
      .from('competition_settings')
      .select('id')
      .single()

    if (fetchError) throw fetchError

    // Update the window times
    const { error: updateError } = await supabase
      .from('competition_settings')
      .update({
        competition_start: start.toISOString(),
        competition_end: end.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', settings.id)

    if (updateError) throw updateError

    showNotification('✅ Window times updated successfully', 'success')
    await loadCompetitionStatus()

  } catch (error) {
    console.error('Error updating window times:', error)
    showNotification('❌ Error updating times: ' + error.message, 'error')
  }
}

function setupCompetitionListeners() {
  // Back button
  document.getElementById('back-to-dashboard')?.addEventListener('click', () => {
    router.navigate('/admin/dashboard')
  })
  
  // Refresh button
  document.getElementById('refresh-status')?.addEventListener('click', loadCompetitionStatus)
  
  // Manual control buttons
  document.getElementById('btn-open-competition')?.addEventListener('click', openCompetition)
  document.getElementById('btn-close-competition')?.addEventListener('click', closeCompetition)
  
  // Window settings form
  document.getElementById('window-settings-form')?.addEventListener('submit', updateWindowTimes)
}

function showNotification(message, type = 'info') {
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  }
  
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${colors[type]};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

/**
 * Shared Admin Header Component
 *
 * Unified header with dropdown navigation to reduce button clutter
 */

import { router } from '../lib/router.js'
import { supabase } from '../lib/supabase.js'

/**
 * Render admin header with dropdown navigation
 * @param {Object} options - Configuration options
 * @param {string} options.title - Page title
 * @param {string} options.currentPage - Current page identifier for active state
 */
export function renderAdminHeader(options = {}) {
  const {
    title = 'Admin Portal',
    currentPage = 'dashboard'
  } = options

  // Send icon
  const sendIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M22 2L11 13"/>
    <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>`

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: homeIcon },
    { id: 'teams', label: 'Team Management', path: '/admin/teams', icon: usersIcon },
    { id: 'leaderboards', label: 'Leaderboards', path: '/admin/leaderboards', icon: trophyIcon },
    { id: 'bonus', label: 'Bonus Games', path: '/admin/bonus', icon: starIcon },
    { id: 'nudge', label: 'Leaderboard Nudges', path: '/admin/nudge', icon: sendIcon },
    { id: 'competition', label: 'Competition Control', path: '/admin/competition', icon: settingsIcon }
  ]

  const currentNav = navItems.find(item => item.id === currentPage)
  const dropdownIcon = currentNav ? currentNav.icon : homeIcon

  return `
    <header class="header" style="padding: 12px 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <!-- Left: Logo + Title -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="/12qm25/assets/cawa-logo.png" alt="CAWA" style="height: 32px;" />
          <h1 style="color: white; font-size: 16px; font-weight: 600; margin: 0;">
            ${title}
          </h1>
        </div>

        <!-- Right: Navigation Dropdown -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="admin-nav-dropdown" style="position: relative;">
            <button
              id="admin-nav-toggle"
              class="btn btn-secondary"
              style="font-size: 13px; padding: 6px 12px; display: flex; align-items: center; gap: 6px;"
            >
              ${dropdownIcon}
              <span style="display: none;" class="nav-label">Menu</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div
              id="admin-nav-menu"
              class="admin-nav-menu"
              style="
                display: none;
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 4px;
                background: var(--bg-primary);
                border: 1px solid var(--border-primary);
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                min-width: 200px;
                z-index: 1000;
              "
            >
              ${navItems.map(item => `
                <button
                  data-nav-path="${item.path}"
                  class="admin-nav-item ${item.id === currentPage ? 'active' : ''}"
                  style="
                    width: 100%;
                    text-align: left;
                    padding: 10px 16px;
                    border: none;
                    background: ${item.id === currentPage ? 'var(--color-primary-alpha)' : 'transparent'};
                    color: ${item.id === currentPage ? 'var(--color-primary)' : 'var(--text-primary)'};
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: background-color 0.2s;
                  "
                  onmouseover="this.style.background = '${item.id === currentPage ? 'var(--color-primary-alpha)' : 'var(--bg-secondary)'}'"
                  onmouseout="this.style.background = '${item.id === currentPage ? 'var(--color-primary-alpha)' : 'transparent'}'"
                >
                  ${item.icon}
                  ${item.label}
                </button>
              `).join('')}

              <!-- Divider -->
              <div style="height: 1px; background: var(--border-secondary); margin: 4px 0;"></div>

              <!-- Sign Out -->
              <button
                id="admin-signout"
                class="admin-nav-item"
                style="
                  width: 100%;
                  text-align: left;
                  padding: 10px 16px;
                  border: none;
                  background: transparent;
                  color: var(--text-primary);
                  font-size: 14px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  transition: background-color 0.2s;
                "
                onmouseover="this.style.background = 'var(--bg-secondary)'"
                onmouseout="this.style.background = 'transparent'"
              >
                ${signOutIcon}
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
}

/**
 * Setup event listeners for admin header
 * Must be called after rendering
 */
export function setupAdminHeader() {
  // Dropdown toggle
  const toggleBtn = document.getElementById('admin-nav-toggle')
  const menu = document.getElementById('admin-nav-menu')

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      const isVisible = menu.style.display === 'block'
      menu.style.display = isVisible ? 'none' : 'block'
    })

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.admin-nav-dropdown')) {
        menu.style.display = 'none'
      }
    })
  }

  // Navigation items
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const path = e.currentTarget.getAttribute('data-nav-path')
      if (path) {
        router.navigate(path)
      }
    })
  })

  // Sign out
  const signoutBtn = document.getElementById('admin-signout')
  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut()
      router.navigate('/admin')
    })
  }
}

// SVG Icons
const homeIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9 22 9 12 15 12 15 22"/>
</svg>`

const usersIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
  <circle cx="9" cy="7" r="4"/>
  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
</svg>`

const trophyIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
  <path d="M4 22h16"/>
  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
</svg>`

const settingsIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>`

const starIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</svg>`

const signOutIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
  <polyline points="16 17 21 12 16 7"/>
  <line x1="21" y1="12" x2="9" y2="12"/>
</svg>`

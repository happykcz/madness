/**
 * UI Helper Utilities
 *
 * Provides reusable UI components for toast notifications, loading states,
 * and error displays. GitHub-style design with CAWA branding.
 */

/**
 * Toast notification manager
 */
class ToastManager {
  constructor() {
    this.container = null
    this.toasts = []
  }

  /**
   * Initialize toast container
   */
  init() {
    if (this.container) return

    this.container = document.createElement('div')
    this.container.id = 'toast-container'
    this.container.style.cssText = `
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 400px;
    `
    document.body.appendChild(this.container)
  }

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in ms (0 = permanent)
   */
  show(message, type = 'info', duration = 5000) {
    this.init()

    const toast = document.createElement('div')
    toast.className = 'toast'

    const colors = {
      success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
      error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
      warning: { bg: '#fff3cd', border: '#ffeeba', text: '#856404' },
      info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' },
    }

    const color = colors[type] || colors.info

    toast.style.cssText = `
      background-color: ${color.bg};
      border: 1px solid ${color.border};
      border-radius: 6px;
      padding: 12px 16px;
      color: ${color.text};
      font-size: 14px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.3s ease;
      cursor: pointer;
    `

    toast.textContent = message
    toast.onclick = () => this.remove(toast)

    this.container.appendChild(toast)
    this.toasts.push(toast)

    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration)
    }

    return toast
  }

  /**
   * Remove a toast
   */
  remove(toast) {
    toast.style.animation = 'slideOut 0.3s ease'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
      this.toasts = this.toasts.filter(t => t !== toast)
    }, 300)
  }

  /**
   * Clear all toasts
   */
  clearAll() {
    this.toasts.forEach(toast => this.remove(toast))
  }
}

// Create singleton instance
const toastManager = new ToastManager()

/**
 * Show success toast
 * @param {string} message
 * @param {number} duration
 */
export function showSuccess(message, duration) {
  return toastManager.show(message, 'success', duration)
}

/**
 * Show error toast
 * @param {string} message
 * @param {number} duration
 */
export function showError(message, duration) {
  return toastManager.show(message, 'error', duration)
}

/**
 * Show warning toast
 * @param {string} message
 * @param {number} duration
 */
export function showWarning(message, duration) {
  return toastManager.show(message, 'warning', duration)
}

/**
 * Show info toast
 * @param {string} message
 * @param {number} duration
 */
export function showInfo(message, duration) {
  return toastManager.show(message, 'info', duration)
}

/**
 * Loading state manager
 */
class LoadingManager {
  constructor() {
    this.overlay = null
    this.isLoading = false
  }

  /**
   * Show loading overlay
   * @param {string} message - Optional loading message
   */
  show(message = 'Loading...') {
    if (this.isLoading) return

    this.overlay = document.createElement('div')
    this.overlay.id = 'loading-overlay'
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `

    const spinner = document.createElement('div')
    spinner.style.cssText = `
      background-color: white;
      border-radius: 6px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `

    spinner.innerHTML = `
      <div style="
        border: 4px solid #f3f3f3;
        border-top: 4px solid #ff0046;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      "></div>
      <div style="color: #24292e; font-size: 14px;">${message}</div>
    `

    this.overlay.appendChild(spinner)
    document.body.appendChild(this.overlay)
    this.isLoading = true
  }

  /**
   * Hide loading overlay
   */
  hide() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay)
    }
    this.overlay = null
    this.isLoading = false
  }
}

// Create singleton instance
const loadingManager = new LoadingManager()

/**
 * Show loading overlay
 * @param {string} message
 */
export function showLoading(message) {
  loadingManager.show(message)
}

/**
 * Hide loading overlay
 */
export function hideLoading() {
  loadingManager.hide()
}

/**
 * Display error message in a UI element
 * @param {string} message - Error message
 * @returns {string} HTML string
 */
export function errorBox(message) {
  return `
    <div style="
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      padding: 12px 16px;
      color: #721c24;
      font-size: 14px;
      margin: 16px 0;
    ">
      <strong>Error:</strong> ${message}
    </div>
  `
}

/**
 * Display success message in a UI element
 * @param {string} message - Success message
 * @returns {string} HTML string
 */
export function successBox(message) {
  return `
    <div style="
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 6px;
      padding: 12px 16px;
      color: #155724;
      font-size: 14px;
      margin: 16px 0;
    ">
      <strong>Success:</strong> ${message}
    </div>
  `
}

/**
 * Display warning message in a UI element
 * @param {string} message - Warning message
 * @returns {string} HTML string
 */
export function warningBox(message) {
  return `
    <div style="
      background-color: #fff3cd;
      border: 1px solid #ffeeba;
      border-radius: 6px;
      padding: 12px 16px;
      color: #856404;
      font-size: 14px;
      margin: 16px 0;
    ">
      <strong>Warning:</strong> ${message}
    </div>
  `
}

/**
 * Display info message in a UI element
 * @param {string} message - Info message
 * @returns {string} HTML string
 */
export function infoBox(message) {
  return `
    <div style="
      background-color: #d1ecf1;
      border: 1px solid #bee5eb;
      border-radius: 6px;
      padding: 12px 16px;
      color: #0c5460;
      font-size: 14px;
      margin: 16px 0;
    ">
      <strong>Info:</strong> ${message}
    </div>
  `
}

/**
 * Confirm dialog
 * @param {string} message - Confirmation message
 * @returns {Promise<boolean>} True if confirmed
 */
export async function confirm(message) {
  return window.confirm(message)
}

/**
 * Add CSS animations for toasts
 */
function addStyles() {
  if (document.getElementById('ui-helpers-styles')) return

  const style = document.createElement('style')
  style.id = 'ui-helpers-styles'
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
}

// Initialize styles
if (typeof document !== 'undefined') {
  addStyles()
}

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  hideLoading,
  errorBox,
  successBox,
  warningBox,
  infoBox,
  confirm,
}

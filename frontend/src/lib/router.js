/**
 * Hash-based Router for GitHub Pages SPA
 *
 * Implements client-side routing using URL hash fragments to avoid
 * 404 errors on GitHub Pages static hosting.
 *
 * Routes are defined as: #/route-name
 * Example: https://user.github.io/repo/#/login
 */

class Router {
  constructor() {
    this.routes = new Map()
    this.beforeEachGuards = []
    this.currentRoute = null
    this.isInitialized = false
  }

  /**
   * Register a route
   * @param {string} path - Route path (e.g., '/login', '/dashboard')
   * @param {Function} handler - Route handler function
   */
  register(path, handler) {
    this.routes.set(path, handler)
  }

  /**
   * Register multiple routes at once
   * @param {Object} routeMap - Object with path: handler pairs
   */
  registerRoutes(routeMap) {
    Object.entries(routeMap).forEach(([path, handler]) => {
      this.register(path, handler)
    })
  }

  /**
   * Add navigation guard (runs before each route change)
   * @param {Function} guard - Guard function (to, from, next)
   */
  beforeEach(guard) {
    this.beforeEachGuards.push(guard)
  }

  /**
   * Navigate to a route
   * @param {string} path - Route path
   * @param {boolean} replace - Replace history instead of push
   */
  navigate(path, replace = false) {
    const hash = `#${path}`
    if (replace) {
      window.location.replace(hash)
    } else {
      window.location.hash = hash
    }
  }

  /**
   * Go back in history
   */
  back() {
    window.history.back()
  }

  /**
   * Get current route path
   * @returns {string}
   */
  getCurrentPath() {
    const hash = window.location.hash.slice(1) // Remove '#'
    return hash || '/'
  }

  /**
   * Get route parameters from query string
   * @returns {Object}
   */
  getParams() {
    const hash = window.location.hash
    const queryStart = hash.indexOf('?')
    if (queryStart === -1) return {}

    const queryString = hash.slice(queryStart + 1)
    const params = new URLSearchParams(queryString)
    return Object.fromEntries(params.entries())
  }

  /**
   * Handle route change
   */
  async handleRouteChange() {
    const path = this.getCurrentPath()
    const handler = this.routes.get(path)

    // Run navigation guards
    let guardResult = true
    for (const guard of this.beforeEachGuards) {
      const result = await guard(path, this.currentRoute, (newPath) => {
        if (newPath) this.navigate(newPath, true)
      })
      if (result === false) {
        guardResult = false
        break
      }
    }

    if (!guardResult) return

    // Update current route
    this.currentRoute = path

    // Execute route handler
    if (handler) {
      try {
        await handler()
      } catch (error) {
        console.error(`Error handling route ${path}:`, error)
        this.handleNotFound()
      }
    } else {
      this.handleNotFound()
    }
  }

  /**
   * Handle 404 - Route not found
   */
  handleNotFound() {
    const app = document.querySelector('#app')
    if (app) {
      app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center" style="background-color: #fafbfc;">
          <div class="card max-w-md text-center">
            <h1 class="text-3xl font-bold mb-4" style="color: #24292e;">404</h1>
            <p class="mb-6" style="color: #586069;">Route not found</p>
            <button class="btn btn-primary" onclick="window.location.hash='#/'">
              Go Home
            </button>
          </div>
        </div>
      `
    }
  }

  /**
   * Initialize router and start listening for route changes
   */
  init() {
    if (this.isInitialized) {
      console.warn('Router already initialized')
      return
    }

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange())

    // Handle initial route
    this.handleRouteChange()

    this.isInitialized = true
    console.log('Router initialized')
  }

  /**
   * Destroy router and clean up listeners
   */
  destroy() {
    window.removeEventListener('hashchange', () => this.handleRouteChange())
    this.isInitialized = false
  }
}

// Export singleton instance
export const router = new Router()

// Export class for testing
export default Router

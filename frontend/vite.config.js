import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Base public path - set to '/' for custom domain
  // Custom domain: subdomain.happyk.au will serve from root
  base: '/',

  // Remove debug statements in production builds only
  // This safely strips console.* and debugger without touching source
  esbuild: command === 'build' ? { drop: ['console', 'debugger'] } : undefined,

  // Build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Optimize for modern browsers (mobile Safari 15+, Chrome 100+)
    target: ['es2020', 'edge100', 'firefox100', 'chrome100', 'safari15'],
  },

  // Development server options
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },

  // Preview server options (for testing production build)
  preview: {
    port: 4173,
    strictPort: false,
  },
}))

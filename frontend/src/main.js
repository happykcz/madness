import './main.css'

// Application entry point
console.log('Quarry Madness Scorekeeper - Initializing...')

// Mount point for the application
const app = document.querySelector('#app')

// Placeholder welcome screen
app.innerHTML = `
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="score-card max-w-md w-full text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        🧗 Quarry Madness
      </h1>
      <p class="text-gray-600 mb-6">
        Climbing Competition Scorekeeper
      </p>
      <p class="text-sm text-gray-500">
        Phase 1 Setup Complete ✅
      </p>
    </div>
  </div>
`

import './main.css'

// Application entry point
console.log('Quarry Madness Scorekeeper - Initializing...')

// Mount point for the application
const app = document.querySelector('#app')

// Placeholder welcome screen with GitHub-style layout
app.innerHTML = `
  <div class="min-h-screen" style="background-color: #fafbfc;">
    <!-- GitHub-style header -->
    <header class="header">
      <div class="container">
        <div class="flex items-center">
          <img src="/12qm25/assets/cawa-logo.png" alt="CAWA Logo" class="h-10" />
          <h1 class="ml-4 text-white text-xl font-semibold">Quarry Madness</h1>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="container" style="padding-top: 32px;">
      <div class="card max-w-2xl mx-auto text-center">
        <h2 class="text-2xl font-semibold mb-4" style="color: #24292e;">
          Climbing Competition Scorekeeper
        </h2>
        <p class="mb-4" style="color: #586069;">
          Powered by Climbers Association of Western Australia
        </p>

        <div class="mt-6 p-4" style="background-color: #f6f8fa; border-radius: 6px;">
          <p class="text-sm font-semibold mb-2" style="color: #24292e;">
            ✅ Phase 1 Complete
          </p>
          <p class="text-sm mb-4" style="color: #586069;">
            Project setup, Tailwind CSS v4, CAWA branding configured
          </p>

          <p class="text-sm font-semibold mb-2" style="color: #ff0046;">
            🚧 Phase 2 In Progress
          </p>
          <p class="text-sm" style="color: #586069;">
            Building core infrastructure...
          </p>
        </div>

        <button class="btn btn-primary mt-6">
          Get Started
        </button>
      </div>
    </main>
  </div>
`

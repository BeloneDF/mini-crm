import { serve } from '@hono/node-server'
import { app } from './app.js'

const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
  await import('./seed.js')
  console.log('Development mode: Database seeded with initial data.')
}

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  info => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)

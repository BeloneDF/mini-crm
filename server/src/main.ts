import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { corsOptions } from './config/cors.js'
import { authMiddleware } from './infrastructure/http/middlewares/auth-middleware.js'
import authRoutes from './infrastructure/http/routes/auth-routes.js'
import contactRoutes from './infrastructure/http/routes/contact-routes.js'
import userRoutes from './infrastructure/http/routes/user-routes.js'
import leadRoutes from './infrastructure/http/routes/lead-routes.js'
import dashboardRoutes from './infrastructure/http/routes/dashboard-routes.js'

const isDevelopment = process.env.NODE_ENV === 'development'

const app = new Hono()

app.use('*', cors(corsOptions))

app.route('/user', userRoutes)
app.route('/auth', authRoutes)

//* Protected routes
app.use('/contact/*', authMiddleware)
app.route('/contact', contactRoutes)
app.use('/lead/*', authMiddleware)
app.route('/lead', leadRoutes)
app.route('/dashboard', dashboardRoutes)

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

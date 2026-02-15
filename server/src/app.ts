import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { corsOptions } from './config/cors.js'
import { authMiddleware } from './infrastructure/http/middlewares/auth-middleware.js'
import authRoutes from './infrastructure/http/routes/auth-routes.js'
import contactRoutes from './infrastructure/http/routes/contact-routes.js'
import userRoutes from './infrastructure/http/routes/user-routes.js'
import leadRoutes from './infrastructure/http/routes/lead-routes.js'
import dashboardRoutes from './infrastructure/http/routes/dashboard-routes.js'
import { normalizeError } from './infrastructure/http/utils/error-response.js'

export function createApp() {
  const app = new Hono()

  app.use('*', cors(corsOptions))
  app.onError((error, c) => {
    const { status, body } = normalizeError(error)
    return c.json(body, status)
  })

  app.route('/user', userRoutes)
  app.route('/auth', authRoutes)

  //* Protected routes
  app.use('/contact/*', authMiddleware)
  app.route('/contact', contactRoutes)
  app.use('/lead/*', authMiddleware)
  app.route('/lead', leadRoutes)
  app.route('/dashboard', dashboardRoutes)

  return app
}

export const app = createApp()

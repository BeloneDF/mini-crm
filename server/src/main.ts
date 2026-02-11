import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import userRoutes from './infrastructure/http/routes/user-routes.js'
import authRoutes from './infrastructure/http/routes/auth-routes.js'
import { cors } from 'hono/cors'
import { corsOptions } from './config/cors.js'

const app = new Hono()

app.use('*', cors(corsOptions))

app.route('/user', userRoutes)
app.route('/auth', authRoutes)

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  info => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)

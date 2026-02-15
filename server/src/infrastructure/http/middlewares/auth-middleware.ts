import { InMemoryAuthRepository } from '@/infrastructure/db/memory-repositories/memory-auth-repository'
import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'

const authRepository = new InMemoryAuthRepository()

export async function authMiddleware(c: Context, next: Next) {
  const authToken = getCookie(c, 'auth')
  if (!authToken) {
    c.status(401)
    return c.json({ error: 'Unauthorized' })
  }

  const user = await authRepository.checkAuth(authToken)

  if (!user) {
    c.status(401)
    return c.json({ error: 'Invalid token' })
  }

  c.set('user', user)

  await next()
}

import { InMemoryAuthRepository } from '@/infrastructure/db/memory-repositories/memory-auth-repository'
import type { Context, Next } from 'hono'

const authRepository = new InMemoryAuthRepository()

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader) {
    c.status(401)
    return c.json({ error: 'Unauthorized' })
  }

  const [, token] = authHeader.split(' ')

  const user = await authRepository.checkAuth(token)

  if (!user) {
    c.status(401)
    return c.json({ error: 'Invalid token' })
  }

  c.set('user', user)

  await next()
}

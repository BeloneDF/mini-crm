import { UnauthorizedError } from '@/domain/errors/app-errors'
import { InMemoryAuthRepository } from '@/infrastructure/db/memory-repositories/memory-auth-repository'
import { respondWithError } from '@/infrastructure/http/utils/error-response'
import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'

const authRepository = new InMemoryAuthRepository()

export async function authMiddleware(c: Context, next: Next) {
  const authToken = getCookie(c, 'auth')
  if (!authToken) {
    return respondWithError(c, new UnauthorizedError())
  }

  const user = await authRepository.checkAuth(authToken)

  if (!user) {
    return respondWithError(c, new UnauthorizedError('Invalid token'))
  }

  c.set('user', user)

  await next()
}

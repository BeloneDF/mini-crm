import type { AuthUseCase } from '@/applications/use-cases/auth/auth'
import { UnauthorizedError } from '@/domain/errors/app-errors'
import { respondWithError } from '@/infrastructure/http/utils/error-response'
import type { Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  async login(c: Context) {
    try {
      const body = await c.req.json()
      const { email, password } = loginSchema.parse(body)

      const result = await this.authUseCase.execute(email, password)

      if (result.token) {
        setCookie(c, 'auth', result.token, {
          httpOnly: true,
          secure: false, //* usando localhost
          sameSite: 'Strict',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
      }

      return c.json({ message: 'Login successful' }, 200)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async checkAuth(c: Context) {
    try {
      const token = this.extractToken(c)

      if (!token) {
        throw new UnauthorizedError()
      }

      const user = await this.authUseCase.checkAuth(token)

      if (!user) {
        throw new UnauthorizedError('Invalid token')
      }

      const { password, id, createdAt, ...userWithoutIdAndPassword } = user

      return c.json(userWithoutIdAndPassword, 200)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async logout(c: Context) {
    try {
      const token = this.extractToken(c)

      if (!token) {
        throw new UnauthorizedError()
      }

      await this.authUseCase.logout(token)

      return c.json({ message: 'Logged out successfully' }, 200)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  private extractToken(c: Context) {
    const token = getCookie(c, 'auth')
    return token
  }
}

import type { AuthUseCase } from '@/applications/use-cases/auth/auth'
import type { Context } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'

export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  async login(c: Context) {
    try {
      const { email, password } = await c.req.json()

      const result = await this.authUseCase.execute(email, password)

      if (result.token) {
        setCookie(c, 'auth', result.token, {
          httpOnly: true,
          secure: false, //* usando localhost
          sameSite: 'Strict',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
      }

      return c.json('Login successful', 200)
    } catch {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
  }

  async checkAuth(c: Context) {
    const token = this.extractToken(c)

    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const user = await this.authUseCase.checkAuth(token)

    if (!user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const { password, id, createdAt, ...userWithoutIdAndPassword } = user

    return c.json(userWithoutIdAndPassword, 200)
  }

  async logout(c: Context) {
    const token = this.extractToken(c)

    if (!token) {
      return c.json({ error: 'Token required' }, 400)
    }

    await this.authUseCase.logout(token)

    return c.json({ message: 'Logged out successfully' }, 200)
  }

  private extractToken(c: Context) {
    const token = getCookie(c, 'auth')
    return token
  }
}

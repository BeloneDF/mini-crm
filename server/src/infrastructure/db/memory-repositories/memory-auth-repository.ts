import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'
import { users, tokenBlacklist } from '../database'
import { jwtConfig } from '@/shared/config/jwt'
import type { AuthRepository } from '@/domain/repositories/auth-repository'
import { UnauthorizedError } from '@/domain/errors/app-errors'
import { compare } from 'bcryptjs'

export class InMemoryAuthRepository implements AuthRepository {
  async login(email: string, password: string) {
    const user = users.find(u => u.email === email)

    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      jwtConfig.secret as Secret,
      {
        expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'],
      }
    )

    return { user, token }
  }

  async checkAuth(token: string) {
    if (tokenBlacklist.includes(token)) return null

    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as { userId: string }

      const user = users.find(u => u.id === decoded.userId)
      return user ?? null
    } catch {
      return null
    }
  }

  async logout(token: string) {
    tokenBlacklist.push(token)
  }
}

import type { User } from '../entities/user.js'

export interface AuthRepository {
  login(email: string, password: string): Promise<{ user: User; token: string }>
  checkAuth(token: string): Promise<User | null>
  logout(token: string): Promise<void>
}

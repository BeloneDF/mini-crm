import type { User } from '../entites/user.js'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: User): Promise<User>
}

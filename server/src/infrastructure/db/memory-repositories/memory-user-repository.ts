import type { User } from '@/domain/entites/user'
import type { UserRepository } from '@/domain/repositories/user-repository.js'
import { users } from '@/infrastructure/db/database'

export class InMemoryUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return users.find(u => u.email === email) ?? null
  }

  async create(user: User): Promise<User> {
    users.push(user)

    return user
  }
}

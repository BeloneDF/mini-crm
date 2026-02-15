import type { User } from '@/domain/entities/user'
import type {
  CreateUserRepositoryInput,
  PublicUserData,
  UserRepository,
} from '@/domain/repositories/user-repository.js'
import { users } from '@/infrastructure/db/database'

export class InMemoryUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return users.find(u => u.email === email) ?? null
  }

  async create(user: CreateUserRepositoryInput): Promise<PublicUserData> {
    const newUser: User = {
      id: crypto.randomUUID(),
      email: user.email,
      name: user.name,
      password: user.password,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    const { password, id, createdAt, ...userWithoutPassword } = newUser
    return userWithoutPassword
  }
}

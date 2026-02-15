import type { CreateUserDTO } from '@/applications/dtos/create-user-dto'
import type { User } from '@/domain/entites/user'
import type { UserRepository } from '@/domain/repositories/user-repository.js'
import { users } from '@/infrastructure/db/database'

export class InMemoryUserRepository implements UserRepository {
  async findByEmail(
    email: string
  ): Promise<Omit<User, 'password' | 'id' | 'createdAt'> | null> {
    return users.find(u => u.email === email) ?? null
  }

  async create(
    user: CreateUserDTO
  ): Promise<Omit<User, 'password' | 'id' | 'createdAt'>> {
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

import type { User } from '../entities/user.js'

export type CreateUserRepositoryInput = Pick<User, 'name' | 'email' | 'password'>
export type PublicUserData = Omit<User, 'password' | 'id' | 'createdAt'>

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: CreateUserRepositoryInput): Promise<PublicUserData>
}

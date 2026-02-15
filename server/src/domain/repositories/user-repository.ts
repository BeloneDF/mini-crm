import type { User } from '../entites/user.js'
import type { CreateUserDTO } from '@/applications/dtos/create-user-dto.js'

export interface UserRepository {
  findByEmail(
    email: string
  ): Promise<Omit<User, 'password' | 'id' | 'createdAt'> | null>
  create(
    user: CreateUserDTO
  ): Promise<Omit<User, 'password' | 'id' | 'createdAt'>>
}

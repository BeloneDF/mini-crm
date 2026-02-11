import { type CreateUserDTO } from '@/applications/dtos/create-user-dto'
import { generateId } from '@/shared/utils/generate-id'
import { AppError } from '@/domain/errors/app-errors'
import type { UserRepository } from '@/domain/repositories/user-repository'
import type { User } from '@/domain/entites/user'

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new AppError('Email already registered', 400)
    }

    const user: User = {
      id: generateId(),
      email: data.email,
      name: data.name,
      password: data.password,
      createdAt: new Date().toISOString(),
    }

    return this.userRepository.create(user)
  }
}

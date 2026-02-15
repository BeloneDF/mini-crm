import { type CreateUserDTO } from '@/applications/dtos/create-user-dto'
import { AppError } from '@/domain/errors/app-errors'
import type { UserRepository } from '@/domain/repositories/user-repository'
import { hash } from 'bcryptjs'

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new AppError('Email already registered', 400)
    }

    const hassedPassword = await hash(data.password, 10)

    const userWithHashedPassword = { ...data, password: hassedPassword }

    return this.userRepository.create(userWithHashedPassword)
  }
}

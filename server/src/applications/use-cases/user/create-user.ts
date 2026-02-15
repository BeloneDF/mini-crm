import { type CreateUserDTO } from '@/applications/dtos/create-user-dto'
import { ConflictError } from '@/domain/errors/app-errors'
import type { UserRepository } from '@/domain/repositories/user-repository'
import { hash } from 'bcryptjs'

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new ConflictError('Email already registered')
    }

    const hassedPassword = await hash(data.password, 10)

    const userWithHashedPassword = { ...data, password: hassedPassword }

    return this.userRepository.create(userWithHashedPassword)
  }
}

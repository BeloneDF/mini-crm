import type { AuthRepository } from '@/domain/repositories/auth-repository'

export class AuthUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string) {
    return this.authRepository.login(email, password)
  }

  async checkAuth(token: string) {
    return this.authRepository.checkAuth(token)
  }

  async logout(token: string) {
    return this.authRepository.logout(token)
  }
}

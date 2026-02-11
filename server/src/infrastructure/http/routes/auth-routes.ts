import { AuthUseCase } from '@/applications/use-cases/auth/auth'
import { InMemoryAuthRepository } from '@/infrastructure/db/memory-repositories/memory-auth-repository'
import { Hono } from 'hono'
import { AuthController } from '../controllers/auth-controller'

const authRoutes = new Hono()

const repository = new InMemoryAuthRepository()
const useCase = new AuthUseCase(repository)
const controller = new AuthController(useCase)

authRoutes.post('/login', c => controller.login(c))
authRoutes.get('/me', c => controller.checkAuth(c))
authRoutes.post('/logout', c => controller.logout(c))

export default authRoutes

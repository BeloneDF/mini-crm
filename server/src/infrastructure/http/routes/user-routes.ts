import { Hono } from 'hono'
import { InMemoryUserRepository } from '@/infrastructure/db/memory-repositories/memory-user-repository'
import { CreateUserUseCase } from '@/applications/use-cases/user/create-user'
import { UserController } from '../controllers/user-controller'

const userRoutes = new Hono()

const userRepository = new InMemoryUserRepository()
const createUser = new CreateUserUseCase(userRepository)
const controller = new UserController(createUser)

userRoutes.post('/', c => controller.create(c))

export default userRoutes

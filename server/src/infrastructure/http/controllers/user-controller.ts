import type { Context } from 'hono'
import { createUserSchema } from '@/infrastructure/http/schemas/user-schema'
import { CreateUserUseCase } from '@/applications/use-cases/user/create-user'
import { respondWithError } from '@/infrastructure/http/utils/error-response'

export class UserController {
  constructor(private createUser: CreateUserUseCase) {}
  async create(c: Context) {
    try {
      const body = await c.req.json()

      const parsed = createUserSchema.parse(body)

      const user = await this.createUser.execute({
        email: parsed.email,
        password: parsed.password,
        name: parsed.name,
      })

      return c.json(user, 201)
    } catch (error) {
      return respondWithError(c, error)
    }
  }
}

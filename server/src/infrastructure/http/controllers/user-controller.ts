import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { createUserSchema } from '@/shared/schemas/user-schema'
import { CreateUserUseCase } from '@/applications/use-cases/user/create-user'
import { AppError } from '@/domain/errors/app-errors'

export class UserController {
  constructor(private createUser: CreateUserUseCase) {}
  async create(c: Context) {
    try {
      const body = await c.req.json()

      const parsed = createUserSchema.safeParse(body)

      if (!parsed.success) {
        return c.json({ error: parsed.error.format() }, 400)
      }

      const user = await this.createUser.execute({
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
      })

      return c.json(user, 201)
    } catch (error) {
      if (error instanceof AppError) {
        return c.json(
          { error: error.message },
          error.statusCode as ContentfulStatusCode
        )
      }

      return c.json({ error: 'Internal server error' }, 500)
    }
  }
}

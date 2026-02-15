import {
  createTestApp,
  createUser,
  parseJson,
  resetInMemoryDatabase,
} from '../helpers/api-test-utils'

describe('User routes', () => {
  beforeEach(() => {
    resetInMemoryDatabase()
  })

  it('POST /user creates an user and returns public data', async () => {
    const app = createTestApp()
    const response = await createUser(app)

    expect(response.status).toBe(201)

    const body = await parseJson<{ name: string; email: string }>(response)
    expect(body).toEqual({
      name: 'Test User',
      email: 'user@example.com',
    })
  })
})

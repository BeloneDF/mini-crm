import {
  authenticate,
  createTestApp,
  parseJson,
  resetInMemoryDatabase,
} from '../helpers/api-test-utils'

describe('Auth routes', () => {
  beforeEach(() => {
    resetInMemoryDatabase()
  })

  it('should login, check token and logout', async () => {
    const app = createTestApp()
    const authCookie = await authenticate(app)

    const meResponse = await app.request('/auth/me', {
      headers: { cookie: authCookie },
    })
    expect(meResponse.status).toBe(200)

    const meBody = await parseJson<{ name: string; email: string }>(meResponse)
    expect(meBody.email).toBe('user@example.com')
    expect(meBody.name).toBe('Test User')

    const logoutResponse = await app.request('/auth/logout', {
      method: 'POST',
      headers: { cookie: authCookie },
    })
    expect(logoutResponse.status).toBe(200)

    const meAfterLogout = await app.request('/auth/me', {
      headers: { cookie: authCookie },
    })
    expect(meAfterLogout.status).toBe(401)
  })

  it('should block protected routes when cookie is missing', async () => {
    const app = createTestApp()

    const contactResponse = await app.request('/contact/all-contacts')
    expect(contactResponse.status).toBe(401)

    const leadResponse = await app.request('/lead/any-id')
    expect(leadResponse.status).toBe(401)
  })
})

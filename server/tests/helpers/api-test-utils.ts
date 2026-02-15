import { createApp } from '../../src/app'
import {
  contacts,
  leads,
  tokenBlacklist,
  users,
} from '../../src/infrastructure/db/database'

export const jsonHeaders = {
  'content-type': 'application/json',
}

export type AppInstance = ReturnType<typeof createApp>

export type ContactResponse = {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export type LeadResponse = {
  id: string
  contactId: string
  name: string
  company: string
  status: 'novo' | 'contactado' | 'qualificado' | 'convertido' | 'perdido'
  createdAt: string
}

export function createTestApp() {
  return createApp()
}

export function resetInMemoryDatabase() {
  users.length = 0
  contacts.length = 0
  leads.length = 0
  tokenBlacklist.length = 0
}

export async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T
}

export async function createUser(app: AppInstance, email = 'user@example.com') {
  return app.request('/user', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      name: 'Test User',
      email,
      password: '123456',
      confirmPassword: '123456',
    }),
  })
}

export async function authenticate(app: AppInstance) {
  const userResponse = await createUser(app)
  expect(userResponse.status).toBe(201)

  const loginResponse = await app.request('/auth/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      email: 'user@example.com',
      password: '123456',
    }),
  })

  expect(loginResponse.status).toBe(200)

  const setCookie = loginResponse.headers.get('set-cookie')
  expect(setCookie).toBeTruthy()

  return setCookie?.split(';')[0] ?? ''
}

export async function createContact(app: AppInstance, authCookie: string) {
  const response = await app.request('/contact', {
    method: 'POST',
    headers: {
      ...jsonHeaders,
      cookie: authCookie,
    },
    body: JSON.stringify({
      name: 'Acme Contact',
      email: 'contact@acme.com',
      phone: '11999999999',
    }),
  })

  expect(response.status).toBe(201)
  return parseJson<ContactResponse>(response)
}

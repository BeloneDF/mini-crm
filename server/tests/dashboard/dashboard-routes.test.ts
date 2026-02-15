import {
  authenticate,
  ContactResponse,
  createContact,
  createTestApp,
  jsonHeaders,
  LeadResponse,
  parseJson,
  resetInMemoryDatabase,
} from '../helpers/api-test-utils'

describe('Dashboard routes', () => {
  beforeEach(() => {
    resetInMemoryDatabase()
  })

  it('GET /dashboard should return aggregated data', async () => {
    const app = createTestApp()
    const authCookie = await authenticate(app)

    const contactA = await createContact(app, authCookie)

    const contactBResponse = await app.request('/contact', {
      method: 'POST',
      headers: {
        ...jsonHeaders,
        cookie: authCookie,
      },
      body: JSON.stringify({
        name: 'Second Contact',
        email: 'second@acme.com',
        phone: '11777777777',
      }),
    })
    expect(contactBResponse.status).toBe(201)
    const contactB = await parseJson<ContactResponse>(contactBResponse)

    const leadOneResponse = await app.request('/lead', {
      method: 'POST',
      headers: {
        ...jsonHeaders,
        cookie: authCookie,
      },
      body: JSON.stringify({
        name: 'Converted Lead',
        company: 'A Corp',
        status: 'convertido',
        contactId: contactA.id,
      }),
    })
    expect(leadOneResponse.status).toBe(201)

    const leadTwoResponse = await app.request('/lead', {
      method: 'POST',
      headers: {
        ...jsonHeaders,
        cookie: authCookie,
      },
      body: JSON.stringify({
        name: 'Open Lead',
        company: 'B Corp',
        status: 'novo',
        contactId: contactB.id,
      }),
    })
    expect(leadTwoResponse.status).toBe(201)

    const dashboardResponse = await app.request('/dashboard')
    expect(dashboardResponse.status).toBe(200)

    const dashboardBody = await parseJson<{
      totalLeads: number
      totalContacts: number
      conversionRate: number
      leadsByStatus: Array<{ status: string; count: number; percentage: number }>
      recentLeads: LeadResponse[]
    }>(dashboardResponse)

    expect(dashboardBody.totalLeads).toBe(2)
    expect(dashboardBody.totalContacts).toBe(2)
    expect(dashboardBody.conversionRate).toBe(0.5)
    expect(dashboardBody.leadsByStatus).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: 'convertido', count: 1 }),
        expect.objectContaining({ status: 'novo', count: 1 }),
      ])
    )
    expect(dashboardBody.recentLeads).toHaveLength(2)
  })
})

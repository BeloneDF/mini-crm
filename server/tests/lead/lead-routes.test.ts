import {
  authenticate,
  createContact,
  createTestApp,
  jsonHeaders,
  LeadResponse,
  parseJson,
  resetInMemoryDatabase,
} from '../helpers/api-test-utils'

describe('Lead routes', () => {
  beforeEach(() => {
    resetInMemoryDatabase()
  })

  it('should cover create, list, read, update and delete', async () => {
    const app = createTestApp()
    const authCookie = await authenticate(app)
    const contact = await createContact(app, authCookie)

    const createLeadResponse = await app.request('/lead', {
      method: 'POST',
      headers: {
        ...jsonHeaders,
        cookie: authCookie,
      },
      body: JSON.stringify({
        name: 'Lead One',
        company: 'Company One',
        status: 'novo',
        contactId: contact.id,
      }),
    })
    expect(createLeadResponse.status).toBe(201)

    const createdLead = await parseJson<LeadResponse>(createLeadResponse)

    const listResponse = await app.request('/lead', {
      headers: { cookie: authCookie },
    })
    expect(listResponse.status).toBe(200)

    const listBody = await parseJson<{
      total: number
      data: LeadResponse[]
    }>(listResponse)
    expect(listBody.total).toBe(1)
    expect(listBody.data[0]?.id).toBe(createdLead.id)

    const findByIdResponse = await app.request(`/lead/${createdLead.id}`, {
      headers: { cookie: authCookie },
    })
    expect(findByIdResponse.status).toBe(200)

    const updateResponse = await app.request(`/lead/${createdLead.id}`, {
      method: 'PUT',
      headers: {
        ...jsonHeaders,
        cookie: authCookie,
      },
      body: JSON.stringify({
        name: 'Lead One Updated',
        company: 'Company Updated',
        status: 'convertido',
        contactId: contact.id,
      }),
    })
    expect(updateResponse.status).toBe(200)

    const updatedLead = await parseJson<LeadResponse>(updateResponse)
    expect(updatedLead.name).toBe('Lead One Updated')
    expect(updatedLead.status).toBe('convertido')

    const deleteResponse = await app.request(`/lead/${createdLead.id}`, {
      method: 'DELETE',
      headers: { cookie: authCookie },
    })
    expect(deleteResponse.status).toBe(200)

    const deleteBody = await parseJson<{ message: string }>(deleteResponse)
    expect(deleteBody.message).toBe('Lead deleted successfully')
  })
})

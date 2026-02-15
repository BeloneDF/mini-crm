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

describe('Contact routes', () => {
  beforeEach(() => {
    resetInMemoryDatabase()
  })

  it('should cover create, list, read, update, list leads and delete', async () => {
    const app = createTestApp()
    const authCookie = await authenticate(app)

    const createdContact = await createContact(app, authCookie)

    const listResponse = await app.request('/contact', {
      headers: { cookie: authCookie },
    })
    expect(listResponse.status).toBe(200)

    const listBody = await parseJson<{
      total: number
      data: ContactResponse[]
    }>(listResponse)
    expect(listBody.total).toBe(1)
    expect(listBody.data[0]?.id).toBe(createdContact.id)

    const allContactsResponse = await app.request('/contact/all-contacts', {
      headers: { cookie: authCookie },
    })
    expect(allContactsResponse.status).toBe(200)

    const allContactsBody = await parseJson<
      Array<{ id: string; name: string; email: string }>
    >(allContactsResponse)
    expect(allContactsBody).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdContact.id,
          name: 'Acme Contact',
          email: 'contact@acme.com',
        }),
      ])
    )

    const findByIdResponse = await app.request(`/contact/${createdContact.id}`, {
      headers: { cookie: authCookie },
    })
    expect(findByIdResponse.status).toBe(200)

    const findByIdBody = await parseJson<ContactResponse>(findByIdResponse)
    expect(findByIdBody.id).toBe(createdContact.id)

    const updateResponse = await app.request(`/contact/${createdContact.id}`, {
      method: 'PUT',
      headers: {
        ...jsonHeaders,
        cookie: authCookie,
      },
      body: JSON.stringify({
        name: 'Acme Contact Updated',
        email: 'updated@acme.com',
        phone: '11888888888',
      }),
    })
    expect(updateResponse.status).toBe(200)

    const updatedBody = await parseJson<ContactResponse>(updateResponse)
    expect(updatedBody.name).toBe('Acme Contact Updated')
    expect(updatedBody.email).toBe('updated@acme.com')

    const createdLeadResponse = await app.request('/lead', {
      method: 'POST',
      headers: {
        ...jsonHeaders,
        cookie: authCookie,
      },
      body: JSON.stringify({
        name: 'Lead Linked',
        company: 'Acme LTDA',
        status: 'novo',
        contactId: createdContact.id,
      }),
    })
    expect(createdLeadResponse.status).toBe(201)

    const createdLead = await parseJson<LeadResponse>(createdLeadResponse)

    const leadsByContactResponse = await app.request(
      `/contact/${createdContact.id}/leads`,
      {
        headers: { cookie: authCookie },
      }
    )
    expect(leadsByContactResponse.status).toBe(200)

    const leadsByContactBody = await parseJson<{
      contact: ContactResponse
      leads: LeadResponse[]
    }>(leadsByContactResponse)
    expect(leadsByContactBody.contact.id).toBe(createdContact.id)
    expect(leadsByContactBody.leads).toHaveLength(1)
    expect(leadsByContactBody.leads[0]?.id).toBe(createdLead.id)

    const deleteResponse = await app.request(`/contact/${createdContact.id}`, {
      method: 'DELETE',
      headers: { cookie: authCookie },
    })
    expect(deleteResponse.status).toBe(200)

    const deletedBody = await parseJson<{ message: string }>(deleteResponse)
    expect(deletedBody.message).toBe('Contact deleted successfully')

    const leadAfterContactDelete = await app.request(`/lead/${createdLead.id}`, {
      headers: { cookie: authCookie },
    })
    expect(leadAfterContactDelete.status).toBe(404)
  })
})

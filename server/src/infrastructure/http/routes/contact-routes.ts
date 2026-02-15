import { CreateContactUseCase } from '@/applications/use-cases/contact/create-contact'
import { FindContactByIdUseCase } from '@/applications/use-cases/contact/find-contact-by-id'
import { ListContactUseCase } from '@/applications/use-cases/contact/list-contacts'
import { UpdateContactUseCase } from '@/applications/use-cases/contact/update-contact'
import { FindLeadsByContactIdUseCase } from '@/applications/use-cases/lead/list-leads-by-contact-id'
import { InMemoryContactRepository } from '@/infrastructure/db/memory-repositories/memory-contact-repository'
import { Hono } from 'hono'
import { ContactController } from '../controllers/contact-controller'
import { FetchAllContactsUseCase } from '@/applications/use-cases/contact/fetch-all-contacts'
import { DeleteContactUseCase } from '@/applications/use-cases/contact/delete-contact'

const contactRoutes = new Hono()

const contactRepository = new InMemoryContactRepository()

const createContact = new CreateContactUseCase(contactRepository)
const listContact = new ListContactUseCase(contactRepository)
const findContactById = new FindContactByIdUseCase(contactRepository)
const updateContact = new UpdateContactUseCase(contactRepository)
const listLeads = new FindLeadsByContactIdUseCase(contactRepository)
const fetchAllContactsUseCase = new FetchAllContactsUseCase(contactRepository)
const deleteContact = new DeleteContactUseCase(contactRepository)

const controller = new ContactController(
  createContact,
  listContact,
  findContactById,
  updateContact,
  listLeads,
  fetchAllContactsUseCase,
  deleteContact
)

contactRoutes.post('/', c => controller.create(c))
contactRoutes.get('/', c => controller.list(c))

contactRoutes.get('/all-contacts', c => controller.fetchAllContacts(c))

contactRoutes.get('/:id', c => controller.findById(c))
contactRoutes.put('/:id', c => controller.update(c))
contactRoutes.delete('/:id', c => controller.delete(c))
contactRoutes.get('/:contactId/leads', c => controller.listLeads(c))

export default contactRoutes

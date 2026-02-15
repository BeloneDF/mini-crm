import type { User } from '@/domain/entites/user'
import { InMemoryContactRepository } from '@/infrastructure/db/memory-repositories/memory-contact-repository'
import { InMemoryUserRepository } from '@/infrastructure/db/memory-repositories/memory-user-repository'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import type { Contact } from './domain/entites/contact'
import type { LeadStatus } from './domain/entites/lead'
import { InMemoryLeadRepository } from './infrastructure/db/memory-repositories/memory-lead-repository'

export async function createUser() {
  const User: User = {
    id: faker.string.uuid(),
    name: 'Administrador',
    email: 'admin@admin.com',
    password: await hash('Admin@123!', 10),
    createdAt: new Date().toISOString(),
  }

  const repository = new InMemoryUserRepository()
  await repository.create(User)
  return
}

export async function createContacts(): Promise<Contact[]> {
  const repository = new InMemoryContactRepository()

  const contacts = await Promise.all(
    Array.from({ length: 20 }, () =>
      repository.create({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number(),
      })
    )
  )

  return contacts
}

export async function generateContactLeads(contacts: Contact[]) {
  const leadsInMemory = new InMemoryLeadRepository()
  contacts.forEach(contact => {
    const numberOfLeads = faker.number.int({ min: 1, max: 10 })

    for (let i = 0; i < numberOfLeads; i++) {
      leadsInMemory.create({
        contactId: contact.id,
        name: faker.person.fullName(),
        company: faker.company.name(),
        status: faker.helpers.arrayElement([
          'novo',
          'contactado',
          'perdido',
          'qualificado',
          'convertido',
        ] as LeadStatus[]),
      })
    }
  })
}

export async function seed() {
  await createUser()

  const contacts = await createContacts()

  await generateContactLeads(contacts)
}

seed()
  .then(async () => {

    console.log('\n==========================================')
    console.log('🌱 DATABASE SEED FINALIZADO COM SUCESSO')
    console.log('==========================================\n')

    console.log('📊 Resumo das entidades criadas:\n')
    console.table([
      { Entidade: 'Usuário', Total: 1 },
      { Entidade: 'Contatos', Total: 20 },
      { Entidade: 'Leads', Total: 'Dinâmico (1–10 por contato)' },
    ])

    console.log('\n🔐 Credenciais do usuário padrão:\n')
    console.table([
      { Email: 'admin@admin.com', Senha: 'Admin@123!' },
    ])

    console.log('\n🚀 Ambiente pronto para uso!\n')
    console.info('Para executar sem seed, use: "npm run dev" no diretório raiz do server.')
  })
  .catch(error => {
    console.error('\n❌ ERRO DURANTE O SEED')
    console.error('------------------------------------------')
    console.error(error)
    console.error('------------------------------------------\n')
  })


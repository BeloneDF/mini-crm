import type { Contact } from '@/domain/entites/contact'
import type {
  ContactRepository,
  FetchAllContactsResult,
} from '@/domain/repositories/contact-repository'

export interface ListContactParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: keyof Contact
  sortOrder?: 'asc' | 'desc'
}

export class ListContactUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(params: ListContactParams): Promise<FetchAllContactsResult> {
    return this.contactRepository.fetchAll(params)
  }
}

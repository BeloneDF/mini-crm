import type {
  ContactRepository,
  FetchAllContactsResult,
  ListContactsParams,
} from '@/domain/repositories/contact-repository'

export class ListContactUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(params: ListContactsParams): Promise<FetchAllContactsResult> {
    return this.contactRepository.fetchAll(params)
  }
}

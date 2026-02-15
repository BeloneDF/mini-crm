export type LeadStatus =
  | 'novo'
  | 'contactado'
  | 'qualificado'
  | 'convertido'
  | 'perdido'

export interface Lead {
  id: string
  contactId: string
  name: string
  company: string
  status: LeadStatus
  createdAt: string
}

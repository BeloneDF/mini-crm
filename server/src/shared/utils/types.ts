export type LeadStatus =
  | 'novo'
  | 'contactado'
  | 'qualificado'
  | 'convertido'
  | 'perdido'

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export interface Lead {
  id: string
  contactId: string
  name: string
  company: string
  status: LeadStatus
  createdAt: string
}

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; bgColor: string }
> = {
  novo: {
    label: 'Novo',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  contactado: {
    label: 'Contactado',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  qualificado: {
    label: 'Qualificado',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50 border-cyan-200',
  },
  convertido: {
    label: 'Convertido',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-200',
  },
  perdido: {
    label: 'Perdido',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-200',
  },
}

export const ALL_STATUSES: LeadStatus[] = [
  'novo',
  'contactado',
  'qualificado',
  'convertido',
  'perdido',
]
export type LeadWithContact = Lead & {
  contact: {
    name: string
    email: string
  }
}

export interface Dashboard {
  totalLeads: number
  totalContacts: number
  conversionRate: number
  leadsByStatus: {
    status: LeadStatus
    count: number
    percentage: number
  }[]
  recentLeads: LeadWithContact[]
}

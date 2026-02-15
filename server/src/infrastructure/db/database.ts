import type { Contact } from '@/domain/entities/contact.js'
import type { Lead } from '@/domain/entities/lead'
import type { User } from '@/domain/entities/user.js'

export const users: User[] = []
export const contacts: Contact[] = []
export const leads: Lead[] = []
export const tokenBlacklist: string[] = []

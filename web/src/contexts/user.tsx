import type { GetProfileResponse } from '@/api/get-profile'
import { createContext } from 'react'

export interface CurrentUserContextType {
  userContext: GetProfileResponse
}

export const CurrentUserContext = createContext<CurrentUserContextType | null>(
  null
)

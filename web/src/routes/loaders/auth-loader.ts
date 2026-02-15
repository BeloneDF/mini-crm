import { getProfile } from '@/api/auth/get-profile'
import { redirect } from 'react-router-dom'

export async function authLoader() {
  try {
    const profile = await getProfile()

    if (!profile) {
      throw redirect('/sign-in')
    }

    return profile
  } catch {
    throw redirect('/sign-in')
  }
}

import { api } from '@/lib/axios'

export interface GetProfileResponse {
  user_photo_url: string | null
  name: string
  email: string
}

export async function getProfile(): Promise<GetProfileResponse> {
  const response = await api.get('/auth/check')

  return response.data
}

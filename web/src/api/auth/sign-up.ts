// src/api/sign-up.ts
import { api } from '@/lib/axios'

interface SignUpRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export async function signUp(data: SignUpRequest) {
  const response = await api.post('/user', data)
  return response.data
}

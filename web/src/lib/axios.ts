import { env } from '@/env'
import axios from 'axios'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
})
console.log(env.VITE_ENABLE_API_DELAY)

//* Simular um atraso de 500ms em todas as requisições para testes de loading states
if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async config => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return config
  })
}

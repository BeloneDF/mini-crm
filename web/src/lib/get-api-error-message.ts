import { isAxiosError } from 'axios'

type ApiErrorPayload = {
  message?: unknown
  error?: unknown
  errors?: unknown
}

function pickMessage(value: unknown): string | null {
  if (typeof value === 'string') {
    const text = value.trim()
    return text.length > 0 ? text : null
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = pickMessage(item)
      if (message) {
        return message
      }
    }
  }

  if (typeof value === 'object' && value !== null) {
    const nestedMessage = pickMessage((value as Record<string, unknown>).message)
    if (nestedMessage) {
      return nestedMessage
    }

    const nestedError = pickMessage((value as Record<string, unknown>).error)
    if (nestedError) {
      return nestedError
    }
  }

  return null
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Ocorreu um erro inesperado.'
): string {
  if (isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined

    const apiMessage =
      pickMessage(error.response?.data) ||
      pickMessage(payload?.message) ||
      pickMessage(payload?.error) ||
      pickMessage(payload?.errors)

    if (apiMessage) {
      return apiMessage
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallback
}

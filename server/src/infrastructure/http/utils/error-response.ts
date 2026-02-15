import {
  AppError,
  BadRequestError,
  type ErrorCode,
  InternalServerError,
  ValidationError,
} from '@/domain/errors/app-errors'
import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { ZodError, treeifyError } from 'zod'

interface SerializedErrorResponse {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

const ERROR_CODE_STATUS_MAP: Record<ErrorCode, ContentfulStatusCode> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 400,
  INTERNAL_SERVER_ERROR: 500,
}

function serializeAppError(error: AppError): {
  status: ContentfulStatusCode
  body: SerializedErrorResponse
} {
  return {
    status: ERROR_CODE_STATUS_MAP[error.code] ?? 500,
    body: {
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    },
  }
}

export function normalizeError(error: unknown) {
  if (error instanceof ZodError) {
    return serializeAppError(
      new ValidationError('Invalid request data', treeifyError(error))
    )
  }

  if (error instanceof SyntaxError) {
    return serializeAppError(new BadRequestError('Invalid JSON body'))
  }

  if (error instanceof AppError) {
    return serializeAppError(error)
  }

  return serializeAppError(
    new InternalServerError(
      typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
        ? error.message
        : 'Internal server error'
    )
  )
}

export function respondWithError(c: Context, error: unknown) {
  const { status, body } = normalizeError(error)
  return c.json(body, status)
}

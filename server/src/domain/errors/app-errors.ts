export const ERROR_CODE = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE]

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: unknown) {
    super(ERROR_CODE.BAD_REQUEST, message, details)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation error', details?: unknown) {
    super(ERROR_CODE.VALIDATION_ERROR, message, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(ERROR_CODE.UNAUTHORIZED, message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(ERROR_CODE.FORBIDDEN, message)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(ERROR_CODE.NOT_FOUND, message)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(ERROR_CODE.CONFLICT, message)
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(ERROR_CODE.INTERNAL_SERVER_ERROR, message)
  }
}

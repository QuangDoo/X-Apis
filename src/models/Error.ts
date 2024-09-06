import { HTTP_STATUS_CODE } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'

interface ErrorsType {
  [key: string]: {
    msg: string
    [key: string]: any
  }
}

export class ErrorWithStatus {
  message: string
  status: number

  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({
    message = USER_MESSAGES.INVALID_FIELD,
    errors
  }: {
    message?: string
    status?: number
    errors: ErrorsType
  }) {
    super({ message, status: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}

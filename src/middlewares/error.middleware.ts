import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import { HTTP_STATUS_CODE } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Error'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
  }

  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })

  return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: err
  })
}

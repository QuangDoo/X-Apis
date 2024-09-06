import { NextFunction, Request, Response } from 'express'

export const wrapRequestHanlder = (fn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

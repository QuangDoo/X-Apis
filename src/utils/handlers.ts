import { NextFunction, Request, Response } from 'express'

/**
 * Wraps a request handler function to catch any thrown errors and pass them to the
 * next error-handling middleware.
 * @param fn The request handler function to wrap.
 * @returns A new request handler function that catches errors and passes them to the next middleware.
 */
export const wrapRequestHanlder = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

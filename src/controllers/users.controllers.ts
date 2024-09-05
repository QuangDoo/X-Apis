import { NextFunction, Request, Response } from 'express'
import { type ParamsDictionary } from 'express-serve-static-core'
import { type RegisterRequestBody } from '~/models/requests/User.requests'
import { usersServices } from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Login success'
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    throw new Error('test')

    const result = await usersServices.register(req.body)

    return res.status(200).json({
      message: 'Register success',
      result
    })
  } catch (error) {
    // next khi truyền error vào thì mặc định express sẽ hiểu đó là error handler
    next(error)
  }
}

import { Request, Response } from 'express'
import { usersServices } from '~/services/users.services'
import { type ParamsDictionary } from 'express-serve-static-core'
import { type RegisterRequestBody } from '~/models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Login success'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  try {
    const result = await usersServices.register(req.body)

    return res.status(200).json({
      message: 'Register success',
      result
    })
  } catch (error) {
    res.status(400).json({
      message: 'Register failed',
      error
    })
  }
}

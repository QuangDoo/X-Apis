import { Request, Response } from 'express'
import { usersServices } from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Login success'
  })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = await usersServices.register({ email, password })

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

import { NextFunction, Request, Response } from 'express'
import { type ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS_CODE } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import { type RegisterRequestBody } from '~/models/requests/User.requests'
import { User } from '~/models/schemas/User.schema'
import { usersServices } from '~/services/users.services'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const user_id = user._id as ObjectId

    const result = await usersServices.login(user_id.toString())

    return res.status(200).json({
      message: USER_MESSAGES.LOGIN_SUCCESS,
      result
    })
  } catch (error) {
    next(error)
  }
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await usersServices.register(req.body)

    return res.status(200).json({
      message: USER_MESSAGES.REGISTER_SUCCESS,
      result
    })
  } catch (error) {
    // next khi truyền error vào thì mặc định express sẽ hiểu đó là error handler
    next(error)
  }
}

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await usersServices.getAllUsers()

    return res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

import { NextFunction, Request, Response } from 'express'
import { type ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS_CODE } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import { type RegisterRequestBody } from '~/models/requests/User.requests'
import { User } from '~/models/schemas/User.schema'
import { usersServices } from '~/services/users.services'

/**
 * Register a new user
 * @description Register a new user
 * @path /users/register
 * @method POST
 * @body {name: string, email: string, password: string, confirm_password: string, date_of_birth: ISOString}
 * @author QuangDoo
 * @response {access_token: string, refresh_token: string}
 */
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await usersServices.register(req.body)

    return res.status(HTTP_STATUS_CODE.CREATED).json({
      message: USER_MESSAGES.REGISTER_SUCCESS,
      result
    })
  } catch (error) {
    // next khi truyền error vào thì mặc định express sẽ hiểu đó là error handler
    next(error)
  }
}

/**
 * Login user
 * @description Login user
 * @path /users/login
 * @method POST
 * @body {email: string, password: string}
 * @author QuangDoo
 * @response {access_token: string, refresh_token: string}
 */
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const user_id = user._id?.toString() || ''

    const result = await usersServices.login(user_id)

    return res.status(HTTP_STATUS_CODE.CREATED).json({
      message: USER_MESSAGES.LOGIN_SUCCESS,
      result
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Logout user
 * @description Logout user
 * @path /users/logout
 * @method POST
 * @header {Authorization: Bearer <access_token>}
 * @body {refresh_token: string}
 * @author QuangDoo
 * @response {message: string}
 */
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      message: USER_MESSAGES.LOGOUT_SUCCESS
    })
  } catch (error) {
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

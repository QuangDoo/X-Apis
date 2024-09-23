import { Router } from 'express'
import {
  getAllUsersController,
  loginController,
  logoutController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  checkLoginUserExists,
  checkRegisterUserExists,
  loginValidator,
  registerValidator
} from '~/middlewares/users.middleware'
import { wrapRequestHanlder } from '~/utils/handlers'

const usersRouter = Router()

/**
 * @description Register a new user
 * @path /users/register
 * @method POST
 * @body {name: string, email: string, password: string, confirm_password: string, date_of_birth: ISOString}
 * @author QuangDoo
 */
usersRouter.post('/register', checkRegisterUserExists, registerValidator, wrapRequestHanlder(registerController))

/**
 * @description Login user
 * @path /users/login
 * @method POST
 * @body {email: string, password: string}
 * @author QuangDoo
 */
usersRouter.post('/login', checkLoginUserExists, loginValidator, loginController)

/**
 * @description Logout user
 * @path /users/logout
 * @method Post
 * @header {Authorization: Bearer <access_token>}
 * @body {refresh_token: string}
 * @author QuangDoo
 */

usersRouter.post('/logout', accessTokenValidator, wrapRequestHanlder(logoutController))

/**
 * @description Get all users
 */
usersRouter.get('/get-all-users', wrapRequestHanlder(getAllUsersController))

export default usersRouter

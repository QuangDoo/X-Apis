import { Router } from 'express'
import { getAllUsersController, loginController, registerController } from '~/controllers/users.controllers'
import {
  checkLoginUserExists,
  checkRegisterUserExists,
  loginValidator,
  registerValidator
} from '~/middlewares/users.middleware'
import { wrapRequestHanlder } from '~/utils/handlers'

const usersRouter = Router()
/**
 * @description Login user
 * @path /users/login
 * @method POST
 * @body {email: string, password: string}
 * @author QuangDoo
 */
usersRouter.post('/login', checkLoginUserExists, loginValidator, loginController)

/**
 * @description Register a new user
 * @path /users/register
 * @method POST
 * @body {name: string, email: string, password: string, confirm_password: string, date_of_birth: ISOString}
 * @author QuangDoo
 */
usersRouter.post('/register', checkRegisterUserExists, registerValidator, wrapRequestHanlder(registerController))

/**
 * @description Get all users
 */
usersRouter.get('/get-all-users', wrapRequestHanlder(getAllUsersController))

export default usersRouter

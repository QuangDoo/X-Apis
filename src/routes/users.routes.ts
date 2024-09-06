import { Router } from 'express'
import { getAllUsersController, loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middleware'
import { wrapRequestHanlder } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)

/**
 * @description Register a new user
 * @path /users/register
 * @method POST
 * @body {name: string, email: string, password: string, confirm_password: string, date_of_birth: ISOString}
 * @author QuangDoo
 */
usersRouter.post('/register', registerValidator, wrapRequestHanlder(registerController))

/**
 * @description Get all users
 */
usersRouter.get('/get-all-users', wrapRequestHanlder(getAllUsersController))

export default usersRouter

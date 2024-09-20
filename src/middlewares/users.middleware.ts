import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { HTTP_STATUS_CODE } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const checkRegisterUserExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    // Check if the user exists based on the email only
    const user = await databaseService.users.findOne({ email })

    if (user) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.USER_EXISTS,
        status: HTTP_STATUS_CODE.CONFLICT
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const checkLoginUserExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    // Bước 1: Tìm người dùng dựa vào email
    const user = await databaseService.users.findOne({ email })

    if (!user) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.INVALID_LOGIN,
        status: HTTP_STATUS_CODE.UNAUTHORIZED
      })
    }

    // Bước 2: Băm mật khẩu người dùng nhập vào và so sánh với mật khẩu đã lưu
    const hashedPassword = hashPassword(password)

    if (user.password !== hashedPassword) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.INVALID_LOGIN,
        status: HTTP_STATUS_CODE.UNAUTHORIZED
      })
    }

    // Nếu mật khẩu hợp lệ, gán thông tin user vào req.user
    req.user = user

    // Tiếp tục đến controller
    next()
  } catch (error) {
    next(error)
  }
}

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGES.INVALID_EMAIL
        },
        isEmail: {
          errorMessage: USER_MESSAGES.INVALID_EMAIL
        },
        trim: true
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_NOT_EMPTY
        },
        isString: true,
        trim: true,
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.INVALID_PASSWORD
        }
      }
    },
    // thêm location body để không cần check header hay params khác
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USER_MESSAGES.USERNAME_NOT_EMPTY
        },
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: USER_MESSAGES.INVALID_USER_NAME
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_NOT_EMPTY
        },
        isEmail: {
          errorMessage: USER_MESSAGES.INVALID_EMAIL
        },
        trim: true
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_NOT_EMPTY
        },
        isString: true,
        trim: true,
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.INVALID_PASSWORD
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_NOT_EMPTY
        },
        isString: true,
        trim: true,
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.INVALID_PASSWORD
        },
        custom: {
          options: (value: string, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGES.PASSWORD_NOT_MATCH)
            }
            return true
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: USER_MESSAGES.INVALID_DATE_OF_BIRTH
        }
      }
    },
    // thêm location body để không cần check header hay params khác
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value?.split(' ')[1]

            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_NOT_EMPTY,
                status: HTTP_STATUS_CODE.UNAUTHORIZED
              })
            }

            const decoded_authorization = await verifyToken(access_token)

            req.decoded_authorization = decoded_authorization

            return true
          }
        }
      }
    },
    ['headers', 'body']
  )
)

import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'

export const checkRegisterUserExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    // Check if the user exists based on the email only
    const user = await databaseService.users.findOne({ email })

    if (user) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.USER_EXISTS,
        status: 401
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
    const hashedPassword = hashPassword(password)
    // Truy vấn database để kiểm tra email và mật khẩu
    const user = await databaseService.users.findOne({
      email,
      password: hashedPassword
    })

    if (!user) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.INVALID_LOGIN,
        status: 401
      })
    }

    req.user = user

    next()
  } catch (error) {
    next(error)
  }
}

export const loginValidator = validate(
  checkSchema({
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
  })
)

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USER_MESSAGES.USERNAME_NOT_EMPTY // Thông báo lỗi tùy chỉnh
      },
      isLength: {
        options: { min: 2, max: 100 },
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
  })
)

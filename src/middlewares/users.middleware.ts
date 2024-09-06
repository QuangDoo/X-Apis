import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import { usersServices } from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and password'
    })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: 'Tên không được để trống!' // Thông báo lỗi tùy chỉnh
      },
      isNumeric: false,
      isString: {
        errorMessage: 'Phải là chuỗi'
      },
      isLength: {
        options: { min: 2, max: 100 },
        errorMessage: USER_MESSAGES.INVALID_USER_NAME
      },
      trim: true,
      custom: {
        options: async (value: string) => {
          if (!value.trim()) {
            throw new Error('Tên không được để trống!')
          }
        }
      }
    },
    email: {
      notEmpty: {
        errorMessage: 'Email không được để trống!'
      },
      isEmail: {
        errorMessage: USER_MESSAGES.INVALID_EMAIL
      },
      trim: true,
      custom: {
        options: async (value: string) => {
          const isEmailExisted = await usersServices.checkEmailExists(value)

          if (isEmailExisted) {
            throw new ErrorWithStatus({ message: USER_MESSAGES.EMAIL_EXISTS, status: 401 })
          }

          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: 'Mật khẩu không được để trống!'
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
        errorMessage: 'Xác nhận mật khẩu không được để trống!'
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
            throw new Error('Mật khẩu xác nhận không khớp!')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true },
        errorMessage: 'Ngày sinh không hợp lệ!'
      }
    }
  })
)

import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import databaseService from '~/services/database.services'
import { usersServices } from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: USER_MESSAGES.INVALID_EMAIL
      },
      isEmail: {
        errorMessage: USER_MESSAGES.INVALID_EMAIL
      },
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          const user = await databaseService.users.findOne({ email: value, password: hashPassword(req.body.password) })

          if (!user) {
            throw new ErrorWithStatus({ message: USER_MESSAGES.INVALID_LOGIN, status: 401 })
          }

          req.user = user

          return true
        }
      }
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

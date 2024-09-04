import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
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
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 2, max: 100 },
        errorMessage: 'Name must be between 2 and 100 characters'
      },
      trim: true
    },
    email: {
      notEmpty: true,

      isLength: {
        options: { min: 1, max: 100 }
      },
      isEmail: {
        errorMessage: 'Must be a valid e-mail address'
      },
      trim: true,
      custom: {
        options: async (value: string) => {
          const isEmailExisted = await usersServices.checkEmailExists(value)

          if (isEmailExisted) {
            throw new Error('Email already exists')
          }

          return true
        }
      }
    },
    password: {
      notEmpty: true,
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
        errorMessage:
          'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
      }
    },
    confirm_password: {
      notEmpty: true,
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
        errorMessage:
          'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
      },
      custom: {
        options: (value: string, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Passwords don't match")
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true }
      }
    }
  })
)

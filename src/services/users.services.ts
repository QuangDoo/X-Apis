import { User } from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'

class UsersServices {
  private signAccessToken(userId: string) {
    return signToken({
      payload: { userId, token_type: TokenType.AccessToken },
      options: { expiresIn: '5m', algorithm: 'HS256' }
    })
  }
  async register(payload: RegisterRequestBody) {
    try {
      const result = await databaseService.users.insertOne(
        new User({
          ...payload,
          date_of_birth: new Date(payload.date_of_birth),
          password: hashPassword(payload.password)
        })
      )

      return result
    } catch (error) {
      throw error
    }
  }

  async checkEmailExists(email: string) {
    const result = await databaseService.users.findOne({ email })

    return !!result
  }
}

export const usersServices = new UsersServices()

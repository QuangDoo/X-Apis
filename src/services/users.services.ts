import { User } from '~/models/schemas/User.schema'
import databaseService from './database.services'

class UsersServices {
  async register(payload: { email: string; password: string }) {
    const { email, password } = payload

    try {
      const result = await databaseService.users.insertOne(new User({ email, password }))

      return result
    } catch (error) {
      throw error
    }
  }
}

export const usersServices = new UsersServices()

import { ObjectId } from 'mongodb'

type RefreshTokenType = {
  _id: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
}

export default class RefreshToken {
  _id: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId

  constructor(refreshToken: RefreshTokenType) {
    this._id = refreshToken._id
    this.token = refreshToken.token
    this.created_at = refreshToken.created_at
    this.user_id = refreshToken.user_id
  }
}

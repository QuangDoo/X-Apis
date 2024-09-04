import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus

  bio?: string
  location?: string
  website?: string
  username?: string
  cover_photo?: string
  avatar?: string
}

// Tại sao lại dùng class thay vì dùng interface để đại diện schema
// khi dùng interface thì chỉ đại diện cho kiểu dữ liệu thôi
// đối với class thì đại diện cho kiểu dữ liệu và object luôn

// Khai báo như thế này, code sẽ tự hiểu là public
export class User {
  // khai báo thuộc tính của class User
  _id?: ObjectId
  email: string
  name: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus

  bio: string
  location: string
  website: string
  username: string
  cover_photo: string
  avatar: string

  // khai báo contructor với thuộc tính trên
  constructor(user: UserType) {
    const date = new Date()

    this._id = user._id
    this.email = user.email
    this.name = user.name || ''
    this.date_of_birth = user.date_of_birth || date
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date

    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified

    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.username = user.username || ''
    this.cover_photo = user.cover_photo || ''
    this.avatar = user.avatar || ''
  }
}

import { createHash } from 'crypto'
const salt = process.env.PASSWORD_SECRET

export function hashPassword(password: string) {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex')
}

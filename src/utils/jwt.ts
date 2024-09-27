import jwt, { type SignOptions } from 'jsonwebtoken'

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options
}: {
  payload: string | Buffer | object
  privateKey?: string
  options: SignOptions
}) => {
  return new Promise((resovle, reject) => {
    return jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resovle(token)
      }
    })
  })
}

export const verifyToken = (token: string) => {
  return new Promise((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

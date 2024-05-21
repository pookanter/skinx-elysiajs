import { IAuth } from '@types'
import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'

const privateKey = await Bun.file(process.env.PRIVATE_KEY_PATH, {
  type: 'utf8'
}).text()

export namespace AuthenService {
  export function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
  }

  export function hashPassword(password: string) {
    return bcrypt.hash(password, 10)
  }

  export function gerateToken(tokenPayload: IAuth.TokenPayload) {
    const accessToken = jwt.sign(tokenPayload, privateKey, {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_EXPIRES_IN
    })
    const refreshToken = jwt.sign(tokenPayload, privateKey, {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    })

    return {
      accessToken,
      refreshToken
    }
  }

  export function verifyToken(token: string) {
    return jwt.verify(token, privateKey, {
      algorithms: ['RS256']
    }) as IAuth.TokenPayload | undefined
  }
}

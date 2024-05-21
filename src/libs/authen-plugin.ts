import Elysia, { t } from 'elysia'
import StatusCode from 'status-code-enum'
import jwt from 'jsonwebtoken'
import { IAuth } from '@types'

export const authenPlugin = (es: Elysia) => {
  const tokenPayload = {} as IAuth.TokenPayload

  return es
    .guard({
      headers: t.Object({
        authorization: t.TemplateLiteral('Bearer ${string}')
      }),
      async beforeHandle({ set, headers }) {
        const authorization = headers['authorization']

        console.log('authorization', authorization)

        if (!authorization) {
          return (set.status = 'Unauthorized')
        }

        const token = authorization.split(' ')[1]

        if (!token) {
          return (set.status = 'Unauthorized')
        }
        const privateKey = await Bun.file(process.env.PRIVATE_KEY_PATH, {
          type: 'utf8'
        }).text()

        try {
          const decoded = jwt.verify(token, privateKey, {
            algorithms: ['RS256']
          })

          Object.assign(tokenPayload, decoded)
        } catch (err) {
          set.status = StatusCode.ClientErrorUnauthorized
          return (set.status = 'Unauthorized')
        }
      }
    })
    .derive(() => {
      return {
        authen: tokenPayload
      }
    })
}

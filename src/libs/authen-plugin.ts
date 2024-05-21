import Elysia, { t } from 'elysia'
import StatusCode from 'status-code-enum'
import { IAuth } from '@types'
import { AuthenService } from './authen-service'

export const authenPlugin = (es: Elysia) => {
  const tokenPayload = {} as IAuth.TokenPayload

  return es
    .guard({
      headers: t.Object({
        authorization: t.TemplateLiteral('Bearer ${string}')
      }),
      async beforeHandle({ set, headers }) {
        const authorization = headers['authorization']

        if (!authorization) {
          console.log('Unauthorized1')
          return (set.status = 'Unauthorized')
        }

        const token = authorization.split(' ')[1]

        if (!token) {
          console.log('Unauthorized2')
          return (set.status = 'Unauthorized')
        }

        try {
          const decoded = AuthenService.verifyToken(token)

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

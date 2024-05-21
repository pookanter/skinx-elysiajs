import { IAuth } from '@types'
import Elysia, { t } from 'elysia'
import { Users, db } from '@database'
import { eq } from 'drizzle-orm'
import { StatusCode } from 'status-code-enum'
import { AuthenService } from '@libs/authen-service'

export const authController = (es: Elysia) => {
  es.group('/auth', (app) =>
    app
      .get('/health', () => 'Ok')
      .post(
        '/sign-in',
        async ({ body }) => {
          const { email, password } = body as {
            email: string
            password: string
          }

          const users = await db
            .select()
            .from(Users)
            .where(eq(Users.email, email))
            .execute()

          if (users.length === 0) {
            throw new Error('User not found')
          }

          const user = users[0]

          const passwordIsValid = await AuthenService.comparePassword(
            password,
            user.password
          )

          if (!passwordIsValid) {
            throw new Error('Credentials are not valid')
          }

          const tokenPayload: IAuth.TokenPayload = {
            user_id: user.id
          }

          return AuthenService.gerateToken(tokenPayload)
        },
        {
          body: t.Object({
            email: t.String(),
            password: t.String()
          })
        }
      )
      .post(
        '/sign-up',
        async ({ set, body }) => {
          const { email, password } = body as {
            email: string
            password: string
          }

          const result = await db
            .select()
            .from(Users)
            .where(eq(Users.email, email))
            .execute()

          if (result.length > 0) {
            set.status = StatusCode.ClientErrorBadRequest
            throw new Error('Email already exists')
          }

          const newUserRes = await db.insert(Users).values({
            email,
            password: await AuthenService.hashPassword(password)
          })

          return {
            message: 'User created',
            user_id: newUserRes[0].insertId
          }
        },
        {
          body: t.Object({
            email: t.String(),
            password: t.String()
          })
        }
      )
      .post(
        '/refresh-token',
        async ({ body }) => {
          let { refreshToken } = body as {
            refreshToken: string
          }

          let decoded: any
          try {
            decoded = AuthenService.verifyToken(refreshToken)
          } catch (e) {
            throw new Error('Invalid token')
          }

          const tokenPayload: IAuth.TokenPayload = {
            user_id: decoded.user_id
          }

          return AuthenService.gerateToken(tokenPayload)
        },
        {
          body: t.Object({
            refreshToken: t.String()
          })
        }
      )
  )

  return es
}

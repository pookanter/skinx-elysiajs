import Elysia, { t } from 'elysia'

const authController = (es: Elysia) => {
  es.group('/auth', (app) =>
    app
      .get('/health', () => 'Ok')
      .post('/sign-in', ({ body }) => {}, {
        body: t.Object({
          email: t.String(),
          password: t.String()
        })
      })
      .post('/sign-up', (ctx) => {})
  )

  return es
}

export default authController

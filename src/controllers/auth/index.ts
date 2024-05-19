import Elysia from 'elysia'

const authController = (es: Elysia) => {
  es.group('/auth', (app) =>
    app
      .get('/health', () => 'Ok')
      .post('/sign-in', () => 'Sign in')
      .post('/sign-up', () => 'Sign up')
  )

  return es
}

export default authController

import { Elysia } from 'elysia'
import AuthController from './controllers/auth'
import controllers from './controllers'

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .use(controllers)
  .get('/health', () => {
    return {
      status: 200,
      data: {
        message: 'OK'
      }
    }
  })
  .listen(8080)
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

import { Elysia } from 'elysia'
import controllers from './controllers'
import { cors } from '@elysiajs/cors'
import { config } from './database/config'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production'
      readonly PORT: string
      readonly PRIVATE_KEY_PATH: string
      readonly PUBLIC_KEY_PATH: string
      readonly JWT_EXPIRES_IN: string
      readonly JWT_REFRESH_EXPIRES_IN: string
      readonly MYSQL_HOST: string
      readonly MYSQL_DATABASE: string
      readonly MYSQL_USERNAME: string
      readonly MYSQL_PASSWORD: string
      readonly MYSQL_PORT: string
    }
  }

  type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property]
  }
}

const app = new Elysia()
  .use(cors())
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
  .listen(parseInt(process.env.PORT))

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

import { Elysia } from 'elysia'
import controllers from './controllers'
import { cors } from '@elysiajs/cors'
import { config } from './database/config'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      PORT: string
      HOST: string
      PRIVATE_KEY_PATH: string
      PUBLIC_KEY_PATH: string
      JWT_EXPIRES_IN: string
      JWT_REFRESH_EXPIRES_IN: string
      MYSQL_HOST: string
      MYSQL_DATABASE: string
      MYSQL_ROOT_USER: string
      MYSQL_ROOT_PASSWORD: string
      MYSQL_PORT: string
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
  .listen({
    port: parseInt(process.env.PORT),
    hostname: process.env.HOST
  })

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

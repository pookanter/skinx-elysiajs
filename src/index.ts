import { Elysia } from 'elysia'
// import AuthController from './controllers/auth'
import controllers from './controllers'
// import { db } from './database/db'
// import { Users } from './database/schema'

// await db.insert(Users).values({
//   email: 'test@mail11.com',
//   password: 'password'
// })

// const user = await db.query.Users.findFirst()
// console.log(user)

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

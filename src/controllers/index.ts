import Elysia from 'elysia'
import { authController } from './auth'
import { postController } from './post'

const controllers = new Elysia().use(authController).use(postController)

export default controllers

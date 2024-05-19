import Elysia from 'elysia'
import authController from './auth'

const controllers = new Elysia().use(authController)

export default controllers

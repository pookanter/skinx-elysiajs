import { authenPlugin } from '@libs/authen-plugin'
import Elysia from 'elysia'

export const postController = (es: Elysia) => {
  es.group('/posts', (app) =>
    app
      .use(authenPlugin)
      .get('/health', ({ authen }) => {
        console.log('authen', authen)
        return 'Ok'
      })
      .post('/create', async ({ body }) => {
        const { title, content } = body as {
          title: string
          content: string
        }

        return {
          title,
          content
        }
      })
  )

  return es
}

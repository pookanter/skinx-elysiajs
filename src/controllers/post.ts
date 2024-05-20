import { authenPlugin } from '@libs/authen-plugin'
import Elysia, { t } from 'elysia'
import { IPosts } from '@types'
import { db, Posts, PostTags, Tags, Users } from '@database'
import { eq } from 'drizzle-orm'
import * as bcrypt from 'bcryptjs'
import dayjs from 'dayjs'

export const postController = (es: Elysia) => {
  es.group('/posts', (app) =>
    app
      .use(authenPlugin)
      .get('/health', ({ authen }) => {
        console.log('authen', authen)
        return 'Ok'
      })
      .post(
        'bulk',
        async ({ body }) => {
          const { data } = body as IPosts.BulkBody

          for (const post of data) {
            post.postedBy

            const res = await db
              .select()
              .from(Users)
              .where(eq(Users.email, post.postedBy))
              .execute()

            let userId = 0
            if (res.length === 0) {
              const newUserRes = await db.insert(Users).values({
                name: post.postedBy,
                email: `${post.postedBy}@mockmail.com`,
                password: await bcrypt.hash(post.postedBy, 10)
              })

              userId = newUserRes[0].insertId
            } else {
              userId = res[0].id
            }

            const newPostRes = await db.insert(Posts).values({
              usersId: userId,
              title: post.title,
              content: post.content,
              postedAt: dayjs(post.postedAt).toDate(),
              postedBy: post.postedBy
            })

            const postId = newPostRes[0].insertId

            for (const tag of post.tags) {
              const tagRes = await db
                .select()
                .from(Tags)
                .where(eq(Tags.name, tag))
                .execute()

              let tagId = 0
              if (tagRes.length === 0) {
                const newTagRes = await db.insert(Tags).values({
                  name: tag,
                  createdBy: post.postedBy
                })

                tagId = newTagRes[0].insertId
              } else {
                tagId = tagRes[0].id
              }

              await db.insert(PostTags).values({
                postsId: postId,
                tagsId: tagId
              })
            }
          }

          return {
            message: 'Success'
          }
        },
        {
          body: t.Object({
            data: t.Array(
              t.Object({
                title: t.String(),
                content: t.String(),
                postedAt: t.String(),
                postedBy: t.String(),
                tags: t.Array(t.String())
              })
            )
          })
        }
      )
      .post('search', async ({ body }) => {
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

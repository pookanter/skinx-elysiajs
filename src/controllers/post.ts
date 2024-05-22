import { authenPlugin } from '@libs/authen-plugin'
import Elysia, { t } from 'elysia'
import { IPosts } from '@types'
import { db, Posts, PostTags, Tags, Users } from '@database'
import { eq, and, inArray, count, sql, asc, desc, like } from 'drizzle-orm'
import * as bcrypt from 'bcryptjs'
import dayjs from 'dayjs'

export const postController = (es: Elysia) => {
  es.group('/posts', (app) =>
    app
      .use(authenPlugin)
      .get('/health', () => {
        return 'Ok'
      })
      .post(
        'search',
        async ({ body }) => {
          const {
            title,
            sort,
            sortBy,
            tags = [],
            page,
            pageSize
          } = body as IPosts.SearchBody

          const postsBase = db
            .select({
              id: Posts.id,
              title: Posts.title,
              content: Posts.content,
              postedAt: Posts.postedAt,
              postedBy: Posts.postedBy,
              tags: sql`JSON_ARRAYAGG(${Tags.name}) as tags`
            })
            .from(Posts)
            .leftJoin(PostTags, eq(Posts.id, PostTags.postsId))
            .leftJoin(Tags, eq(Tags.id, PostTags.tagsId))
            .groupBy(Posts.id)

          if (sort && sortBy) {
            if (sortBy == 'title') {
              if (sort == 'asc') {
                postsBase.orderBy(asc(Posts.title))
              } else {
                postsBase.orderBy(desc(Posts.title))
              }
            }

            if (sortBy == 'postedAt') {
              if (sort == 'asc') {
                postsBase.orderBy(asc(Posts.postedAt))
              } else {
                postsBase.orderBy(desc(Posts.postedAt))
              }
            }
          }

          const andParams = [] as Parameters<typeof and>

          if (title) {
            andParams.push(like(Posts.title, `%${title}%`))
          }

          if (tags.length > 0) {
            andParams.push(inArray(Tags.name, tags))
          }

          postsBase.where(and(...andParams))

          const sq = postsBase.as('sq')

          const counts = await db
            .with(sq)
            .select({
              count: count()
            })
            .from(sq)
            .execute()

          const data = await postsBase
            .limit(pageSize)
            .offset((page - 1) * pageSize)
            .execute()

          return {
            data,
            count: counts[0].count
          }
        },
        {
          body: t.Object({
            title: t.Optional(t.String()),
            sort: t.Optional(t.String()),
            sortBy: t.Optional(t.String()),
            tags: t.Optional(t.Array(t.String())),
            page: t.Number(),
            pageSize: t.Number()
          })
        }
      )
  )

  es.post(
    '/posts/migrate',
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

  return es
}

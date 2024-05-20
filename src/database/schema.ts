import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  text
} from 'drizzle-orm/mysql-core'

export const Users = mysqlTable('users', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement().unique('id'),
  name: varchar('name', { length: 50 }),
  email: varchar('email', { length: 255 }),
  password: varchar('password', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date())
})

export const Posts = mysqlTable('posts', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement().unique('id'),
  usersId: int('users_id', { unsigned: true }).references(() => Users.id),
  title: varchar('title', { length: 100 }),
  content: text('content'),
  postedAt: timestamp('posted_at'),
  postedBy: varchar('posted_by', { length: 50 })
})

export const PostTags = mysqlTable('post_tags', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement().unique('id'),
  postsId: int('posts_id', { unsigned: true }).references(() => Posts.id),
  tagsId: int('tags_id', { unsigned: true }).references(() => Tags.id),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const Tags = mysqlTable('tags', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement().unique('id'),
  name: varchar('name', { length: 50 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  createdBy: varchar('created_by', { length: 50 })
})

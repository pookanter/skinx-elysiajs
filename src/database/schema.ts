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
  context: text('content'),
  postedAt: timestamp('posted_at').notNull().defaultNow(),
  postedBy: timestamp('posted_by').$onUpdate(() => new Date())
})

export const Tags = mysqlTable('tags', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement().unique('id'),
  postsId: int('posts_id', { unsigned: true }).references(() => Posts.id),
  name: varchar('name', { length: 50 })
})

import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core'

export const Users = mysqlTable('users', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement().unique('id'),
  email: varchar('email', { length: 255 }),
  password: varchar('password', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date())
})

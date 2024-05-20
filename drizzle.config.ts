import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'mysql',
  schema: './src/database/schema.ts',
  out: './src/database/migrations',
  verbose: true,
  strict: true,
  dbCredentials: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT)
  }
})

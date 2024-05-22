import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { config } from './config'
import * as schema from './schema'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

await sleep(1500)

let connection: any
let retry = 3

while (retry > 0) {
  try {
    console.log('connecting to db...', config)
    connection = await mysql.createConnection(config)
    break
  } catch (e) {
    console.error('error', e)
    console.log('retrying...')
    retry--
    await sleep(3000)
  }
}

if (!connection) {
  throw new Error('Failed to connect to db')
}

export const db = drizzle(connection, {
  schema: schema,
  logger: true,
  mode: 'default'
})

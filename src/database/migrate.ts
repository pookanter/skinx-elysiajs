import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import mysql from "mysql2/promise";
import { config } from './config'


const connection  = await mysql.createConnection(config)

async function main() {
  console.log('Migrating database...')
  await migrate(drizzle(connection), {
    migrationsFolder: './src/database/migrations'
  })
  ; 
  
  console.log('Database migrated')
  await connection.end()
}

main()


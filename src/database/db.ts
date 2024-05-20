import { drizzle } from 'drizzle-orm/mysql2';
import mysql from "mysql2/promise";
import { config } from './config'
import * as schema from "./schema";

const connection  = await mysql.createConnection(config)

export const db = drizzle(connection, { schema: schema, logger: true, mode: "default" })
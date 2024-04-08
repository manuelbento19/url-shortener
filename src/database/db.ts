import { Pool } from "pg";
import config from './../config/database'

export const client = new Pool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: Number(config.port)
})

client.connect().then(async()=>{
    await client.query("CREATE TABLE IF NOT EXISTS Shortner(id SERIAL PRIMARY KEY, code VARCHAR(30), url VARCHAR(30) UNIQUE NOT NULL)")
})
import { createConnection } from 'typeorm'

export async function connectTypeorm() {
  await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    logging: false,
    entities: [process.env.ENTITIES],
    migrations: [process.env.MIGRATIONS],
    subscribers: [process.env.SUBSCRIBERS],
    cli: {
      entitiesDir: process.env.ENTITIES_DIR,
      migrationsDir: process.env.MIGRATIONS_DIR,
      subscribersDir: process.env.SUBSCRIBERS_DIR,
    },
  })
}

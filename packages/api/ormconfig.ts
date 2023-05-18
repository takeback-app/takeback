module.exports = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: JSON.parse(process.env.LOGGING),
  entities: [process.env.ENTITIES],
  migrations: [process.env.MIGRATIONS],
  subscribers: [process.env.SUBSCRIBERS],
  cli: {
    entitiesDir: [process.env.ENTITIES_DIR],
    migrationsDir: [process.env.MIGRATIONS_DIR],
    subscribersDir: [process.env.SUBSCRIBERS_DIR],
  },
};

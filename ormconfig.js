const sqlite = {
  type: 'sqlite',
  database: `${__dirname}/__tests__/database.sqlite`,
  synchronize: true,
  logger: 'debug',
  logging: true,
  entities: [
    `${__dirname}/server/entity/**/*.js`,
  ],
  migrations: [
    'server/migration/*.js',
  ],
  subscribers: [
    'server/subscriber/*.js',
  ],
  cli: {
    entitiesDir: 'server/entity',
    migrationsDir: 'server/migration',
    subscribersDir: 'server/subscriber',
  },
};

const postgre = {
   type: "postgres",
   host: "localhost",
   url: process.env.DATABASE_URL || '',
   port: process.env.DB_PORT,
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   synchronize: true,
   logging: true,
   entities: [
      `${__dirname}/server/entity/**/*.js`,
    ],
    migrations: [
      'server/migration/*.js',
    ],
    subscribers: [
      'server/subscriber/*.js',
    ],
  cli: {
    entitiesDir: 'server/entity',
    migrationsDir: 'server/migration',
    subscribersDir: 'server/subscriber',
  },
}

export default process.env.NODE_ENV !== 'test' ? postgre : sqlite;
const pathToDb = process.env.NODE_ENV !== 'test'
  ? `${__dirname}/database.sqlite`
  : `${__dirname}/__tests__/database.sqlite`;

export default {
  type: 'sqlite',
  database: pathToDb,
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

module.exports = {
  type: process.env.DB_TYPE || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  logging: process.env.DB_LOGGING === '1' || false,
  timezone: '+08:00',
  synchronize: process.env.DB_AUTO_SYNC === '1' || false,
  entities: ['dist/database/entities/*.js'],
  migrations: ['dist/database/migrations/*.js'],
  connectTimeout: 60000,
  extra: {
    charset: 'utf8mb4',
  },
};

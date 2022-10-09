import * as path from 'path';

export const config = {
  mode: 'develop',
  app: {
    port: 3000,
    origin: process.env.ORIGIN || 'http://127.0.0.1:3001',
    basePath: path.resolve(__dirname, '../'),
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    encryptionPassphrase:
      process.env.ENCRYPT_PASSPHRASE || 'defaultEncryptionKey',
  },
  database: {
    type: process.env.DB_TYPE || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '25324168wei',
    database: process.env.DB_SCHEMA || 'demo-payment',
    logging: process.env.DB_LOGGING === '1' || false,
    timezone: '+08:00',
    synchronize: process.env.DB_AUTO_SYNC === '1' || true,
    entities: ['dist/database/entities/*.js'],
    migrations: ['dist/database/migrations/*.js'],
    extra: {
      charset: 'utf8mb4',
    },
    cli: {
      entitiesDir: 'src/database/entities',
      migrationsDir: 'src/database/migrations',
    },
  },
  jwt: {
    secret: 'demoPrivateKey',
    signOptions: {
      expiresIn: `${12 * 60 * 60}s`,
    },
    duration: process.env.TOKEN_DURATION || '900000',
  },
  logger: {
    path: './storage',
  },
  media: {
    fileSize: 8 * 1024 * 1024,
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    ttl: null,
    accessTokenTTL: 60 * 60 * 1.5,
    mpJwtTTL: 60 * 60 * 2,
    name: 'mp',
    db: 1,
    password: 'ziv',
  },
  rateLimit: {
    windowMs: 60 * 1000,
    max: 1000,
  },
};

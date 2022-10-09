export interface AppConfig {
  port: number;
  origin: string;
  basePath: string;
  baseURL: string;
  encryptionPassphrase: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  ttl: string | null;
  name: string;
  password: string;
  db: number;
  accessTokenTTL: number;
  mpJwtTTL: number;
}

export interface MediaConfig {
  fileSize: number;
}

export interface Logger {
  path: string;
}

export interface TypeOrmConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  entities: any[];
  migrations: any[];
  timezone: string;
  logging?: boolean;
}

export interface JwtConfig {
  secret: string;
  signOptions: {
    expiresIn: string;
  };
  duration: string;
}

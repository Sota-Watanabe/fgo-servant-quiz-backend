import 'reflect-metadata';
import 'tsconfig-paths/register';
import { DataSource, DataSourceOptions } from 'typeorm';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Minimal .env loader to keep CLI migrations aligned with NestJS defaults
 * without introducing extra runtime dependencies.
 */
const loadEnvFile = () => {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const normalized =
      line.startsWith('export ') || line.startsWith('EXPORT ')
        ? line.replace(/^[Ee]xport\s+/, '')
        : line;
    const eqIndex = normalized.indexOf('=');
    if (eqIndex === -1) {
      continue;
    }

    const key = normalized.slice(0, eqIndex).trim();
    const value = normalized
      .slice(eqIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
};

loadEnvFile();

const rawLogging = process.env.DB_LOGGING ?? 'false';
const dbHost = process.env.DB_HOST ?? '127.0.0.1';
const dbSocketPath = process.env.DB_SOCKET_PATH;

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: dbHost,
  port: Number.parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'example-password',
  database: process.env.DB_NAME ?? 'fgo_servant_quiz',
  timezone: process.env.DB_TIMEZONE ?? 'Z',
  charset: process.env.DB_CHARSET ?? 'utf8mb4_unicode_ci',
  logging: rawLogging === 'true',
  synchronize: false,
  entities: [join(__dirname, 'entities/**/*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations/**/*.{ts,js}')],
  migrationsTableName: 'typeorm_migrations',
  extra: dbSocketPath ? { socketPath: dbSocketPath } : undefined,
};

const TypeOrmCliDataSource = new DataSource(dataSourceOptions);
export default TypeOrmCliDataSource;

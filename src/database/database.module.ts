import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const parseNumber = (
          rawValue: string | undefined,
          fallback: number,
        ): number => {
          const parsed = Number.parseInt(rawValue ?? '', 10);
          return Number.isNaN(parsed) ? fallback : parsed;
        };

        const loggingRaw = configService.get<string>('DB_LOGGING', 'false');
        const hostRaw = configService.get<string>('DB_HOST', '127.0.0.1');
        const socketPathRaw = configService.get<string>('DB_SOCKET_PATH');
        const useSocketFromHost = !socketPathRaw && hostRaw.startsWith('/');
        const host = useSocketFromHost ? '127.0.0.1' : hostRaw;

        const extraOptions =
          socketPathRaw || useSocketFromHost
            ? { socketPath: socketPathRaw ?? hostRaw }
            : undefined;

        return {
          type: 'mysql' as const,
          host,
          port: parseNumber(configService.get<string>('DB_PORT'), 3306),
          username: configService.get<string>('DB_USER', 'root'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_NAME', 'fgo_servant_quiz'),
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          logging: loggingRaw === 'true',
          timezone: configService.get<string>('DB_TIMEZONE', 'Z'),
          charset: configService.get<string>(
            'DB_CHARSET',
            'utf8mb4_unicode_ci',
          ),
          retryAttempts: parseNumber(
            configService.get<string>('DB_RETRY_ATTEMPTS'),
            5,
          ),
          retryDelay: parseNumber(
            configService.get<string>('DB_RETRY_DELAY_MS'),
            3000,
          ),
          ...(extraOptions ? { extra: extraOptions } : {}),
        };
      },
    }),
  ],
})
export class DatabaseModule {}

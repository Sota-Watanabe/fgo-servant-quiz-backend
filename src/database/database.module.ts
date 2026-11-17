import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbType = (
          configService.get<string>('DB_TYPE', 'mysql') || 'mysql'
        )
          .trim()
          .toLowerCase();

        if (dbType === 'sqlite') {
          return {
            type: 'better-sqlite3' as const,
            database: configService.get<string>(
              'SQLITE_PATH',
              '/tmp/fgo-servant-quiz.db',
            ),
            autoLoadEntities: true,
            synchronize: configService.get<string>('NODE_ENV') !== 'production',
            logging:
              configService.get<string>('DB_LOGGING', 'false') === 'true',
            timezone: configService.get<string>('DB_TIMEZONE', 'Z'),
          };
        }

        const loggingRaw = configService.get<string>('DB_LOGGING', 'false');
        const host = configService.get<string>('DB_HOST', '127.0.0.1');
        const socketPath =
          configService.get<string>('DB_SOCKET_PATH') ?? undefined;

        return {
          type: 'mysql' as const,
          host,
          port: Number.parseInt(
            configService.get<string>('DB_PORT', '3306'),
            10,
          ),
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
          extra: socketPath ? { socketPath } : undefined,
        };
      },
    }),
  ],
})
export class DatabaseModule {}

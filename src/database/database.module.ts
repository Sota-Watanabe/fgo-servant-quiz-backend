import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const loggingRaw = configService.get<string>('DB_LOGGING', 'false');

        return {
          type: 'mysql' as const,
          host: configService.get<string>('DB_HOST', '127.0.0.1'),
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
          extra: {
            socketPath: process.env.DB_HOST, // For Google Cloud SQL Unix socket
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}

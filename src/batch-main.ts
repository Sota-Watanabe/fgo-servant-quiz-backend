import { NestFactory } from '@nestjs/core';
import { BatchAppModule } from './batch/batch-app.module';

async function bootstrap() {
  const app = await NestFactory.create(BatchAppModule);

  // 構造化ログを使用
  app.useLogger(['log', 'error', 'warn', 'debug']);

  const parsedPort = parseInt(process.env.PORT ?? '', 10);
  const port = Number.isNaN(parsedPort) ? 8889 : parsedPort;

  await app.listen(port, '0.0.0.0');
  console.log(`Batch application is running on port ${port}`);
}

void bootstrap();

import { NestFactory } from '@nestjs/core';
import { BatchAppModule } from './batch/batch-app.module';
import { JsonLogger } from './common/json-logger';

async function bootstrap() {
  const app = await NestFactory.create(BatchAppModule);

  // JSON 形式のログを使用（Cloud Logging 用）
  app.useLogger(new JsonLogger());

  const parsedPort = parseInt(process.env.PORT ?? '', 10);
  const port = Number.isNaN(parsedPort) ? 8889 : parsedPort;

  await app.listen(port, '0.0.0.0');
  
  const logger = new JsonLogger('BatchBootstrap');
  logger.log(`Batch application is running on port ${port}`);
}

void bootstrap();

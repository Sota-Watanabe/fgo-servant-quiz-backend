import { NestFactory } from '@nestjs/core';
import { BatchAppModule } from './batch/batch-app.module';
import { JsonLogger } from './common/json-logger';
import { CloudTasksGateway } from './gateways/cloud-tasks.gateway';

async function bootstrap() {
  const app = await NestFactory.create(BatchAppModule);

  // JSON 形式のログを使用（Cloud Logging 用）
  app.useLogger(new JsonLogger());

  const parsedPort = parseInt(process.env.PORT ?? '', 10);
  const port = Number.isNaN(parsedPort) ? 8889 : parsedPort;

  await app.listen(port, '0.0.0.0');
  
  const logger = new JsonLogger('BatchBootstrap');
  logger.log(`Batch application is running on port ${port}`);

  // デプロイ後5分後にbasic_servant.jsonを更新するタスクを作成
  const cloudTasksGateway = app.get(CloudTasksGateway);
  if (cloudTasksGateway.isConfigured()) {
    try {
      await cloudTasksGateway.createUpdateBasicServantTask();
      logger.log('Scheduled update-basic-servant task for 5 minutes later');
    } catch (error) {
      logger.error('Failed to schedule update-basic-servant task', error);
    }
  } else {
    logger.warn('Cloud Tasks is not configured. Skipping task scheduling.');
  }
}

void bootstrap();

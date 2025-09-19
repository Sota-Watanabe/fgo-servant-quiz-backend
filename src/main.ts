import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS設定を有効にする（環境に応じて設定）
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
      : ['http://localhost:3000', 'http://192.168.10.112'];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Cloud RunのPORT環境変数を使用、デフォルトは8888
  const port = process.env.PORT || 8888;
  // Cloud Run用に0.0.0.0でリッスン
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
}

void bootstrap();

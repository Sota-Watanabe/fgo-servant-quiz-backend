import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // OpenAPI (Swagger) 設定
  const config = new DocumentBuilder()
    .setTitle('FGO Servant Quiz API')
    .setDescription('Fate/Grand Order Servant Quiz APIのドキュメント')
    .setVersion('1.0')
    .addTag('quiz', 'クイズ関連のエンドポイント')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORSはCorsMiddlewareで処理（OGPエンドポイントを除く）

  // Cloud RunのPORT環境変数を数値として解釈し、無効値はデフォルトの8888を使用
  const parsedPort = parseInt(process.env.PORT ?? '', 10);
  const port = Number.isNaN(parsedPort) ? 8888 : parsedPort;
  // Cloud Run用に0.0.0.0でリッスン
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/api`);
}

void bootstrap();

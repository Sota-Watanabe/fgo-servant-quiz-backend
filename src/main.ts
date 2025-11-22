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

  // CORSをルートごとに設定
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
      : ['http://localhost:3000', 'http://192.168.10.112'];

  // OGP以外のエンドポイントはCORS有効（credentials: true）
  // OGPエンドポイント（/ogp）はCORSヘッダーなし（画像を返すだけなので不要）
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // originがallowedOriginsに含まれるかチェック
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: (
      req: { url?: string },
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // OGPエンドポイントではcredentials: falseにする
      const isOgpEndpoint =
        typeof req.url === 'string' && req.url.startsWith('/ogp');
      callback(null, !isOgpEndpoint);
    },
  });

  // Cloud RunのPORT環境変数を数値として解釈し、無効値はデフォルトの8888を使用
  const parsedPort = parseInt(process.env.PORT ?? '', 10);
  const port = Number.isNaN(parsedPort) ? 8888 : parsedPort;
  // Cloud Run用に0.0.0.0でリッスン
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/api`);
}

void bootstrap();

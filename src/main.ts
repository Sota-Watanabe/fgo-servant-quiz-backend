import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response } from 'express';
import { JsonLogger } from './common/json-logger';
import { SqliteGcsSyncService } from './services/sqlite-gcs-sync.service';
import { BasicServantSyncService } from './services/basic-servant-sync.service';

async function bootstrap() {
  // GCS に最新の basic_servant.json があれば、起動前にローカルへ反映する。
  // 取得できない場合はイメージ同梱のファイルがそのまま使われる。
  await new BasicServantSyncService().downloadToLocal();

  // SQLite モードでは、NestFactory.create() で TypeORM が接続する前に
  // GCS から既存 DB をダウンロードしておく。
  // 接続後はローカルファイルが存在扱いになり、ダウンロードが
  // スキップされてしまうため、この順序が必須。
  if (SqliteGcsSyncService.resolveDbType() === 'sqlite') {
    await new SqliteGcsSyncService().downloadDbFromGcs();
  }

  const app = await NestFactory.create(AppModule);
  const sqliteGcsSyncService = app.get(SqliteGcsSyncService);

  // JSON 形式のログを使用（Cloud Logging 用）
  app.useLogger(new JsonLogger());

  // OpenAPI (Swagger) 設定
  const config = new DocumentBuilder()
    .setTitle('FGO Servant Quiz API')
    .setDescription('Fate/Grand Order Servant Quiz APIのドキュメント')
    .setVersion('1.0')
    .addTag('quiz', 'クイズ関連のエンドポイント')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // /ogp エンドポイント向けCORS設定
  // CDNキャッシュを保ったままフロントエンドからの事前フェッチを許可するため、'*' 固定で許容する
  app.use((req: Request, res: Response, next: () => void) => {
    if (req.url.startsWith('/ogp')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');

      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.sendStatus(204);
        return;
      }

      return next();
    }

    // それ以外のエンドポイントは CORS を適用
    const origin = req.headers.origin;
    const allowedOrigins =
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
        : ['http://localhost:3000', 'http://192.168.10.112'];

    if (
      !origin ||
      (typeof origin === 'string' && allowedOrigins.includes(origin))
    ) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE',
      );
      res.setHeader('Vary', 'Origin');

      // プリフライトリクエスト
      if (req.method === 'OPTIONS') {
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization',
        );
        res.sendStatus(204);
        return;
      }
    }

    next();
  });

  // Cloud RunのPORT環境変数を数値として解釈し、無効値はデフォルトの8888を使用
  const parsedPort = parseInt(process.env.PORT ?? '', 10);
  const port = Number.isNaN(parsedPort) ? 8888 : parsedPort;

  const shutdown = () => {
    void (async () => {
      if (SqliteGcsSyncService.resolveDbType() === 'sqlite') {
        await sqliteGcsSyncService.uploadDbToGcs();
      }
      await app.close();
      process.exit(0);
    })();
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Cloud Run用に0.0.0.0でリッスン
  await app.listen(port, '0.0.0.0');

  const logger = new JsonLogger('Bootstrap');
  logger.log(`Application is running on port ${port}`);
  logger.log(`Swagger UI is available at http://localhost:${port}/api`);
}

void bootstrap();

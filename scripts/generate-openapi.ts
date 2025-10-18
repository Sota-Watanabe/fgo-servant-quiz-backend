import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from '../src/app.module';

async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('FGO Servant Quiz API')
    .setDescription('Fate/Grand Order Servant Quiz APIのドキュメント')
    .setVersion('1.0')
    .addTag('quiz', 'クイズ関連のエンドポイント')
    .addTag('demo', 'デモ用のエンドポイント')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // OpenAPI仕様をJSONファイルとして出力
  writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  console.log('OpenAPI specification generated: openapi.json');

  await app.close();
}

generateOpenApiSpec().catch(console.error);

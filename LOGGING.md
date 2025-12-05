# JSON Logger for Cloud Logging

## 概要

NestJS の標準 Logger を拡張した `JsonLogger` クラスを実装しました。このクラスは、Cloud Logging で自動解析しやすい JSON 形式でログを出力します。

## 実装ファイル

- `src/common/json-logger.ts` - JsonLogger クラスの実装
- `src/main.ts` - メインアプリケーションでの使用例
- `src/batch-main.ts` - バッチアプリケーションでの使用例

## 主な機能

### 1. JSON 形式でのログ出力

すべてのログは以下の構造で JSON 形式で出力されます：

```json
{
  "severity": "INFO",
  "timestamp": "2025-12-06T10:30:45.123Z",
  "message": "Application is running on port 8888",
  "context": "Bootstrap"
}
```

### 2. Cloud Logging 対応

- `severity` フィールドを使用（Cloud Logging が標準で認識）
- サポートされる severity レベル:
  - `INFO` - 通常のログ（log メソッド）
  - `ERROR` - エラーログ（error メソッド）
  - `WARNING` - 警告ログ（warn メソッド）
  - `DEBUG` - デバッグログ（debug, verbose メソッド）

### 3. エラー時のスタックトレース

エラーログの場合、スタックトレースが自動的に含まれます：

```json
{
  "severity": "ERROR",
  "timestamp": "2025-12-06T10:30:45.123Z",
  "message": "Failed to fetch servant data",
  "context": "AtlasAcademyGateway",
  "trace": "Error: Network error\n    at AtlasAcademyGateway.fetchServant (...)"
}
```

## 使用方法

### アプリケーション全体への適用

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JsonLogger } from './common/json-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // JsonLogger を使用
  app.useLogger(new JsonLogger());
  
  await app.listen(3000);
}
```

### コンテキスト付きロガーの作成

```typescript
import { JsonLogger } from './common/json-logger';

export class MyService {
  private readonly logger = new JsonLogger('MyService');
  
  doSomething() {
    this.logger.log('Processing started');
    this.logger.debug('Debug information', { userId: 123 });
    this.logger.warn('Something unusual happened');
    this.logger.error('Failed to process', 'Error stack trace...');
  }
}
```

### Controller での使用

```typescript
import { Controller, Logger } from '@nestjs/common';

@Controller('quiz')
export class QuizController {
  private readonly logger = new Logger(QuizController.name);
  
  @Get('skill')
  getSkillQuiz() {
    this.logger.log('Skill quiz requested');
    // ...
  }
}
```

## ログ出力例

### 通常ログ

```typescript
logger.log('User logged in', 'AuthService');
```

**出力:**
```json
{
  "severity": "INFO",
  "timestamp": "2025-12-06T10:30:45.123Z",
  "message": "User logged in",
  "context": "AuthService"
}
```

### パラメータ付きログ

```typescript
logger.log('Processing request', { userId: 123, action: 'fetch' }, 'QuizService');
```

**出力:**
```json
{
  "severity": "INFO",
  "timestamp": "2025-12-06T10:30:45.123Z",
  "message": "Processing request",
  "context": "QuizService",
  "params": [
    {
      "userId": 123,
      "action": "fetch"
    }
  ]
}
```

### エラーログ

```typescript
try {
  throw new Error('Database connection failed');
} catch (error) {
  logger.error('Failed to connect', error.stack, 'DatabaseService');
}
```

**出力:**
```json
{
  "severity": "ERROR",
  "timestamp": "2025-12-06T10:30:45.123Z",
  "message": "Failed to connect",
  "context": "DatabaseService",
  "trace": "Error: Database connection failed\n    at DatabaseService.connect (/app/src/database.service.ts:45:11)"
}
```

### 警告ログ

```typescript
logger.warn('API rate limit approaching', 'AtlasAcademyGateway');
```

**出力:**
```json
{
  "severity": "WARNING",
  "timestamp": "2025-12-06T10:30:45.123Z",
  "message": "API rate limit approaching",
  "context": "AtlasAcademyGateway"
}
```

### デバッグログ

```typescript
logger.debug('Cache hit', { key: 'servant:100', ttl: 3600 }, 'CacheService');
```

**出力:**
```json
{
  "severity": "DEBUG",
  "timestamp": "2025-12-06T10:30:45.123Z",
  "message": "Cache hit",
  "context": "CacheService",
  "params": [
    {
      "key": "servant:100",
      "ttl": 3600
    }
  ]
}
```

## Cloud Logging での表示

Google Cloud Logging では、以下のように自動的に解析されます：

1. **severity フィールド** - ログレベルとして認識され、フィルタリングが可能
2. **timestamp フィールド** - タイムスタンプとして認識され、時系列表示
3. **message フィールド** - メインメッセージとして表示
4. **その他のフィールド** - JSON ペイロードとして構造化表示

### Cloud Logging でのフィルタ例

```
# ERROR レベルのログのみ表示
severity="ERROR"

# 特定のコンテキストのログのみ表示
jsonPayload.context="AtlasAcademyGateway"

# 特定の期間のログを表示
timestamp>="2025-12-06T00:00:00Z" AND timestamp<="2025-12-06T23:59:59Z"

# エラーとワーニングのみ
severity>="WARNING"
```

## NestJS の既存 Logger との互換性

`JsonLogger` は NestJS の `LoggerService` インターフェースを実装しているため、既存のコードとの互換性が保たれます：

- `Logger.log()` → JSON 形式で INFO レベル
- `Logger.error()` → JSON 形式で ERROR レベル（スタックトレース付き）
- `Logger.warn()` → JSON 形式で WARNING レベル
- `Logger.debug()` → JSON 形式で DEBUG レベル
- `Logger.verbose()` → JSON 形式で DEBUG レベル

## 環境による切り替え

開発環境では通常のログ、本番環境では JSON ログを使用したい場合：

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JsonLogger } from './common/json-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 本番環境のみ JSON ログを使用
  if (process.env.NODE_ENV === 'production') {
    app.useLogger(new JsonLogger());
  } else {
    app.useLogger(['log', 'error', 'warn', 'debug']);
  }
  
  await app.listen(3000);
}
```

## まとめ

- ✅ Cloud Logging で自動解析される JSON 形式
- ✅ severity フィールドで適切なログレベル管理
- ✅ エラー時のスタックトレース自動付与
- ✅ NestJS の既存 Logger との完全な互換性
- ✅ コンテキスト情報の構造化
- ✅ 追加パラメータの柔軟な指定

これにより、Cloud Run / Cloud Logging 環境でのログ可視性と検索性が大幅に向上します。

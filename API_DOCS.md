# FGO Servant Quiz API

Fate/Grand Order Servant Quiz APIのOpenAPI仕様書です。

## API概要

このAPIは、Fate/Grand Orderのサーヴァント情報を使用したクイズアプリケーション用のバックエンドAPIです。

### 基本情報

- **タイトル**: FGO Servant Quiz API
- **バージョン**: 1.0
- **ベースURL**: `http://localhost:8888` (開発環境)

## 利用可能なエンドポイント

### 1. ヘルスチェック

- **エンドポイント**: `GET /`
- **説明**: アプリケーションの状態を確認
- **レスポンス**: `string`

### 2. スキルクイズ取得

- **エンドポイント**: `GET /quiz/skill`
- **説明**: ランダムなサーヴァントのスキル情報を含むクイズデータを返す
- **レスポンス**: `ServantDetailGetResponseDto`

### 3. デモクイズ取得

- **エンドポイント**: `GET /demo/quiz`
- **説明**: デモ用のクイズデータを返す
- **レスポンス**: `string`

## データモデル

### ServantDetailGetResponseDto

サーヴァントの詳細情報を含むレスポンスデータ

- `id`: サーヴァントID
- `collectionNo`: コレクション番号
- `name`: サーヴァント名
- `originalName`: オリジナル名
- `ruby`: ルビ
- `classId`: クラスID
- `rarity`: レア度
- `noblePhantasms`: ノーブルファンタズム一覧
- `skills`: スキル一覧

### NoblePhantasm

ノーブルファンタズム情報

- `id`: ノーブルファンタズムID
- `num`: 番号
- `card`: カードタイプ
- `name`: 名前
- `originalName`: オリジナル名
- `ruby`: ルビ
- `icon`: アイコンURL
- `rank`: ランク
- `type`: タイプ
- `effectFlags`: 効果フラグ
- `detail`: 詳細説明
- `unmodifiedDetail`: 未修正の詳細説明

### Skill

スキル情報

- `id`: スキルID
- `num`: スキル番号
- `name`: スキル名
- `originalName`: オリジナル名
- `ruby`: ルビ
- `detail`: 詳細説明
- `unmodifiedDetail`: 未修正の詳細説明
- `type`: スキルタイプ
- `priority`: 優先度
- `icon`: アイコンURL

## OpenAPI仕様書の生成

以下のコマンドでOpenAPI仕様書を生成できます：

```bash
npm run generate:openapi
```

生成された仕様書は `openapi.json` ファイルに保存されます。

## Swagger UI

アプリケーションを起動すると、以下のURLでSwagger UIにアクセスできます：

```
http://localhost:8888/api
```

## 開発・テスト

### アプリケーションの起動

```bash
# 開発モード
npm run start:dev

# プロダクションモード
npm run start:prod
```

### OpenAPI仕様書の確認

1. アプリケーションを起動
2. ブラウザで `http://localhost:8888/api` にアクセス
3. Swagger UIでAPIドキュメントを確認

## 技術スタック

- **フレームワーク**: NestJS
- **OpenAPI**: @nestjs/swagger
- **ドキュメント**: Swagger UI
- **言語**: TypeScript

## CORS設定

開発環境では以下のオリジンからのアクセスが許可されています：

- `http://localhost:3000`
- `http://192.168.10.112`

本番環境では環境変数 `FRONTEND_URL` で設定されたURLからのアクセスが許可されます。
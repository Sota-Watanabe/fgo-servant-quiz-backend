# FGO Servant Quiz Backend Instructions

Fate/Grand Order のサーヴァント情報を用いたクイズアプリ向けバックエンド（NestJS 11 / TypeScript）の全体像と運用ルールをまとめています。個別の README テンプレートでは触れられていない、本プロジェクト固有の手順やアーキテクチャを参照してください。

## 1. プロジェクト概要
- 目的: Atlas Academy API からサーヴァント詳細を取得し、フロントエンド向けにクイズデータ（スキル/プロフィール）と選択肢一覧を提供。
- フレームワーク: NestJS 11（Express プラットフォーム）、Swagger で OpenAPI 文書化。
- データソース: `data/basic_servant.json` のローカルダンプと Atlas Academy API (`https://api.atlasacademy.io`) を併用。
- ホスティング想定: Google Cloud Run。Docker マルチステージビルドで Node.js 18-alpine を利用。

## 2. 技術スタック・外部依存
- 言語/ツール: TypeScript 5, Node.js 18（Dockerfile 参照）, npm, Jest, ESLint, Prettier。
- 外部サービス: Atlas Academy API（JP リージョン）。アクセス時は `lore=true&lang=jp` パラメータを付与。
- 主要ライブラリ: `@nestjs/*`, `@nestjs/swagger`, `axios`, `ts-node`, `tsconfig-paths`。
- OpenAPI 生成: `scripts/generate-openapi.ts` を `ts-node` で実行し `openapi.json` を生成。

## 3. ディレクトリ構成と主要ファイル
- `src/main.ts`: Nest アプリ起動、Swagger 設定、CORS 設定、`PORT`/`FRONTEND_URL` の取り扱い。
- `src/app.module.ts`: DI コンテナ登録。Controller と Service/Interactor/Gateway を束ねる。
- `src/quiz/*`: クイズ系コントローラ（`QuizController`）と旧来の `QuizService`。現在のビジネスロジックはインタラクター経由で実行。
- `src/servants/*`: サーヴァント選択肢 API。`ServantsController` は `GetServantOptionsInteractor` を利用。
- `src/interactors/*`: UseCase 層。Dump + 外部 API 呼び出しを組み合わせて DTO を生成。
- `src/services/*`: インフラ層。`DumpService` はローカル JSON 参照、`FgoGameApiService` は Gateway 経由で API 呼び出し。
- `src/gateways/*`: 外部 API との通信。`AtlasAcademyGateway` が Atlas Academy API と通信し、レスポンスを `data/*` にデバッグ保存。
- `src/dto/*`: API レイヤーで返却するレスポンスモデルと、Atlas Academy の型定義。
- `data/`: `basic_servant.json`（サーヴァント一覧ダンプ）とデバッグ出力が格納される。
- `scripts/generate-openapi.ts`: Nest アプリから Swagger ドキュメントを生成。
- `API_DOCS.md`: エンドポイント概要と OpenAPI 生成手順のメモ。
- `DEPLOY.md`: Cloud Run へのデプロイ手順と GitHub Actions 用シークレット一覧。

## 4. 実装アーキテクチャ
### リクエストライフサイクル
`Controller` → `Interactor` → `Service` → `Gateway` → 外部 API/データ → DTO 生成 → レスポンス。

### Controller 層
- `AppController`: `/` のヘルスチェック。
- `QuizController`: `GET /quiz/skill`, `GET /quiz/profile` を公開。インタラクターを介してレスポンスを生成し Swagger メタデータを付与。
- `ServantsController`: `GET /servants/options` を公開し、選択肢一覧を返す。

### Interactor 層
- `GetQuizSkillInteractor`: ランダムなサーヴァントをダンプから選択し、スキルクイズ用の詳細 DTO を組み立てる。
- `GetQuizProfileInteractor`: 上記と同様にプロフィール情報を抽出。
- `GetServantOptionsInteractor`: ダンプ内の全サーヴァントから表示用データへ整形。

### Service / Gateway 層
- `DumpService`: `data/basic_servant.json` からサーヴァント配列を読み込み、ランダム抽出も担当。
- `FgoGameApiService`: Gateway をラップし、アプリ側からの依存を抽象化。
- `AtlasAcademyGateway`: axios で外部 API を呼び出し、レスポンスを `data/servant-detail-*.json` に保存してデバッグを補助。

### DTO
- `ServantDetailGetResponseDto`, `ServantProfileGetResponseDto`, `ServantsOptionsGetResponseDto` などが HTTP レスポンス整形を担当。
- `NiceServantDetailResponse` は Atlas Academy API からの生レスポンスの型定義。

### 注意点
- 旧来の `QuizService` / `ServantsService` も残存していますが、新規コードは Interactor+Service+Gateway を利用する構成に揃えてください。
- `@/*` のパスエイリアスが `tsconfig.json` に設定されています（`baseUrl: ./src`）。`tsconfig-paths/register` 経由で解決されるため、ランタイムでも利用可能です。

## 5. 環境設定と環境変数
- 既定ポート: ローカルは `8888`（`main.ts`）、Cloud Run では `PORT` が割り当てられるため `0.0.0.0` で待ち受け。
- CORS: 開発中は `http://localhost:3000` と `http://192.168.10.112`。本番は `FRONTEND_URL` 環境変数で設定。
- 推奨 Node.js バージョン: 18 系（Dockerfile 基準）。
- その他必要に応じて `NODE_ENV`, `PORT` を指定。Cloud Run デプロイでは `NODE_ENV=production` を想定。

## 6. ローカル開発手順
1. 依存関係インストール  
   ```bash
   npm ci
   ```
2. 開発サーバ起動  
   ```bash
   npm run start:dev
   ```
   Swagger UI: `http://localhost:8888/api`
3. 本番ビルド/実行  
   ```bash
   npm run build
   npm run start:prod
   ```
4. OpenAPI 仕様生成  
   ```bash
   npm run generate:openapi
   ```
   生成物はルートの `openapi.json`。`API_DOCS.md` も参照。

## 7. API エンドポイント一覧
- `GET /` — ヘルスチェック文字列。
- `GET /quiz/skill` — ランダムなサーヴァントのスキル情報。`ServantDetailGetResponseDto` を返却。
- `GET /quiz/profile` — ランダムなサーヴァントのプロフィール情報。`ServantProfileGetResponseDto` を返却。
- `GET /servants/options` — クイズ用選択肢の一覧。`ServantsOptionsGetResponseDto` を返却。

（詳細なフィールド仕様は Swagger UI または `openapi.json` を参照。）

## 8. 品質管理・開発補助
- Lint: `npm run lint`（`eslint.config.mjs` で TypeScript + Prettier 推奨設定）。
- テスト: `npm run test`（Jest、`--passWithNoTests` が有効）。カバレッジ `npm run test:cov`。
- フォーマット: `npm run format`（Prettier）。
- CI/CD: GitHub Actions で Cloud Run へデプロイ（`DEPLOY.md` に詳細）。

## 9. デプロイと運用
- Google Cloud Run をターゲットにしたマルチステージ Docker ビルドを採用。`Dockerfile` は本番用依存のみを含む最終イメージを生成。
- GitHub Actions からデプロイする際は以下のシークレットが必須（`DEPLOY.md` 参照）:
  - `GCP_PROJECT_ID`
  - `GCP_SA_KEY`
- Cloud Run リソース設定（例）: リージョン `asia-northeast1`, メモリ 1Gi, CPU 1。ポートは Cloud Run により割り当てられる。
- ローカル Docker テスト:
  ```bash
  docker build -t fgo-backend .
  docker run -p 3000:3000 fgo-backend
  ```

## 10. デバッグとデータ管理
- `AtlasAcademyGateway` は取得した詳細レスポンスを `data/servant-detail-*.json` に保存します。不要になったデバッグファイルは手動で削除してください。
- `DumpService` のソースである `data/basic_servant.json` を差し替えることで対象サーヴァントの範囲を更新可能。大規模ファイルのためバージョン管理ポリシーに注意。
- `data/res.json` は旧 `QuizService` のデバッグ出力です。現在のフローでは使用していません。

## 11. 参考資料と補足
- `API_DOCS.md`: 簡易 API ドキュメントと OpenAPI 生成手順。
- `openapi.json`: `npm run generate:openapi` の出力。フロントエンドや他言語クライアント生成時に利用。
- `DEPLOY.md`: Cloud Run / GitHub Actions 設定の詳細手順。
- ルートの `README.md` は NestJS のテンプレートです。本ドキュメントの内容を優先してください。

以上を基準に、機能追加・修正時は Interactor ベースの構成と DTO レイヤーの整合性を保ちながら実装してください。

# FGO Servant Quiz Backend - デプロイ設定

## 必要なGitHubシークレット

バックエンドをCloud Runにデプロイするために、以下のGitHubシークレットが必要です：

### 必須シークレット
- `GCP_PROJECT_ID`: Google Cloud プロジェクトID
- `GCP_SA_KEY`: サービスアカウントキー（JSON形式）
- `GCP_WORKLOAD_IDENTITY_PROVIDER`: Workload Identity Provider のリソース名（例: `projects/123456789/locations/global/workloadIdentityPools/github-actions/providers/fgo-backend`）
- `GCP_SERVICE_ACCOUNT_EMAIL`: GitHub Actions から委譲するサービスアカウントのメールアドレス
## デプロイ前の準備

### 1. Google Cloud設定

#### Artifact Registryリポジトリの作成
```bash
gcloud artifacts repositories create fgo-quiz \
    --repository-format=docker \
    --location=asia-northeast1 \
    --description="FGO Quiz application images"
```

#### サービスアカウントの作成と権限設定
```bash
# サービスアカウント作成
gcloud iam service-accounts create cloudrun-deploy-sa \
    --description="Service account for deploying to Cloud Run" \
    --display-name="Cloud Run Deploy SA"

# 必要な権限を付与
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cloudrun-deploy-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cloudrun-deploy-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:cloudrun-deploy-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

#### Workload Identity Federationの設定
GitHub ActionsからCloud Runのサービスアカウントに委譲するため、OIDCフェデレーションを構成します。`YOUR_PROJECT_ID` や `REPOSITORY_OWNER/REPOSITORY_NAME` は実際の値に置き換えてください。

```bash
# Workload Identity Poolの作成
gcloud iam workload-identity-pools create github-actions \
    --project=YOUR_PROJECT_ID \
    --location="global" \
    --display-name="GitHub Actions Pool"

# GitHub用OIDCプロバイダの作成
gcloud iam workload-identity-pools providers create-oidc fgo-backend \
    --project=YOUR_PROJECT_ID \
    --location="global" \
    --workload-identity-pool="github-actions" \
    --display-name="GitHub Actions Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com"

# GitHubリポジトリに権限を委譲
POOL_ID="projects/$(gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)')/locations/global/workloadIdentityPools/github-actions"
gcloud iam service-accounts add-iam-policy-binding cloudrun-deploy-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/REPOSITORY_OWNER/REPOSITORY_NAME"

### 4. Cloud Run 実行サービスアカウントの割り当て
Cloud Run の実行環境ではサービスアカウントキーの代わりに、Cloud Run サービスに実行サービスアカウントを直接割り当てます。既存のサービスに反映するには以下のコマンドを実行してください。

```bash
gcloud run services update YOUR_SERVICE_NAME \
  --region=asia-northeast1 \
  --service-account=cloudrun-deploy-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

Cloud Run から Vertex AI（例: 推論エンドポイント）にアクセスする場合は、上記で割り当てたサービスアカウントに `roles/aiplatform.user` など必要なロールを付与します。

```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:cloudrun-deploy-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### 2. GitHubリポジトリ設定

#### シークレットの設定
1. GitHubリポジトリの Settings > Secrets and variables > Actions に移動
2. 以下のシークレットを追加：
   - `GCP_PROJECT_ID`: Google CloudプロジェクトID
   - `GCP_WORKLOAD_IDENTITY_PROVIDER`: 上記で作成したプロバイダのリソース名
     - 例: `projects/123456789/locations/global/workloadIdentityPools/github-actions/providers/fgo-backend`
   - `GCP_SERVICE_ACCOUNT_EMAIL`: `cloudrun-deploy-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com`
   - `FRONTEND_URL`: 本番フロントエンドのURL（デプロイ時の環境変数に使用）

### 3. Cloud Run APIの有効化
```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## デプロイワークフロー

GitHub Actionsワークフローは以下の場合に実行されます：
- `main`ブランチへのプッシュ
- 手動トリガー（workflow_dispatch）

### ワークフロー手順
1. コードのチェックアウト
2. Node.js環境のセットアップ
3. 依存関係のインストール
4. テストの実行
5. アプリケーションのビルド
6. Google Cloudへの認証
7. Dockerイメージのビルド
8. Artifact Registryへのプッシュ
9. Cloud Runへのデプロイ

ワークフロー内の `gcloud run deploy` コマンドは `--service-account=${{ secrets.GCP_SERVICE_ACCOUNT_EMAIL }}` を付与し、Cloud Run 実行サービスアカウントを明示的に指定します。

## 環境変数

### プロダクション環境で設定される環境変数
- `NODE_ENV=production`

### 追加の環境変数が必要な場合
`deploy.yml`の`--set-env-vars`セクションに追加してください：
```yaml
--set-env-vars NODE_ENV=production,DATABASE_URL=${{ secrets.DATABASE_URL }}
```

## データベース（Cloud SQL for MySQL）のセットアップとデプロイ手順

本番環境では Cloud SQL for MySQL を利用してアプリケーションと同時にデータベースもデプロイします。以下の手順でインフラとアプリを紐付けてください。

### 1. Cloud SQL インスタンス作成

```bash
gcloud sql instances create fgo-servant-quiz-sql \
  --database-version=MYSQL_8_0 \
  --tier=db-g1-small \
  --region=asia-northeast1
```

### 2. データベースとユーザーの作成

```bash
gcloud sql databases create fgo_servant_quiz --instance=fgo-servant-quiz-sql

gcloud sql users create fgo_app_user \
  --instance=fgo-servant-quiz-sql \
  --password=YOUR_STRONG_PASSWORD
```

### 3. Cloud Run との接続設定

1. インスタンス接続名を取得：
   ```bash
   gcloud sql instances describe fgo-servant-quiz-sql \
     --format='value(connectionName)'
   ```
2. Cloud Run サービスに Cloud SQL 接続を追加：
   ```bash
   gcloud run services update fgo-servant-quiz-backend \
     --region=asia-northeast1 \
     --add-cloudsql-instances=PROJECT_ID:asia-northeast1:fgo-servant-quiz-sql
   ```
3. 環境変数を設定（`DB_HOST` は Cloud SQL Auth Proxy のソケットパスを指定）：
   ```bash
   gcloud run services update fgo-servant-quiz-backend \
     --region=asia-northeast1 \
     --set-env-vars DB_HOST=/cloudsql/PROJECT_ID:asia-northeast1:fgo-servant-quiz-sql,DB_USER=fgo_app_user,DB_PASSWORD=YOUR_STRONG_PASSWORD,DB_NAME=fgo_servant_quiz,DB_PORT=3306
   ```

### 4. マイグレーションの実行

アプリの初回デプロイまたはスキーマ変更時は TypeORM マイグレーションを Cloud SQL に対して実行します。

#### ローカルから実行する場合
Cloud SQL Auth Proxy を起動した状態で以下を実行：
```bash
npm ci
npm run migrate:run
```

#### GitHub Actions から実行する場合の例
Cloud SQL Auth Proxy をワークフロー内で立ち上げ、同じアーティファクトを使ってマイグレーションを流します。

```yaml
      - name: Start Cloud SQL Proxy
        run: |
          wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
          chmod +x cloud_sql_proxy
          ./cloud_sql_proxy -instances=${{ secrets.CLOUDSQL_CONNECTION_NAME }}=tcp:3306 &

      - name: Run database migrations
        env:
          DB_HOST: 127.0.0.1
          DB_PORT: 3306
          DB_USER: ${{ secrets.DB_USER }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
          DB_NAME: fgo_servant_quiz
        run: |
          npm ci
          npm run migrate:run
```

> **Tip:** Cloud SQL の資格情報は Secret Manager や GitHub Secrets に保管し、`gcloud run deploy` の `--set-secrets` や `--set-env-vars` で注入してください。

## ローカルでのDockerテスト

```bash
# Dockerイメージのビルド
docker build -t fgo-backend .

# コンテナの実行
docker run -p 3000:3000 fgo-backend
```

## トラブルシューティング

### 一般的な問題
1. **権限エラー**: サービスアカウントに必要な権限が付与されているか確認
2. **Artifact Registry接続エラー**: リポジトリが正しく作成されているか確認
3. **ビルドエラー**: package.jsonとDockerfileの整合性を確認

### ログの確認
```bash
# Cloud Runサービスのログ確認
gcloud logs read --service=fgo-servant-quiz-backend --limit=50
```

## サービス情報

- **サービス名**: `fgo-servant-quiz-backend`
- **リージョン**: `asia-northeast1`
- **ポート**: `3000`
- **メモリ**: `1Gi`
- **CPU**: `1`
- **インスタンス範囲**: `0-10`

# FGO Servant Quiz Backend - デプロイ設定

## 必要なGitHubシークレット

バックエンドをCloud Runにデプロイするために、以下のGitHubシークレットが必要です：

### 必須シークレット
- `GCP_PROJECT_ID`: Google Cloud プロジェクトID
- `GCP_SA_KEY`: サービスアカウントキー（JSON形式）

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

# サービスアカウントキーの作成
gcloud iam service-accounts keys create ~/cloudrun-deploy-sa-key.json \
    --iam-account=cloudrun-deploy-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 2. GitHubリポジトリ設定

#### シークレットの設定
1. GitHubリポジトリの Settings > Secrets and variables > Actions に移動
2. 以下のシークレットを追加：
   - `GCP_PROJECT_ID`: Google CloudプロジェクトID
   - `GCP_SA_KEY`: 上記で作成したサービスアカウントキーの内容（JSON全体）

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

## 環境変数

### プロダクション環境で設定される環境変数
- `NODE_ENV=production`

### 追加の環境変数が必要な場合
`deploy.yml`の`--set-env-vars`セクションに追加してください：
```yaml
--set-env-vars NODE_ENV=production,DATABASE_URL=${{ secrets.DATABASE_URL }}
```

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

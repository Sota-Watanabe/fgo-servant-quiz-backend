import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class CloudStorageGateway {
  private readonly logger = new Logger(CloudStorageGateway.name);
  private storage: Storage | null = null;
  private bucketName: string;

  constructor() {
    const projectId = process.env.GCP_PROJECT_ID;
    this.bucketName = process.env.GCS_BUCKET_NAME || '';

    // Cloud Run などの GCP 環境では自動的にサービスアカウントで認証される
    // ローカル開発時は Application Default Credentials (ADC) を使用
    if (projectId && this.bucketName) {
      this.storage = new Storage({
        projectId,
      });
      this.logger.log(
        `Cloud Storage initialized for bucket: ${this.bucketName}`,
      );
    } else {
      this.logger.warn('Cloud Storage is not configured. Using local storage.');
    }
  }

  isConfigured(): boolean {
    return this.storage !== null && !!this.bucketName;
  }

  async uploadFile(
    buffer: Buffer,
    destination: string,
    contentType: string = 'image/png',
  ): Promise<string> {
    if (!this.storage || !this.bucketName) {
      throw new Error('Cloud Storage is not configured');
    }

    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(destination);

    await file.save(buffer, {
      contentType,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    // ファイルを公開設定にする
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${destination}`;
    this.logger.log(`File uploaded successfully: ${publicUrl}`);

    return publicUrl;
  }

  /**
   * 指定されたパターンに一致するファイルを検索
   * @param prefix ファイルパスのプレフィックス（例: 'ogp/ogp-skill-300900-'）
   * @returns 見つかったファイルのパス（最新のもの）、なければnull
   */
  async findLatestFile(prefix: string): Promise<string | null> {
    if (!this.storage || !this.bucketName) {
      return null;
    }

    const bucket = this.storage.bucket(this.bucketName);
    const [files] = await bucket.getFiles({ prefix });

    if (files.length === 0) {
      return null;
    }

    // ファイル名でソートして最新のものを返す（タイムスタンプ降順）
    const sortedFiles = files.sort((a, b) => b.name.localeCompare(a.name));
    return sortedFiles[0].name;
  }

  /**
   * ファイルをダウンロード
   * @param filePath ファイルパス
   * @returns ファイルのBuffer
   */
  async downloadFile(filePath: string): Promise<Buffer> {
    if (!this.storage || !this.bucketName) {
      throw new Error('Cloud Storage is not configured');
    }

    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(filePath);

    const [buffer] = await file.download();
    return buffer;
  }
}

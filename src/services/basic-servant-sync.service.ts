import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

import { CloudStorageGateway } from '@/gateways/cloud-storage.gateway';

/** GCS 上の basic_servant.json のオブジェクト名 */
export const BASIC_SERVANT_GCS_OBJECT = 'data/basic_servant.json';

export function resolveBasicServantGcsObject(): string {
  return process.env.BASIC_SERVANT_GCS_OBJECT || BASIC_SERVANT_GCS_OBJECT;
}

/**
 * バッチが GCS に置いた最新の basic_servant.json を、API 起動時に
 * ローカルファイルへ反映するための同期サービス。
 * NestFactory.create() より前に使うため、DI 外でも生成できる形にしている。
 */
@Injectable()
export class BasicServantSyncService {
  private readonly logger = new Logger(BasicServantSyncService.name);
  private readonly gateway = new CloudStorageGateway();
  private readonly localPath = path.join(
    process.cwd(),
    'data',
    'basic_servant.json',
  );

  /**
   * GCS の basic_servant.json をダウンロードしてローカルファイルを差し替える。
   * 未設定・取得失敗・内容が不正な場合は同梱ファイルをそのまま使い、false を返す。
   */
  async downloadToLocal(): Promise<boolean> {
    if (!this.gateway.isConfigured()) {
      this.logger.debug(
        'Cloud Storage is not configured. Using bundled basic_servant.json.',
      );
      return false;
    }

    try {
      const buffer = await this.gateway.downloadFile(
        resolveBasicServantGcsObject(),
      );
      const parsed: unknown = JSON.parse(buffer.toString('utf8'));
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.logger.warn(
          'Downloaded basic_servant.json is empty or invalid. Keeping the bundled file.',
        );
        return false;
      }

      await fs.writeFile(this.localPath, buffer);
      this.logger.log(
        `Downloaded basic_servant.json from GCS (${parsed.length} servants).`,
      );
      return true;
    } catch (error) {
      this.logger.warn(
        `Could not download basic_servant.json from GCS. Using the bundled file. Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return false;
    }
  }
}

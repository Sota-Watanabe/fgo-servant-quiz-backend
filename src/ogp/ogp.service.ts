import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CloudStorageGateway } from '@/gateways/cloud-storage.gateway';
import { CloudTasksGateway } from '@/gateways/cloud-tasks.gateway';
import { QuizCardType } from '@/quiz/quiz-card.constants';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class OgpService {
  private readonly logger = new Logger(OgpService.name);

  constructor(
    private readonly cloudStorageGateway: CloudStorageGateway,
    private readonly cloudTasksGateway: CloudTasksGateway,
  ) {}

  /**
   * OGP画像を取得
   * @param type クイズタイプ
   * @param servantId サーヴァントID
   * @returns 画像のBuffer
   */
  async getOgpImage(type: QuizCardType, servantId: number): Promise<Buffer> {
    try {
      // Cloud Storage から取得を試みる
      this.logger.log(
        `Checking Cloud Storage for OGP image: type=${type}, servantId=${servantId}`,
      );
      if (this.cloudStorageGateway.isConfigured()) {
        return await this.getFromCloudStorage(type, servantId);
      }

      // ローカルファイルシステムから取得
      return await this.getFromLocalStorage(type, servantId);
    } catch (error) {
      // 画像が見つからない場合、Cloud Tasksにタスクを追加
      this.logger.log(
        `OGP image not found for ${type}/${servantId}. Creating task for generation.`,
      );
      await this.cloudTasksGateway.createOgpGenerationTask(type, servantId);
      throw error;
    }
  }

  private async getFromCloudStorage(
    type: QuizCardType,
    servantId: number,
  ): Promise<Buffer> {
    const prefix = `ogp/ogp-${type}-${servantId}-`;
    this.logger.log(`Searching for file with prefix: ${prefix}`);

    const filePath = await this.cloudStorageGateway.findLatestFile(prefix);

    if (!filePath) {
      this.logger.warn(`OGP image not found: ${prefix}`);
      throw new NotFoundException('OGP image not found');
    }

    this.logger.log(`Found file: ${filePath}`);
    return this.cloudStorageGateway.downloadFile(filePath);
  }

  private async getFromLocalStorage(
    type: QuizCardType,
    servantId: number,
  ): Promise<Buffer> {
    const ogpDir = path.join(process.cwd(), 'data', 'ogp');
    const prefix = `ogp-${type}-${servantId}-`;

    try {
      const files = await fs.readdir(ogpDir);
      const matchingFiles = files
        .filter((f) => f.startsWith(prefix) && f.endsWith('.png'))
        .sort()
        .reverse();

      if (matchingFiles.length === 0) {
        throw new NotFoundException('OGP image not found');
      }

      const filePath = path.join(ogpDir, matchingFiles[0]);
      this.logger.log(`Reading local file: ${filePath}`);
      return fs.readFile(filePath);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to read local OGP image: ${message}`);
      throw new NotFoundException('OGP image not found');
    }
  }
}

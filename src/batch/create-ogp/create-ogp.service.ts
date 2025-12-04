import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { QuizCardType } from '@/quiz/quiz-card.constants';
import { QuizCardService } from '@/services/quiz-card.service';
import { CloudStorageGateway } from '@/gateways/cloud-storage.gateway';

@Injectable()
export class CreateOgpService {
  private readonly logger = new Logger(CreateOgpService.name);

  constructor(
    private readonly quizCardService: QuizCardService,
    private readonly cloudStorageGateway: CloudStorageGateway,
  ) {}

  async createOgpImage(
    type: QuizCardType,
    servantId?: number,
    width?: number,
    height?: number,
  ) {
    const { image, payload } = await this.quizCardService.generateQuizCard(
      type,
      servantId,
      { width, height, isOgp: true },
    );

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = servantId
      ? `ogp-${type}-${servantId}-${timestamp}.png`
      : `ogp-${type}-${timestamp}.png`;

    let storagePath: string;
    let url: string | undefined;

    // 本番環境 (Cloud Storage が設定されている場合) は GCS にアップロード
    if (this.cloudStorageGateway.isConfigured()) {
      this.logger.log('Uploading to Cloud Storage...');
      const gcsPath = `ogp/${filename}`;
      url = await this.cloudStorageGateway.uploadFile(image, gcsPath);
      storagePath = gcsPath;
    } else {
      // ローカル環境はファイルシステムに保存
      this.logger.log('Saving to local file system...');
      const outputDir = path.join(process.cwd(), 'data', 'ogp');
      await fs.mkdir(outputDir, { recursive: true });
      storagePath = path.join(outputDir, filename);
      await fs.writeFile(storagePath, image);
    }

    return {
      success: true,
      filename,
      path: storagePath,
      url,
      type,
      servantId,
      dimensions: { width, height },
      payload,
    };
  }
}

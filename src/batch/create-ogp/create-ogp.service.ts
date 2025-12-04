import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { QuizCardType } from '@/quiz/quiz-card.constants';
import { QuizCardService } from '@/services/quiz-card.service';

@Injectable()
export class CreateOgpService {
  constructor(private readonly quizCardService: QuizCardService) {}

  async createOgpImage(
    type: QuizCardType,
    servantId?: number,
    width?: number,
    height?: number,
  ) {
    const { image, payload } = await this.quizCardService.generateQuizCard(
      type,
      servantId,
      { width, height },
    );

    // 画像をファイルとして保存
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = servantId
      ? `ogp-${type}-${servantId}-${timestamp}.png`
      : `ogp-${type}-${timestamp}.png`;

    const outputDir = path.join(process.cwd(), 'data', 'ogp');
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, filename);
    await fs.writeFile(outputPath, image);

    return {
      success: true,
      filename,
      path: outputPath,
      type,
      servantId,
      dimensions: { width, height },
      payload,
    };
  }
}

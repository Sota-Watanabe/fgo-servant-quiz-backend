import { BadRequestException, Controller, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  QUIZ_CARD_TYPES,
  QuizCardType,
  normalizeQuizCardType,
} from '@/quiz/quiz-card.constants';
import { CreateOgpService } from '@/batch/create-ogp/create-ogp.service';

@ApiTags('batch')
@Controller('batch/create-ogp')
export class CreateOgpController {
  constructor(private readonly createOgpService: CreateOgpService) {}

  @Post()
  @ApiOperation({
    summary: 'OGP画像の生成',
    description:
      'type と servantId を指定してクイズ画像を生成し、ファイルとして保存します',
  })
  @ApiQuery({
    name: 'type',
    enum: QUIZ_CARD_TYPES,
    required: true,
    description: 'np | skill | profile のいずれか',
  })
  @ApiQuery({
    name: 'servantId',
    required: false,
    type: Number,
    description: '指定すると該当サーヴァントのデータで生成します',
  })
  @ApiQuery({
    name: 'width',
    required: false,
    type: Number,
    description: 'OGP画像の横幅(px)。デフォルト: 1200',
  })
  @ApiQuery({
    name: 'height',
    required: false,
    type: Number,
    description: 'OGP画像の縦幅(px)。デフォルト: 630',
  })
  async createOgpImage(
    @Query('type') type: string,
    @Query('servantId') servantId?: string,
  ) {
    const quizType = this.parseQuizType(type);
    const parsedServantId = this.parseServantId(servantId);

    return await this.createOgpService.createOgpImage(
      quizType,
      parsedServantId,
    );
  }

  private parseQuizType(type?: string): QuizCardType {
    const normalized = normalizeQuizCardType(type);
    if (!normalized) {
      throw new BadRequestException(
        `"type" query must be one of: ${QUIZ_CARD_TYPES.join(', ')}`,
      );
    }

    return normalized;
  }

  private parseServantId(servantId?: string): number | undefined {
    if (servantId === undefined || servantId === '') {
      return undefined;
    }

    const parsed = Number(servantId);
    if (Number.isNaN(parsed)) {
      throw new BadRequestException('servantId must be a number');
    }

    return parsed;
  }

  private parseDimension(
    value: string | undefined,
    fieldName: string,
    fallback: number,
  ): number {
    if (value === undefined || value === '') {
      return fallback;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException(`${fieldName} must be a positive integer`);
    }

    return parsed;
  }
}

import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  QUIZ_CARD_TYPES,
  QuizCardType,
  normalizeQuizCardType,
} from '@/quiz/quiz-card.constants';
import { QuizCardService } from '@/services/quiz-card.service';

@ApiTags('ogp')
@Controller()
export class OgpController {
  constructor(private readonly quizCardService: QuizCardService) {}

  @Get('ogp')
  @Header('Cache-Control', 'public, max-age=300')
  @ApiOperation({
    summary: 'OGP向けクイズ画像の生成',
    description: 'type と servantId を指定してクイズ画像(PNG)を返します',
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
  @ApiResponse({
    status: 200,
    description: 'PNG 画像バイナリ',
    content: {
      'image/png': {},
    },
  })
  async getOgpImage(
    @Query('type') type: string,
    @Query('servantId') servantId?: string,
  ): Promise<StreamableFile> {
    const quizType = this.parseQuizType(type);
    const parsedServantId = this.parseServantId(servantId);
    const { image } = await this.quizCardService.generateQuizCard(
      quizType,
      parsedServantId,
    );

    return new StreamableFile(image, {
      type: 'image/png',
    });
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
}

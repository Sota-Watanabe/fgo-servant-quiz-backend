import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Req,
  StreamableFile,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  QUIZ_CARD_TYPES,
  QuizCardType,
  normalizeQuizCardType,
} from '@/quiz/quiz-card.constants';
import { QuizCardService } from '@/services/quiz-card.service';

const DEFAULT_OGP_WIDTH = 1200;
const DEFAULT_OGP_HEIGHT = 630;

@ApiTags('ogp')
@Controller()
export class OgpController {
  constructor(private readonly quizCardService: QuizCardService) {}

  @Get('ogp')
  @Header('Cache-Control', 'public, max-age=3600')
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
  @ApiQuery({
    name: 'width',
    required: false,
    type: Number,
    description: `OGP画像の横幅(px)。デフォルト: ${DEFAULT_OGP_WIDTH}`,
  })
  @ApiQuery({
    name: 'height',
    required: false,
    type: Number,
    description: `OGP画像の縦幅(px)。デフォルト: ${DEFAULT_OGP_HEIGHT}`,
  })
  @ApiResponse({
    status: 200,
    description: 'PNG 画像バイナリ',
    content: {
      'image/png': {},
    },
  })
  async getOgpImage(@Req() req: Request): Promise<StreamableFile> {
    // 生の URL からクエリ文字列を取得し、&amp; を & に正規化
    const normalizedParams = this.normalizeQueryParams(req.url);

    const type = normalizedParams.get('type') || '';
    const servantId = normalizedParams.get('servantId') || undefined;
    const width = normalizedParams.get('width') || undefined;
    const height = normalizedParams.get('height') || undefined;

    const quizType = this.parseQuizType(type);
    const parsedServantId = this.parseServantId(servantId);
    const parsedWidth = this.parseDimension(width, 'width', DEFAULT_OGP_WIDTH);
    const parsedHeight = this.parseDimension(
      height,
      'height',
      DEFAULT_OGP_HEIGHT,
    );
    const { image } = await this.quizCardService.generateQuizCard(
      quizType,
      parsedServantId,
      {
        width: parsedWidth,
        height: parsedHeight,
      },
    );

    return new StreamableFile(image, {
      type: 'image/png',
    });
  }

  /**
   * 生の URL からクエリ文字列を取得し、&amp; を & に正規化してパースする
   * SNS（X/Twitter, Facebook等）が OGP URL を取得する際に & が &amp; にエスケープされる問題に対応
   */
  private normalizeQueryParams(url: string): URLSearchParams {
    const queryStart = url.indexOf('?');
    if (queryStart === -1) {
      return new URLSearchParams();
    }

    const rawQueryString = url.substring(queryStart + 1);
    const normalizedQueryString = rawQueryString.replace(/&amp;/g, '&');

    return new URLSearchParams(normalizedQueryString);
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

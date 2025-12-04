import {
  Controller,
  Get,
  Query,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OgpService } from '@/ogp/ogp.service';
import { normalizeQuizCardType } from '@/quiz/quiz-card.constants';

@ApiTags('OGP')
@Controller('ogp')
export class OgpController {
  constructor(private readonly ogpService: OgpService) {
    // Constructor
  }

  @Get()
  @ApiOperation({
    summary: 'OGP画像を取得',
    description:
      'クイズタイプとサーヴァントIDに対応するOGP画像を返す。画像が存在しない場合は400エラー。',
  })
  @ApiQuery({
    name: 'type',
    required: true,
    enum: ['skill', 'profile', 'np'],
    description: 'クイズタイプ',
  })
  @ApiQuery({
    name: 'servantId',
    required: true,
    type: Number,
    description: 'サーヴァントID',
    example: 300900,
  })
  @ApiResponse({
    status: 200,
    description: 'OGP画像を返す',
    content: {
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '画像が見つからない、または不正なパラメータ',
  })
  async getOgpImage(
    @Query('type') type: string,
    @Query('servantId') servantId: string,
    @Res() res: Response,
  ) {
    const quizType = normalizeQuizCardType(type);
    if (!quizType) {
      throw new BadRequestException('Invalid quiz type');
    }

    const servantIdNum = parseInt(servantId, 10);
    if (isNaN(servantIdNum)) {
      throw new BadRequestException('Invalid servantId');
    }

    try {
      const imageBuffer = await this.ogpService.getOgpImage(
        quizType,
        servantIdNum,
      );

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.status(HttpStatus.OK).send(imageBuffer);
    } catch (error) {
      // 開発環境では400エラーを返す
      if (process.env.NODE_ENV !== 'production') {
        throw new BadRequestException('OGP image not found');
      }
      // 本番環境では再スロー（既存の動作を維持）
      throw error;
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServantsService } from './servants.service';
import { ServantsOptionsGetResponseDto } from '../dto/servants-options-get-response.dto';

@ApiTags('servants')
@Controller('servants')
export class ServantsController {
  constructor(private readonly servantsService: ServantsService) {}

  @Get('options')
  @ApiOperation({
    summary: 'サーヴァント選択肢一覧の取得',
    description:
      'クイズで使用するサーヴァントの選択肢データを取得します。各サーヴァントのID、名前、オリジナル名が含まれます。',
  })
  @ApiResponse({
    status: 200,
    description: 'サーヴァント選択肢一覧の取得に成功しました',
    type: ServantsOptionsGetResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'サーバー内部エラー',
  })
  getServantOptions(): ServantsOptionsGetResponseDto {
    return this.servantsService.getServantOptions();
  }
}

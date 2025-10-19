import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetQuizSkillInteractor } from '@/interactors/get-quiz-skill.interactor';
import { ServantDetailGetResponseDto } from '@/dto/servant-detail-get-response.dto';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly getQuizSkillInteractor: GetQuizSkillInteractor,
  ) {}

  @Get('skill')
  @ApiOperation({
    summary: 'スキルクイズの取得',
    description:
      'ランダムなサーヴァントのスキル情報を含むクイズデータを返します',
  })
  @ApiResponse({
    status: 200,
    description: 'スキルクイズデータ',
    type: ServantDetailGetResponseDto,
  })
  async getSkillQuiz(): Promise<ServantDetailGetResponseDto> {
    return await this.getQuizSkillInteractor.execute();
  }
}

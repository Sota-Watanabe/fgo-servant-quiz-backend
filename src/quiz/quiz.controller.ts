import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetQuizSkillInteractor } from '@/interactors/get-quiz-skill.interactor';
import { GetQuizProfileInteractor } from '@/interactors/get-quiz-profile.interactor';
import { ServantSkillGetResponseDto } from '@/dto/servant-skill-get-response.dto';
import { ServantProfileGetResponseDto } from '@/dto/servant-profile-get-response.dto';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly getQuizSkillInteractor: GetQuizSkillInteractor,
    private readonly getQuizProfileInteractor: GetQuizProfileInteractor,
  ) {}

  @Get('skill')
  @ApiOperation({
    summary: 'スキルクイズの取得',
    description: 'ランダムなサーヴァントのスキル情報を返します',
  })
  @ApiResponse({
    status: 200,
    description: 'スキルクイズデータ',
    type: ServantSkillGetResponseDto,
  })
  async getSkillQuiz(): Promise<ServantSkillGetResponseDto> {
    return await this.getQuizSkillInteractor.execute();
  }

  @Get('profile')
  @ApiOperation({
    summary: 'プロフィールクイズの取得',
    description: 'ランダムなサーヴァントのプロフィール情報を返します',
  })
  @ApiResponse({
    status: 200,
    description: 'プロフィールクイズデータ',
    type: ServantProfileGetResponseDto,
  })
  async getProfileQuiz(): Promise<ServantProfileGetResponseDto> {
    return await this.getQuizProfileInteractor.execute();
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetQuizProfileInteractor } from '@/interactors/get-quiz-profile.interactor';
import { GetQuizSkillInteractor } from '@/interactors/get-quiz-skill.interactor';
import { GetQuizNpInteractor } from '@/interactors/get-quiz-np.interactor';
import { ServantSkillGetResponseDto } from '@/dto/servant-skill-get-response.dto';
import { ServantProfileGetResponseDto } from '@/dto/servant-profile-get-response.dto';
import { ServantNpGetResponseDto } from '@/dto/servant-np-get-response.dto';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly getQuizSkillInteractor: GetQuizSkillInteractor,
    private readonly getQuizProfileInteractor: GetQuizProfileInteractor,
    private readonly getQuizNpInteractor: GetQuizNpInteractor,
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

  @Get('np')
  @ApiOperation({
    summary: '宝具クイズの取得',
    description: 'ランダムなサーヴァントの宝具情報を返します',
  })
  @ApiResponse({
    status: 200,
    description: '宝具クイズデータ',
    type: ServantNpGetResponseDto,
  })
  async getNpQuiz(): Promise<ServantNpGetResponseDto> {
    return await this.getQuizNpInteractor.execute();
  }
}

import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    description:
      'ランダム、またはクエリで指定したサーヴァントIDのスキル情報を返します',
  })
  @ApiQuery({
    name: 'servantId',
    required: false,
    type: Number,
    description: '指定すると該当サーヴァントのスキル情報を返します',
  })
  @ApiResponse({
    status: 200,
    description: 'スキルクイズデータ',
    type: ServantSkillGetResponseDto,
  })
  async getSkillQuiz(
    @Query('servantId') servantId?: string,
  ): Promise<ServantSkillGetResponseDto> {
    let parsedServantId: number | undefined;

    if (servantId !== undefined && servantId !== '') {
      parsedServantId = Number(servantId);

      if (Number.isNaN(parsedServantId)) {
        throw new BadRequestException('servantId must be a number');
      }
    }

    return await this.getQuizSkillInteractor.execute(parsedServantId);
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

import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetQuizProfileInteractor } from '@/interactors/get-quiz-profile.interactor';
import { GetQuizSkillInteractor } from '@/interactors/get-quiz-skill.interactor';
import { GetQuizNpInteractor } from '@/interactors/get-quiz-np.interactor';
import { GetQuizNpVoiceInteractor } from '@/interactors/get-quiz-np-voice.interactor';
import { ServantSkillGetResponseDto } from '@/dto/servant-skill-get-response.dto';
import { ServantProfileGetResponseDto } from '@/dto/servant-profile-get-response.dto';
import { ServantNpGetResponseDto } from '@/dto/servant-np-get-response.dto';
import { ServantNpVoiceGetResponseDto } from '@/dto/servant-np-voice-get-response.dto';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly getQuizSkillInteractor: GetQuizSkillInteractor,
    private readonly getQuizProfileInteractor: GetQuizProfileInteractor,
    private readonly getQuizNpInteractor: GetQuizNpInteractor,
    private readonly getQuizNpVoiceInteractor: GetQuizNpVoiceInteractor,
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
    const parsedServantId = this.parseServantId(servantId);
    return await this.getQuizSkillInteractor.execute(parsedServantId);
  }

  @Get('profile')
  @ApiOperation({
    summary: 'プロフィールクイズの取得',
    description:
      'ランダム、またはクエリで指定したサーヴァントIDのプロフィール情報を返します',
  })
  @ApiQuery({
    name: 'servantId',
    required: false,
    type: Number,
    description: '指定すると該当サーヴァントのプロフィール情報を返します',
  })
  @ApiResponse({
    status: 200,
    description: 'プロフィールクイズデータ',
    type: ServantProfileGetResponseDto,
  })
  async getProfileQuiz(
    @Query('servantId') servantId?: string,
  ): Promise<ServantProfileGetResponseDto> {
    const parsedServantId = this.parseServantId(servantId);
    return await this.getQuizProfileInteractor.execute(parsedServantId);
  }

  @Get('np')
  @ApiOperation({
    summary: '宝具クイズの取得',
    description:
      'ランダム、またはクエリで指定したサーヴァントIDの宝具情報を返します',
  })
  @ApiQuery({
    name: 'servantId',
    required: false,
    type: Number,
    description: '指定すると該当サーヴァントの宝具情報を返します',
  })
  @ApiResponse({
    status: 200,
    description: '宝具クイズデータ',
    type: ServantNpGetResponseDto,
  })
  async getNpQuiz(
    @Query('servantId') servantId?: string,
  ): Promise<ServantNpGetResponseDto> {
    const parsedServantId = this.parseServantId(servantId);
    return await this.getQuizNpInteractor.execute(parsedServantId);
  }

  @Get('np-voice')
  @ApiOperation({
    summary: '宝具ボイスクイズの取得',
    description:
      'ランダム、またはクエリで指定したサーヴァントIDの宝具ボイス情報を返します',
  })
  @ApiQuery({
    name: 'servantId',
    required: false,
    type: Number,
    description: '指定すると該当サーヴァントの宝具ボイス情報を返します',
  })
  @ApiResponse({
    status: 200,
    description: '宝具ボイスクイズデータ',
    type: ServantNpVoiceGetResponseDto,
  })
  async getNpVoiceQuiz(
    @Query('servantId') servantId?: string,
  ): Promise<ServantNpVoiceGetResponseDto> {
    const parsedServantId = this.parseServantId(servantId);
    return await this.getQuizNpVoiceInteractor.execute(parsedServantId);
  }

  private parseServantId(servantId?: string): number | undefined {
    if (servantId === undefined || servantId === '') {
      return undefined;
    }

    const parsedServantId = Number(servantId);

    if (Number.isNaN(parsedServantId)) {
      throw new BadRequestException('servantId must be a number');
    }

    return parsedServantId;
  }
}

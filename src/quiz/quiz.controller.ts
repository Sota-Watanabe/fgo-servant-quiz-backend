import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { ServantDetailGetResponseDto } from '../dto/servant-detail-get-response.dto';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('skill')
  @ApiOperation({ 
    summary: 'スキルクイズの取得',
    description: 'ランダムなサーヴァントのスキル情報を含むクイズデータを返します'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'スキルクイズデータ',
    type: ServantDetailGetResponseDto
  })
  getSkillQuiz() {
    return this.quizService.getSkillQuiz();
  }
}

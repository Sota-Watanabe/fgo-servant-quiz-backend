import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DemoService } from './demo.service';

@ApiTags('demo')
@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get('quiz')
  @ApiOperation({ 
    summary: 'デモクイズの取得',
    description: 'デモ用のクイズデータを返します'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'デモクイズデータ',
    type: String
  })
  async getQuiz(): Promise<string> {
    return this.demoService.getQuiz();
  }
}

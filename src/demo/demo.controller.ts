import { Controller, Get } from '@nestjs/common';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get('quiz')
  async getQuiz(): Promise<string> {
    return this.demoService.getQuiz();
  }
}

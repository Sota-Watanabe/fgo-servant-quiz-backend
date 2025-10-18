import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'アプリケーションのヘルスチェック' })
  @ApiResponse({ status: 200, description: 'アプリケーションの状態を返します', type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}

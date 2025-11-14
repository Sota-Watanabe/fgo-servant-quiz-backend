import { Controller, Get } from '@nestjs/common';

@Controller()
export class BatchHealthController {
  @Get('healthz')
  health() {
    return { status: 'ok' };
  }
}

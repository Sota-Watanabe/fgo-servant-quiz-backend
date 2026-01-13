import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateBasicServantService } from './update-basic-servant.service';

@ApiTags('batch')
@Controller('batch/update-basic-servant')
export class UpdateBasicServantController {
  constructor(
    private readonly updateBasicServantService: UpdateBasicServantService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'basic_servant.jsonの更新',
    description:
      'Atlas Academy APIからサーヴァント基本データを取得し、data/basic_servant.jsonを更新します',
  })
  async updateBasicServant() {
    const result =
      await this.updateBasicServantService.updateBasicServantData();
    return result;
  }
}

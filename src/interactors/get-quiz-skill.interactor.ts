import { Injectable, NotFoundException } from '@nestjs/common';
import { ServantSkillGetResponseDto } from '@/dto/servant-skill-get-response.dto';
import { DumpService } from '@/services/dump.service';
import { FgoGameApiService } from '@/services/fgo-game-api.service';

@Injectable()
export class GetQuizSkillInteractor {
  constructor(
    private readonly dumpService: DumpService,
    private readonly fgoGameApiService: FgoGameApiService,
  ) {}

  async execute(servantId?: number): Promise<ServantSkillGetResponseDto> {
    const targetServant = servantId
      ? await this.dumpService.getServantById(servantId)
      : await this.dumpService.getRandomServant();

    if (!targetServant) {
      throw new NotFoundException(
        `Servant with id ${servantId as number} was not found in dump.`,
      );
    }

    // サーヴァントの詳細情報を取得
    const servantDetail = await this.fgoGameApiService.getServantDetail(
      targetServant.id,
    );
    const response = new ServantSkillGetResponseDto(servantDetail);
    return response;
  }
}

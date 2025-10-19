import { Injectable } from '@nestjs/common';
import { ServantDetailGetResponseDto } from '@/dto/servant-detail-get-response.dto';
import { DumpService } from '@/services/dump.service';
import { FgoGameApiService } from '@/services/fgo-game-api.service';

@Injectable()
export class GetQuizSkillInteractor {
  constructor(
    private readonly dumpService: DumpService,
    private readonly fgoGameApiService: FgoGameApiService,
  ) {}

  async execute(): Promise<ServantDetailGetResponseDto> {
    // ランダムなサーヴァントを選択
    const randomServant = await this.dumpService.getRandomServant();

    // サーヴァントの詳細情報を取得
    const servantDetail = await this.fgoGameApiService.getServantDetail(
      randomServant.id,
    );

    const response = new ServantDetailGetResponseDto(servantDetail);

    return response;
  }
}

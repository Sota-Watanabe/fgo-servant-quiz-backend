import { Injectable } from '@nestjs/common';
import { ServantNpGetResponseDto } from '@/dto/servant-np-get-response.dto';
import { DumpService } from '@/services/dump.service';
import { FgoGameApiService } from '@/services/fgo-game-api.service';

@Injectable()
export class GetQuizNpInteractor {
  constructor(
    private readonly dumpService: DumpService,
    private readonly fgoGameApiService: FgoGameApiService,
  ) {}

  async execute(): Promise<ServantNpGetResponseDto> {
    // ランダムなサーヴァントを選択して宝具情報を取得
    const randomServant = await this.dumpService.getRandomServant();

    // サーヴァントの詳細情報を取得し宝具レスポンスを生成
    const servantDetail = await this.fgoGameApiService.getServantDetail(
      randomServant.id,
    );

    return new ServantNpGetResponseDto(servantDetail);
  }
}

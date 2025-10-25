import { Injectable } from '@nestjs/common';
import { ServantProfileGetResponseDto } from '@/dto/servant-profile-get-response.dto';
import { DumpService } from '@/services/dump.service';
import { FgoGameApiService } from '@/services/fgo-game-api.service';
import { VertexAiApiService } from '@/services/vertex-ai-api.service';

@Injectable()
export class GetQuizProfileInteractor {
  constructor(
    private readonly dumpService: DumpService,
    private readonly fgoGameApiService: FgoGameApiService,
    private readonly vertexAiApiService: VertexAiApiService,
  ) {}

  async execute(): Promise<ServantProfileGetResponseDto> {
    // ランダムなサーヴァントを選択
    const randomServant = await this.dumpService.getRandomServant();

    // サーヴァントの詳細情報を取得
    const servantDetail = await this.fgoGameApiService.getServantDetail(
      randomServant.id,
    );

    const rawProfile = servantDetail.profile.comments[0]?.comment ?? '';

    const maskedProfile = await this.vertexAiApiService.maskServantName(
      rawProfile,
      servantDetail.name,
    );
    // console.log('---- Quiz Profile Generation ----');
    // console.log('servantDetail.name:', servantDetail.name);
    // console.log('rawProfile:', rawProfile);
    // console.log('--------------------\n');
    // console.log('maskedProfile:', maskedProfile);

    const response = new ServantProfileGetResponseDto(
      servantDetail,
      maskedProfile,
    );

    return response;
  }
}

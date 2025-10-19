import { Injectable } from '@nestjs/common';
import { NiceServantDetailResponse } from '@/dto/servant-detail-nice.dto';
import { AtlasAcademyGateway } from '../gateways/atlasacademy.gateway';

@Injectable()
export class FgoGameApiService {
  constructor(private readonly atlasAcademyGateway: AtlasAcademyGateway) {}

  /**
   * サーヴァントの詳細情報を取得
   */
  async getServantDetail(
    servantId: number,
  ): Promise<NiceServantDetailResponse> {
    const result = this.atlasAcademyGateway.getServantDetail(servantId);

    return result;
  }
}

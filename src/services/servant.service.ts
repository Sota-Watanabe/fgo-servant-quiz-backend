import { Injectable } from '@nestjs/common';
import { ServantRepository } from '@/repositories/servant.repository';
import { ServantDto } from '@/dto/servant.dto';
import { ServantDetailNiceResponse } from '@/dto/servant-detail-nice.dto';

@Injectable()
export class ServantService {
  constructor(private readonly servantRepository: ServantRepository) {}

  /**
   * サーヴァント選択肢一覧を取得
   */
  async getServantOptions(): Promise<ServantDto[]> {
    return this.servantRepository.getBasicServants();
  }

  /**
   * ランダムなサーヴァントを選択
   */
  async getRandomServant(): Promise<ServantDto> {
    const servants = await this.servantRepository.getBasicServants();
    const randomIndex = Math.floor(Math.random() * servants.length);
    return servants[randomIndex];
  }

  /**
   * サーヴァントの詳細情報を取得
   */
  async getServantDetail(
    servantId: number,
  ): Promise<ServantDetailNiceResponse> {
    return this.servantRepository.getServantDetail(servantId);
  }
}

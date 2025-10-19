import { Injectable } from '@nestjs/common';
import { ServantService } from '@/services/servant.service';
import { ServantDetailGetResponseDto } from '@/dto/servant-detail-get-response.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GetSkillQuizInteractor {
  constructor(private readonly servantService: ServantService) {}

  async execute(): Promise<ServantDetailGetResponseDto> {
    // ランダムなサーヴァントを選択
    const randomServant = await this.servantService.getRandomServant();

    console.log('選ばれたサーヴァントID:', randomServant.id);

    // サーヴァントの詳細情報を取得
    const servantDetail = await this.servantService.getServantDetail(
      randomServant.id,
    );

    const response = new ServantDetailGetResponseDto(servantDetail);

    // デバッグ用: レスポンスをファイルに保存
    fs.writeFileSync(
      path.join(process.cwd(), 'data/res.json'),
      JSON.stringify(response, null, 2),
      'utf8',
    );

    return response;
  }
}

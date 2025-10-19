import { Injectable } from '@nestjs/common';
import { ServantDetailNiceResponse } from '@/dto/servant-detail-nice.dto';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AtlasAcademyGateway {
  private readonly baseUrl = 'https://api.atlasacademy.io';
  private readonly region = 'JP';

  /**
   * サーヴァントの詳細情報を取得
   */
  async getServantDetail(
    servantId: number,
  ): Promise<ServantDetailNiceResponse> {
    const detailUrl = `${this.baseUrl}/nice/${this.region}/servant/${servantId}`;

    const response = await axios.get<ServantDetailNiceResponse>(detailUrl);

    // デバッグ用: レスポンスをファイルに保存
    fs.writeFileSync(
      path.join(process.cwd(), 'data/res.json'),
      JSON.stringify(response, null, 2),
      'utf8',
    );

    return response.data;
  }
}

import { Injectable } from '@nestjs/common';
import { NiceServantDetailResponse } from '@/dto/servant-detail-nice.dto';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Atlas Academy API Endpoints
 * Base URL: https://api.atlasacademy.io
 * Region: JP
 *
 * Available endpoints:
 * - GET /nice/JP/servant/{id} - サーヴァント詳細情報
 */

@Injectable()
export class AtlasAcademyGateway {
  private readonly baseUrl = 'https://api.atlasacademy.io';
  private readonly region = 'JP';

  /**
   * サーヴァントの詳細情報を取得
   */
  async getServantDetail(
    servantId: number,
  ): Promise<NiceServantDetailResponse> {
    const detailUrl = `${this.baseUrl}/nice/${this.region}/servant/${servantId}`;

    const response = await axios.get<NiceServantDetailResponse>(detailUrl, {
      params: { lore: true, lang: 'jp' },
    });

    // デバッグ用: レスポンスをファイルに保存
    this.saveDebugResponse(
      response.data,
      `servant-detail-${response.data.name}.json`,
    );

    return response.data;
  }

  /**
   * デバッグ用: レスポンスをファイルに保存
   */
  private saveDebugResponse(data: any, filename: string): void {
    const debugDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(debugDir, filename),
      JSON.stringify(data, null, 2),
      'utf8',
    );
  }
}

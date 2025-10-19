import { Injectable } from '@nestjs/common';
import { ServantDetailNiceResponse } from '@/dto/servant-detail-nice.dto';
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

  /**
   * サーヴァントの詳細情報を取得
   */
  async getServantDetail(
    servantId: number,
  ): Promise<ServantDetailNiceResponse> {
    const detailUrl = `${this.baseUrl}/nice/${this.region}/servant/${servantId}`;

    const response = await axios.get<ServantDetailNiceResponse>(detailUrl);

    // デバッグ用: レスポンスをファイルに保存
    this.saveDebugResponse(response.data, `servant-detail-${servantId}.json`);

    return response.data;
  }
}

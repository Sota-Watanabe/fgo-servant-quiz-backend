import { Injectable } from '@nestjs/common';
import { ServantDto } from '@/dto/servant.dto';
import { ServantDetailNiceResponse } from '@/dto/servant-detail-nice.dto';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class ServantRepository {
  getBasicServants(): Promise<ServantDto[]> {
    const servantData = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'data/basic_servant.json'),
        'utf8',
      ),
    ) as ServantDto[];

    return Promise.resolve(servantData);
  }

  async getServantDetail(
    servantId: number,
  ): Promise<ServantDetailNiceResponse> {
    const region = 'JP';
    const detailUrl = `https://api.atlasacademy.io/nice/${region}/servant/${servantId}`;

    const response = await axios.get<ServantDetailNiceResponse>(detailUrl);
    return response.data;
  }
}

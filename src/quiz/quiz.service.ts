import { Injectable } from '@nestjs/common';
import { ServantDto } from '../dto/servant.dto';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { ServantDetailGetResponseDto } from '../dto/servant-detail-get-response.dto';
import { NiceServantDetailResponse } from '../dto/servant-detail-nice.dto';

@Injectable()
export class QuizService {
  constructor() {}

  async getSkillQuiz(): Promise<ServantDetailGetResponseDto> {
    const region = 'JP';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const servantData: ServantDto[] = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'data/basic_servant.json'),
        'utf8',
      ),
    );
    const randomServant =
      servantData[Math.floor(Math.random() * servantData.length)];
    const servantId = randomServant.id;

    console.log('選ばれたサーヴァントID:', servantId);

    const detailUrl = `https://api.atlasacademy.io/nice/${region}/servant/${servantId}`;
    const detailRes = (await axios.get<NiceServantDetailResponse>(detailUrl))
      .data;

    const res = new ServantDetailGetResponseDto(detailRes);

    // resをファイルに書き出す
    fs.writeFileSync(
      path.join(process.cwd(), 'data/res.json'),
      JSON.stringify(res, null, 2),
      'utf8',
    );
    return res;
  }
}

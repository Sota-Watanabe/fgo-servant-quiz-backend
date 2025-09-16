import { Injectable } from '@nestjs/common';
import { ServantDetailResponse } from 'src/dto/servant-detail.dto';
import { ServantDto } from 'src/dto/servant.dto';
import { pickDeep } from 'src/utils/pickDeep';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

interface SkillData {
  id: number;
  name: string;
  ruby: string;
  detail: string;
  detailShort: string;
}

@Injectable()
export class QuizService {
  private skillData: SkillData[] = [];
  constructor() {}

  async getSkillQuiz() {
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

    const detailUrl = `https://api.atlasacademy.io/raw/${region}/servant/${servantId}?lore=true`;
    const detailRes = (await axios.get<ServantDetailResponse>(detailUrl)).data;

    const a = pickDeep(detailRes, [
      'mstSvt.name',
      'mstSvt.ruby',
      'mstSkill[].mstSkill.name',
      'mstSkill[].mstSkill.ruby',
      'mstSkill[].mstSkillDetail[].detail',
      'mstTreasureDevice[].mstTreasureDevice.name',
      'mstTreasureDevice[].mstTreasureDevice.ruby',
      'mstTreasureDevice[].mstSvtTreasureDevice[].cardId',
    ]);
    return JSON.stringify(a);
  }
}

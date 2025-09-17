import { Injectable } from '@nestjs/common';
import { ServantDetailResponse } from 'src/dto/servant-detail.dto';
import { SkillQuizGetResponseDto } from 'src/dto/skill-quiz.dto';
import { ServantDto } from 'src/dto/servant.dto';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

type SkillData = {
  id: number;
  name: string;
  ruby: string;
  detail: string;
  detailShort: string;
};

@Injectable()
export class QuizService {
  private skillData: SkillData[] = [];
  constructor() {}

  async getSkillQuiz(): Promise<SkillQuizGetResponseDto> {
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

    // detailResをファイルに書き出す
    fs.writeFileSync(
      path.join(process.cwd(), 'data/detailResDemo.json'),
      JSON.stringify(detailRes, null, 2),
      'utf8',
    );

    // const pickedData = pickDeep(detailRes, [
    //   'mstSvt.name',
    //   'mstSvt.ruby',
    //   'mstSkill[].mstSkill.name',
    //   'mstSkill[].mstSkill.ruby',
    //   'mstSkill[].mstSkillDetail[].detail',
    //   'mstSkill[].mstSvtSkill[].num',
    //   'mstSkill[].mstSvtSkill[].priority',
    //   'mstTreasureDevice[].mstTreasureDevice.name',
    //   'mstTreasureDevice[].mstTreasureDevice.ruby',
    //   'mstTreasureDevice[].mstSvtTreasureDevice[].cardId',
    // ] as const);

    // // pickDeepの結果をログ出力してデータ構造を確認
    // console.log('Picked data:', JSON.stringify(pickedData, null, 2));

    return new SkillQuizGetResponseDto(detailRes);
  }
}

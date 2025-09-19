import { Injectable } from '@nestjs/common';
// import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
// import { ServantDetailResponse } from 'src/dto/servant-detail-nice.dto';
import { ServantDto } from 'src/dto/servant.dto';

@Injectable()
export class DemoService {
  async getQuiz(): Promise<string> {
    const region = 'JP';
    // basic_servant.jsonを読み込んでランダムに1つIDを取得
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
    // 詳細取得
    // const detailUrl = `https://api.atlasacademy.io/raw/${region}/servant/${servantId}?lore=true`;
    // const detailRes = (await axios.get<ServantDetailResponse>(detailUrl)).data;

    // detailResをファイルに書き出す
    // fs.writeFileSync(
    //   path.join(process.cwd(), 'data/detailResDemo.json'),
    //   JSON.stringify(detailRes, null, 2),
    //   'utf8',
    // );

    // const a = pickDeep(detailRes, [
    //   'mstSvt.name',
    //   'mstSvt.ruby',
    //   'mstSkill[].mstSkill.name',
    //   'mstSkill[].mstSkill.ruby',
    //   'mstSkill[].mstSkillDetail[].detail',
    //   'mstTreasureDevice[].mstTreasureDevice.name',
    //   'mstTreasureDevice[].mstTreasureDevice.ruby',
    //   'mstTreasureDevice[].mstSvtTreasureDevice[].cardId',
    //   'mstSvtComment[].comment',
    // ]);
    // console.log(JSON.stringify(a, null, 2));
    // // const skills = detailRes.mstSvtSkills.map((skill) => skill.);
    // return JSON.stringify(a);
    return 'test';
  }
}

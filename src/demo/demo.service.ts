import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { ServantDetailResponse } from 'src/dto/servant-detail.dto';
import { ServantDto } from 'src/dto/servant.dto';
import { pickDeep } from '../utils/pickDeep';

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

    // 詳細取得
    const detailUrl = `https://api.atlasacademy.io/raw/${region}/servant/${servantId}`;
    const detailRes = (await axios.get<ServantDetailResponse>(detailUrl)).data;
    const servantName = detailRes.mstSvt.name;
    console.log('servantName', servantName);

    const a = pickDeep(detailRes, [
      'mstSvt.name',
      'mstSvt.ruby',
      'mstSvt.mstSkill.mstSkill.name',
      'mstSvt.mstSkill.mstSkillDetail.detail',
    ]);

    // const skills = detailRes.mstSvtSkills.map((skill) => skill.);
    return JSON.stringify(a);
  }
}

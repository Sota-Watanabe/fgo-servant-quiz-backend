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
    console.log('選ばれたサーヴァントID:', servantId);
    // 詳細取得
    const detailUrl = `https://api.atlasacademy.io/raw/${region}/servant/${servantId}?lore=true`;
    const detailRes = (await axios.get<ServantDetailResponse>(detailUrl)).data;

    // detailResをファイルに書き出す
    fs.writeFileSync(
      path.join(process.cwd(), 'data/detailResDemo.json'),
      JSON.stringify(detailRes, null, 2),
      'utf8',
    );

    const a = pickDeep(detailRes, [
      'mstSvt.name',
      'mstSvt.ruby',
      'mstSkill[].mstSkill.name',
      'mstSkill[].mstSkill.ruby',
      'mstSkill[].mstSkillDetail[].detail',
      'mstTreasureDevice[].mstTreasureDevice.name',
      'mstTreasureDevice[].mstTreasureDevice.ruby',
      'mstTreasureDevice[].mstSvtTreasureDevice[].cardId',
      'mstSvtComment[].comment',
    ]);
    console.log(JSON.stringify(a, null, 2));
    // const skills = detailRes.mstSvtSkills.map((skill) => skill.);
    return JSON.stringify(a);
  }
}

FGOサーヴァントクイズのテスト

以下のスキルを持つサーヴァントは誰でしょう？

「その手に光を B」：味方単体のArts性能アップ＋最大HP増加＋クリティカル威力アップ

「夏の夜に咲く花 D」：味方全体の攻撃力アップ＋NP付与＋宝具使用時のチャージ段階を1上げる

「夢魔の畔 EX」：味方全体に無敵状態を付与＋敵全体のチャージ減少＋自身のNP増加

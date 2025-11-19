import { Injectable } from '@nestjs/common';
import { ServantDto } from '@/dto/servant.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DumpService {
  /**
   * ダンプファイルからサーヴァント一覧を取得
   */
  getDumpServants(): Promise<ServantDto[]> {
    const servantData = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'data/basic_servant.json'),
        'utf8',
      ),
    ) as ServantDto[];

    // タイプは['heroine', 'normal', 'enemyCollectionDetail'];の3種類があるが、通常サーヴァントとヒロインのみ抽出
    const filteredServants = servantData.filter(
      (servant) => servant.type === 'normal' || servant.type === 'heroine',
    );
    return Promise.resolve(filteredServants);
  }

  /**
   * ランダムなサーヴァントを選択
   */
  async getRandomServant(): Promise<ServantDto> {
    const servants = await this.getDumpServants();
    const randomIndex = Math.floor(Math.random() * servants.length);
    return servants[randomIndex];
  }

  /**
   * 指定したIDのサーヴァントを取得
   */
  async getServantById(servantId: number): Promise<ServantDto | undefined> {
    const servants = await this.getDumpServants();
    console.log('servantId', servantId);
    return servants.find((servant) => servant.id === servantId);
  }
}

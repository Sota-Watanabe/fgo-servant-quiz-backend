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

    return Promise.resolve(servantData);
  }

  /**
   * ランダムなサーヴァントを選択
   */
  async getRandomServant(): Promise<ServantDto> {
    const servants = await this.getDumpServants();
    const randomIndex = Math.floor(Math.random() * servants.length);
    return servants[randomIndex];
  }
}

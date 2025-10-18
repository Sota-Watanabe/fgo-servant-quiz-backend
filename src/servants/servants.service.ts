import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ServantDto } from '../dto/servant.dto';
import { ServantsOptionsGetResponseDto } from '../dto/servants-options-get-response.dto';

@Injectable()
export class ServantsService {
  getServantOptions(): ServantsOptionsGetResponseDto {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const servantData: ServantDto[] = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'data/basic_servant.json'),
        'utf8',
      ),
    );

    return new ServantsOptionsGetResponseDto(servantData);
  }
}

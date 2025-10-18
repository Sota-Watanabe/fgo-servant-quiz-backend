// サーヴァント詳細取得レスポンス用のDTO

import { ApiProperty } from '@nestjs/swagger';
import { ServantDto } from './servant.dto';

export class ServantsOptions {
  @ApiProperty({ description: 'サーヴァントID', example: 1 })
  id: number;

  @ApiProperty({
    description: 'サーヴァント名',
    example: 'アルトリア・ペンドラゴン',
  })
  name: string;

  @ApiProperty({ description: 'オリジナル名', example: 'Artoria Pendragon' })
  originalOverwriteName?: string;

  @ApiProperty({ description: 'クラスID', example: 1 })
  classId: number;

  constructor(data: ServantDto) {
    this.id = data.id;
    this.name = data.name;
    this.originalOverwriteName =
      data.name === data.originalName &&
      data.name === data.originalOverwriteName
        ? undefined
        : `(${data.name})(${data.originalName})(${data.originalOverwriteName})`;
    this.classId = data.classId;
  }
}

export class ServantsOptionsGetResponseDto {
  @ApiProperty({
    description: 'サーヴァント選択肢の配列',
    type: [ServantsOptions],
  })
  options: ServantsOptions[];

  constructor(data: ServantDto[]) {
    this.options = data.map(
      (servant: ServantDto) => new ServantsOptions(servant),
    );
  }
}

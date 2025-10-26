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

  @ApiProperty({
    description: '顔画像URL',
    example: 'https://example.com/face.jpg',
  })
  face: string;

  constructor(data: ServantDto) {
    this.id = data.id;
    this.name = data.name;
    this.originalOverwriteName =
      data.originalOverwriteName && data.name !== data.originalOverwriteName
        ? data.originalOverwriteName
        : undefined;
    this.classId = data.classId;
    this.face = data.face;
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

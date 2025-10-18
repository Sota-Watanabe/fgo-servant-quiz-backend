import { ApiProperty } from '@nestjs/swagger';

export class ServantDto {
  @ApiProperty({ description: 'サーヴァントID', example: 1 })
  id: number;

  @ApiProperty({ description: 'コレクション番号', example: 1 })
  collectionNo: number;

  @ApiProperty({
    description: 'サーヴァント名',
    example: 'アルトリア・ペンドラゴン',
  })
  name: string;

  @ApiProperty({ description: 'オリジナル名', example: 'Artoria Pendragon' })
  originalName: string;

  @ApiProperty({
    description: 'オリジナル上書き名（英語の別名・通称）',
    example: 'Demon King Nobunaga',
  })
  originalOverwriteName: string;

  @ApiProperty({ description: 'タイプ', example: 'normal' })
  type: string; // "normal" | "heroine" | ...

  @ApiProperty({ description: 'フラグ', example: 'normal' })
  flag: string; // "normal" など

  @ApiProperty({ description: 'フラグ配列', type: [String] })
  flags: string[];

  @ApiProperty({ description: 'クラスID', example: 1 })
  classId: number;

  @ApiProperty({ description: 'クラス名', example: 'saber' })
  className: string; // "saber" | "shielder" | ...

  @ApiProperty({ description: '属性', example: 'earth' })
  attribute: string; // "earth" | "human" | ...

  @ApiProperty({
    description: '特性',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
      },
    },
  })
  traits: {
    id: number;
    name: string;
  }[];

  @ApiProperty({ description: 'レア度', example: 5 })
  rarity: number;

  @ApiProperty({ description: '最大攻撃力', example: 11221 })
  atkMax: number;

  @ApiProperty({ description: '最大HP', example: 15150 })
  hpMax: number;

  @ApiProperty({ description: '顔画像URL' })
  face: string; // 画像URL

  @ApiProperty({
    description: 'コスチューム情報',
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        costumeCollectionNo: { type: 'number' },
        battleCharaId: { type: 'number' },
        shortName: { type: 'string' },
      },
    },
  })
  costume: {
    [battleCharaId: string]: {
      id: number;
      costumeCollectionNo: number;
      battleCharaId: number;
      shortName: string;
    };
  };
}

export type ServantSearchResultDto = ServantDto[];

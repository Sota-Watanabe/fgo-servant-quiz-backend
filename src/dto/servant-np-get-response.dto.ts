import { ApiProperty } from '@nestjs/swagger';
import { NiceServantDetailResponse } from '@/dto/servant-detail-nice.dto';

class NoblePhantasmDto {
  @ApiProperty({
    description: '宝具ID',
    example: 100010,
  })
  id: number;

  @ApiProperty({
    description: '宝具番号',
    example: 1,
  })
  num: number;

  @ApiProperty({
    description: '強化段階番号',
    example: 1,
  })
  npNum: number;

  @ApiProperty({
    description: 'カード種別',
    example: '2',
  })
  card: string;

  @ApiProperty({
    description: '宝具名',
    example: '約束された勝利の剣',
  })
  name: string;

  @ApiProperty({
    description: 'オリジナル名',
    example: 'Excalibur',
  })
  originalName: string;

  @ApiProperty({
    description: 'ルビ',
    example: 'エクスカリバー',
  })
  ruby: string;

  @ApiProperty({
    description: 'アイコンURL',
    example: 'https://example.com/images/noble-phantasm/icon.png',
  })
  icon: string;

  @ApiProperty({
    description: 'ランク',
    example: 'A++',
  })
  rank: string;

  @ApiProperty({
    description: 'タイプ',
    example: '対城宝具',
  })
  type: string;

  @ApiProperty({
    description: '効果フラグ一覧',
    type: [String],
  })
  effectFlags: string[];

  @ApiProperty({
    description: '詳細説明',
    example: '敵全体に強力な攻撃',
  })
  detail: string;

  constructor(
    noblePhantasm: NiceServantDetailResponse['noblePhantasms'][number],
  ) {
    this.id = noblePhantasm.id;
    this.num = noblePhantasm.num;
    this.npNum = noblePhantasm.npNum;
    this.card = noblePhantasm.card;
    this.name = noblePhantasm.name;
    this.originalName = noblePhantasm.originalName;
    this.ruby = noblePhantasm.ruby;
    this.icon = noblePhantasm.icon;
    this.rank = noblePhantasm.rank;
    this.type = noblePhantasm.type;
    this.effectFlags = noblePhantasm.effectFlags ?? [];
    this.detail = noblePhantasm.detail;
  }
}

export class ServantNpGetResponseDto {
  @ApiProperty({
    description: 'サーヴァントID',
    example: 102600,
  })
  id: number;

  @ApiProperty({
    description: 'コレクション番号',
    example: 100,
  })
  collectionNo: number;

  @ApiProperty({
    description: 'サーヴァント名',
    example: '坂本龍馬',
  })
  name: string;

  @ApiProperty({
    description: 'オリジナル名',
    example: '坂本龍馬',
  })
  originalName: string;

  @ApiProperty({
    description: 'フリガナ',
    example: 'さかもとりょうま',
  })
  ruby: string;

  @ApiProperty({
    description: 'クラスID',
    example: 5,
  })
  classId: number;

  @ApiProperty({
    description: 'レアリティ',
    example: 4,
  })
  rarity: number;

  @ApiProperty({
    description: '宝具詳細',
    type: () => NoblePhantasmDto,
    nullable: true,
  })
  noblePhantasm: NoblePhantasmDto | null;

  @ApiProperty({
    description: 'サーヴァント画像URL',
    example: 'https://example.com/images/servants/102600.png',
  })
  imageUrl: string;

  constructor(servantDetail: NiceServantDetailResponse) {
    this.id = servantDetail.id;
    this.collectionNo = servantDetail.collectionNo;
    this.name = servantDetail.name;
    this.originalName = servantDetail.originalName;
    this.ruby = servantDetail.ruby;
    this.classId = servantDetail.classId;
    this.rarity = servantDetail.rarity;
    const lastNoblePhantasm =
      servantDetail.noblePhantasms.at(-1) ?? servantDetail.noblePhantasms[0];
    this.noblePhantasm = lastNoblePhantasm
      ? new NoblePhantasmDto(lastNoblePhantasm)
      : null;
    this.imageUrl = servantDetail.extraAssets.charaGraph.ascension['1'];
  }
}

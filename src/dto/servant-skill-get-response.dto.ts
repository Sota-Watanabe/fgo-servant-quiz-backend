import { ApiProperty } from '@nestjs/swagger';
import { NiceServantDetailResponse } from './servant-detail-nice.dto';

export class ServantSkillGetResponseDto {
  // サーヴァント詳細取得レスポンス用のDTO
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

  @ApiProperty({ description: 'ルビ' })
  ruby: string;

  @ApiProperty({ description: 'クラスID', example: 1 })
  classId: number;

  @ApiProperty({ description: 'レア度', example: 5 })
  rarity: number;

  @ApiProperty({
    description: 'サーヴァント画像URL',
    example: 'https://example.com/images/servants/102600.png',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'ノーブルファンタズム一覧',
    type: () => NoblePhantasm,
    isArray: true,
  })
  noblePhantasms: NoblePhantasm[];

  @ApiProperty({
    description: 'スキル一覧',
    type: () => Skill,
    isArray: true,
  })
  skills: Skill[];

  constructor(data: NiceServantDetailResponse) {
    this.id = data.id;
    this.collectionNo = data.collectionNo;
    this.name = data.name;
    this.originalName = data.originalName;
    this.ruby = data.ruby;
    this.classId = data.classId;
    this.rarity = data.rarity;
    this.noblePhantasms =
      data.noblePhantasms.map((np) => new NoblePhantasm(np)) || [];
    this.skills = data.skills.map((skill) => new Skill(skill)) || [];
    this.imageUrl = data.extraAssets.charaGraph.ascension['1'];
  }
}

class NoblePhantasm {
  @ApiProperty({ description: 'ノーブルファンタズムID', example: 101 })
  id: number;

  @ApiProperty({ description: 'ノーブルファンタズム番号', example: 1 })
  num: number;

  @ApiProperty({ description: 'カードタイプ', example: 'buster' })
  card: string;

  @ApiProperty({
    description: 'ノーブルファンタズム名',
    example: '約束された勝利の剣',
  })
  name: string;

  @ApiProperty({ description: 'オリジナル名', example: 'Excalibur' })
  originalName: string;

  @ApiProperty({ description: 'ルビ', example: 'エクスカリバー' })
  ruby: string;

  @ApiProperty({ description: 'アイコンURL' })
  icon: string;

  @ApiProperty({ description: 'ランク', example: 'A++' })
  rank: string;

  @ApiProperty({ description: 'タイプ', example: '対城宝具' })
  type: string;

  @ApiProperty({ description: '効果フラグ', type: [String] })
  effectFlags: string[];

  @ApiProperty({ description: '詳細説明' })
  detail: string;

  @ApiProperty({ description: '未修正の詳細説明' })
  unmodifiedDetail: string;

  constructor(data: NoblePhantasm) {
    this.id = data.id;
    this.num = data.num;
    this.card = data.card;
    this.name = data.name;
    this.originalName = data.originalName;
    this.ruby = data.ruby;
    this.icon = data.icon;
    this.rank = data.rank;
    this.type = data.type;
    this.effectFlags = data.effectFlags || [];
    this.detail = data.detail;
    this.unmodifiedDetail = data.unmodifiedDetail;
  }
}

export class Skill {
  @ApiProperty({ description: 'スキルID', example: 501 })
  id: number;

  @ApiProperty({ description: 'スキル番号', example: 1 })
  num: number;

  @ApiProperty({ description: 'スキル名', example: 'カリスマ' })
  name: string;

  @ApiProperty({ description: 'オリジナル名', example: 'Charisma' })
  originalName: string;

  @ApiProperty({ description: 'ルビ' })
  ruby: string;

  @ApiProperty({ description: 'スキル詳細説明' })
  detail: string;

  @ApiProperty({ description: '未修正のスキル詳細説明' })
  unmodifiedDetail: string;

  @ApiProperty({ description: 'スキルタイプ' })
  type: string;

  @ApiProperty({ description: '優先度', example: 0 })
  priority: number;

  @ApiProperty({ description: 'アイコンURL' })
  icon: string;

  constructor(data: Skill) {
    this.id = data.id;
    this.num = data.num;
    this.name = data.name;
    this.originalName = data.originalName;
    this.ruby = data.ruby;
    this.detail = data.detail;
    this.unmodifiedDetail = data.unmodifiedDetail;
    this.type = data.type;
    this.priority = data.priority || 0;
    this.icon = data.icon;
  }
}

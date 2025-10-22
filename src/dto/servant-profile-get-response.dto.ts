import { ApiProperty } from '@nestjs/swagger';
import { NiceServantDetailResponse } from './servant-detail-nice.dto';

class ServantProfileStatsDto {
  @ApiProperty({
    description: '筋力',
    example: 'C',
  })
  strength: string;

  @ApiProperty({
    description: '耐久',
    example: 'C',
  })
  endurance: string;

  @ApiProperty({
    description: '敏捷',
    example: 'B',
  })
  agility: string;

  @ApiProperty({
    description: '魔力',
    example: 'D',
  })
  magic: string;

  @ApiProperty({
    description: '幸運',
    example: 'A-',
  })
  luck: string;

  @ApiProperty({
    description: '宝具',
    example: 'EX',
  })
  np: string;

  @ApiProperty({
    description: '属性',
    example: 'neutral',
  })
  policy: string;

  @ApiProperty({
    description: '性格',
    example: 'balanced',
  })
  personality: string;

  @ApiProperty({
    description: '神性',
    example: 'B-',
  })
  deity: string;

  constructor(stats: NiceServantDetailResponse['profile']['stats']) {
    this.strength = stats.strength;
    this.endurance = stats.endurance;
    this.agility = stats.agility;
    this.magic = stats.magic;
    this.luck = stats.luck;
    this.np = stats.np;
    this.policy = stats.policy;
    this.personality = stats.personality;
    this.deity = stats.deity;
  }
}

export class ServantProfileGetResponseDto {
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
    description: '声優',
    example: '加瀬康之＆堀江由衣',
  })
  cv: string;

  @ApiProperty({
    description: 'イラストレーター',
    example: 'pako',
  })
  illustrator: string;

  @ApiProperty({
    description: 'ステータス情報',
    type: () => ServantProfileStatsDto,
  })
  stats: ServantProfileStatsDto;

  @ApiProperty({
    description: 'プロフィール基本情報（最初のコメント）',
    type: () => ProfileCommentDto,
    nullable: true,
  })
  baseProfile: ProfileCommentDto | null;

  constructor(servantDetail: NiceServantDetailResponse) {
    this.id = servantDetail.id;
    this.collectionNo = servantDetail.collectionNo;
    this.name = servantDetail.name;
    this.originalName = servantDetail.originalName;
    this.ruby = servantDetail.ruby;
    this.classId = servantDetail.classId;
    this.rarity = servantDetail.rarity;
    this.cv = servantDetail.profile.cv;
    this.illustrator = servantDetail.profile.illustrator;
    this.stats = new ServantProfileStatsDto(servantDetail.profile.stats);
    this.baseProfile = servantDetail.profile.comments[0] ?? null;
  }
}

export class ProfileCommentDto {
  @ApiProperty({
    description: 'コメントID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '優先度',
    example: 0,
  })
  priority: number;

  @ApiProperty({
    description: '条件メッセージ',
    example: '',
  })
  condMessage: string;

  @ApiProperty({
    description: 'コメント本文',
    example:
      '薩長同盟の立役者であり、亀山社中（のちの海援隊）の結成、大政奉還の成立に尽力するなど明治維新に大きく貢献した志士の一人。',
  })
  comment: string;

  @ApiProperty({
    description: '条件タイプ',
    example: 'none',
  })
  condType: string;
}

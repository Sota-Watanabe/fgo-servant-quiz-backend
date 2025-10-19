import { ApiProperty } from '@nestjs/swagger';
import { NiceServantDetailResponse } from './servant-detail-nice.dto';

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
    example: {
      strength: 'C',
      endurance: 'C',
      agility: 'B',
      magic: 'D',
      luck: 'A-',
      np: 'EX',
      policy: 'neutral',
      personality: 'balanced',
      deity: 'B-',
    },
  })
  stats: {
    strength: string;
    endurance: string;
    agility: string;
    magic: string;
    luck: string;
    np: string;
    policy: string;
    personality: string;
    deity: string;
  };

  @ApiProperty({
    description: 'プロフィールコメント',
    type: [ProfileCommentDto],
  })
  comments: ProfileCommentDto[];

  constructor(servantDetail: NiceServantDetailResponse) {
    this.id = servantDetail.id;
    this.collectionNo = servantDetail.collectionNo;
    this.name = servantDetail.name;
    this.originalName = servantDetail.originalName;
    this.cv = servantDetail.profile.cv;
    this.illustrator = servantDetail.profile.illustrator;
    this.stats = servantDetail.profile.stats;
    this.comments = servantDetail.profile.comments;
  }
}

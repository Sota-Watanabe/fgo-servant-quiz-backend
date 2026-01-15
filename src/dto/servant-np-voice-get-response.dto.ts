import { ApiProperty } from '@nestjs/swagger';
import { NiceServantDetailResponse } from '@/dto/servant-detail-nice.dto';

class VoiceLineDto {
  @ApiProperty({
    description: 'ボイス名',
    example: '宝具セリフ1',
  })
  name: string;

  @ApiProperty({
    description: 'ボイスID配列',
    type: [String],
    example: ['100', '101'],
  })
  id: string[];

  @ApiProperty({
    description: 'オーディオファイルURL配列',
    type: [String],
    example: ['https://example.com/audio/np1.mp3'],
  })
  audioAssets: string[];

  @ApiProperty({
    description: '遅延時間（ミリ秒）配列',
    type: [Number],
    example: [0, 1500],
  })
  delay: number[];

  @ApiProperty({
    description: '優先度',
    example: 1,
  })
  priority: number;

  @ApiProperty({
    description: '条件タイプ',
    example: 'svtLimit',
  })
  condType: string;

  @ApiProperty({
    description: '条件値',
    example: 0,
  })
  condValue: number;

  constructor(
    voiceLine: NiceServantDetailResponse['profile']['voices'][number]['voiceLines'][number],
  ) {
    this.name = voiceLine.overwriteName || voiceLine.name;
    this.id = voiceLine.id;
    this.audioAssets = voiceLine.audioAssets;
    this.delay = voiceLine.delay;
    this.priority = voiceLine.priority;
    this.condType = voiceLine.condType;
    this.condValue = voiceLine.condValue;
  }
}

class NoblePhantasmVoiceDto {
  @ApiProperty({
    description: '宝具ID',
    example: 100010,
  })
  id: number;

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
    description: 'ボイスライン一覧',
    type: [VoiceLineDto],
  })
  voiceLines: VoiceLineDto[];

  constructor(
    noblePhantasm: NiceServantDetailResponse['noblePhantasms'][number],
    voiceLines: VoiceLineDto[],
  ) {
    this.id = noblePhantasm.id;
    this.name = noblePhantasm.name;
    this.originalName = noblePhantasm.originalName;
    this.ruby = noblePhantasm.ruby;
    this.voiceLines = voiceLines;
  }
}

export class ServantNpVoiceGetResponseDto {
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
    description: '宝具ボイス詳細一覧',
    type: [NoblePhantasmVoiceDto],
  })
  noblePhantasms: NoblePhantasmVoiceDto[];

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

    // 宝具ボイスを抽出（type が 'treasureDevice' のもの）
    const npVoices = servantDetail.profile.voices.filter(
      (voice) => voice.type === 'treasureDevice',
    );
    console.log('npVoices:', npVoices);
    const voiceLines = npVoices.flatMap((voice) =>
      voice.voiceLines.map((vl) => new VoiceLineDto(vl)),
    );
    console.log(
      'servantDetail.noblePhantasms[-1]:',
      servantDetail.noblePhantasms[servantDetail.noblePhantasms.length - 1],
    );
    this.noblePhantasms = voiceLines.map(
      (vl) =>
        new NoblePhantasmVoiceDto(
          servantDetail.noblePhantasms[servantDetail.noblePhantasms.length - 1],
          [vl],
        ),
    );

    this.imageUrl = servantDetail.extraAssets.charaGraph.ascension['1'];
  }
}

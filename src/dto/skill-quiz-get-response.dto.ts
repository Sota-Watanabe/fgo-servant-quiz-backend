import { ServantDetailResponse } from './servant-detail.dto';

// 宝具関連の型を追加
type MstTreasureDevice = {
  name: string;
  ruby: string;
  attackAttri: number;
  // 他のプロパティは必要に応じて追加
};

type TreasureDeviceEntity = {
  mstTreasureDevice: MstTreasureDevice;
  // 他のプロパティは必要に応じて追加
};

// ServantDetailResponseを拡張
type ExtendedServantDetailResponse = ServantDetailResponse & {
  mstTreasureDevice?: TreasureDeviceEntity[];
};

export class SkillQuizGetResponseDto {
  servant: ServantInfoDto;
  skills: SkillInfoDto[];
  treasure: TreasureDeviceInfoDto[];

  constructor(data: ExtendedServantDetailResponse) {
    this.servant = new ServantInfoDto(data.mstSvt.name, data.mstSvt.ruby);

    this.skills =
      data.mstSkill?.map(
        (skill) =>
          new SkillInfoDto(
            skill.mstSkill.name,
            skill.mstSkill.ruby,
            skill.mstSkillDetail?.map((detail) => detail.detail) || [],
            skill.mstSvtSkill?.[0]?.num || 0,
            skill.mstSvtSkill?.[0]?.priority || 0,
          ),
      ) || [];

    this.treasure =
      data.mstTreasureDevice?.map(
        (td) =>
          new TreasureDeviceInfoDto(
            td.mstTreasureDevice.name,
            td.mstTreasureDevice.ruby,
            td.mstTreasureDevice.attackAttri,
          ),
      ) || [];
  }
}

export class ServantInfoDto {
  name: string;
  ruby: string;

  constructor(name: string, ruby: string) {
    this.name = name;
    this.ruby = ruby;
  }
}

export class SkillInfoDto {
  name: string;
  ruby: string;
  details: string[];
  skillNumbers: number;
  priorities: number;

  constructor(
    name: string,
    ruby: string,
    details: string[],
    skillNumbers: number,
    priorities: number,
  ) {
    this.name = name;
    this.ruby = ruby;
    this.details = details;
    this.skillNumbers = skillNumbers;
    this.priorities = priorities;
  }
}

export class TreasureDeviceInfoDto {
  name: string;
  ruby: string;
  cardId: number;

  constructor(name: string, ruby: string, cardId: number) {
    this.name = name;
    this.ruby = ruby;
    this.cardId = cardId;
  }
}

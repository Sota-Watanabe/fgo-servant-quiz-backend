export class SkillQuizGetResponseDto {
  servant: ServantInfoDto;
  skills: SkillInfoDto[];
  treasureDevices: TreasureDeviceInfoDto[];

  constructor(
    servant: ServantInfoDto,
    skills: SkillInfoDto[],
    treasureDevices: TreasureDeviceInfoDto[],
  ) {
    this.servant = servant;
    this.skills = skills;
    this.treasureDevices = treasureDevices;
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
  cardIds: number;

  constructor(name: string, ruby: string, cardId: number) {
    this.name = name;
    this.ruby = ruby;
    this.cardId = cardId;
  }
}

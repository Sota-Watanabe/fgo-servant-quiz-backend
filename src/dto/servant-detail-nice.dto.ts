export type ServantDetailNiceResponse = {
  id: number;
  collectionNo: number;
  name: string;
  originalName: string;
  ruby: string;
  classId: number;
  rarity: number;
  noblePhantasms: NoblePhantasm[];
  skills: Skill[];
};

export type NoblePhantasm = {
  id: number;
  num: number;
  npNum: number;
  card: string;
  name: string;
  originalName: string;
  ruby: string;
  icon: string;
  rank: string;
  type: string;
  effectFlags: string[];
  detail: string;
  unmodifiedDetail: string;
  npGain: {
    buster: number[];
    arts: number[];
    quick: number[];
    extra: number[];
    defence: number[];
    np: number[];
  };
};

export type Skill = {
  id: number;
  num: number;
  name: string;
  originalName: string;
  ruby: string;
  detail: string;
  unmodifiedDetail: string;
  type: string;
  svtId: number;
  strengthStatus: number;
  priority: number;
  condQuestId: number;
  condQuestPhase: number;
  condLv: number;
  condLimitCount: number;
  icon: string;
  coolDown: number[];
  actIndividuality: any[];
  script: Record<string, any>;
  extraPassive: any[];
  skillAdd: any[];
  skillSvts: SkillSvt[];
};

export type SkillSvt = {
  svtId: number;
  num: number;
  priority: number;
  script: Record<string, any>;
  strengthStatus: number;
  condQuestId: number;
  condQuestPhase: number;
  condLv: number;
  condLimitCount: number;
  eventId: number;
  flag: number;
  releaseConditions: any[];
};

export type NiceServantDetailResponse = {
  id: number;
  collectionNo: number;
  name: string;
  originalName: string;
  ruby: string;
  classId: number;
  rarity: number;
  extraAssets: ExtraAssets;
  noblePhantasms: NoblePhantasm[];
  skills: Skill[];
  profile: Profile;
};

export type ExtraAssets = {
  charaGraph: CharaGraph;
};

export type CharaGraph = {
  ascension: { '1': string };
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

export type Profile = {
  cv: string;
  illustrator: string;
  stats: ProfileStats;
  costume: Record<string, any>;
  comments: ProfileComment[];
  voices: Voice[];
};

export type Voice = {
  svtId: number;
  voicePrefix: number;
  type: string;
  voiceLines: VoiceLine[];
};

export type VoiceLine = {
  name: string;
  condType: string;
  condValue: number;
  priority: number;
  svtVoiceType: string;
  overwriteName: string;
  id: string[];
  audioAssets: string[];
  delay: number[];
};

export type ProfileStats = {
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

export type ProfileComment = {
  id: number;
  priority: number;
  condMessage: string;
  comment: string;
  condType: string;
  // condValues: number[];
  // condValue2: number;
  // additionalConds: any[];
};

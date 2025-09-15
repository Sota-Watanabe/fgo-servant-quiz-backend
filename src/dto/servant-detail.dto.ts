// 追加型定義
export interface MstCommonRelease {
  id: number;
  priority: number;
  condGroup: number;
  condType: number;
  condId: number;
  condNum: number;
}

export interface MstFunc {
  vals: number[];
  expandedVals: BuffEntityNoReverse[];
  tvals: number[];
  questTvals: number[];
  effectList: number[];
  popupTextColor: number;
  script?: Record<string, any> | null;
  overWriteTvalsList?: number[][] | null;
  id: number;
  cond?: number;
  funcType: number;
  targetType: number;
  applyTarget: number;
  popupIconId: number;
  popupText: string;
}

export interface MstFuncGroup {
  funcId: number;
  eventId: number;
  baseFuncId: number;
  nameTotal: string;
  name: string;
  iconId: number;
  priority: number;
  isDispValue: boolean;
}

export interface BuffEntityNoReverse {
  mstBuff: MstBuff;
}

export interface MstBuff {
  vals: number[];
  tvals: number[];
  ckSelfIndv: number[];
  ckOpIndv: number[];
  script: Record<string, any>;
  id: number;
  buffGroup: number;
  type: number;
  name: string;
  detail: string;
  iconId: number;
  maxRate: number;
}

export interface FunctionEntityNoReverse {
  mstFunc: MstFunc;
  mstFuncGroup: MstFuncGroup[];
}

// Python raw.pyの全フィールドをTypeScript型で網羅
export interface MstSkill {
  effectList: number[];
  actIndividuality: number[];
  script: Record<string, any>;
  id: number;
  type: number;
  name: string;
  ruby: string;
  maxLv: number;
  iconId: number;
  motion: number;
}

export interface MstSkillDetail {
  id: number;
  detail: string;
  detailShort: string;
}

export interface MstSvtSkill {
  script?: Record<string, any>;
  strengthStatus: number;
  svtId: number;
  num: number;
  priority: number;
  skillId: number;
  condQuestId: number;
  condQuestPhase: number;
  condLv?: number;
  condLimitCount: number;
  eventId: number;
  flag: number;
}

export interface MstSvtSkillRelease {
  svtId: number;
  num: number;
  priority: number;
  idx: number;
  condType: number;
  condTargetId: number;
  condNum: number;
  condGroup: number;
}

export interface MstSvtSkillAdd {
  svtId: number;
  num: number;
  priority: number;
  condLimitCount: number;
  commonReleaseId: number;
  skillIds: number[];
  titles: string[];
  script: Record<string, any>;
}

export interface MstSvtPassiveSkill {
  svtId: number;
  num: number;
  priority: number;
  skillId: number;
  condQuestId: number;
  condQuestPhase: number;
  condLv?: number;
  condLimitCount?: number;
  condFriendshipRank: number;
  eventId: number;
  flag?: number;
  commonReleaseId?: number | null;
  startedAt: number;
  endedAt: number;
}

export interface MstSkillLv {
  funcId: number[];
  expandedFuncId?: FunctionEntityNoReverse[];
  svals: string[];
  script: Record<string, any>;
  skillId: number;
  lv: number;
  chargeTurn: number;
  skillDetailId: number;
  priority: number;
}

export interface MstSkillAdd {
  skillId: number;
  priority: number;
  commonReleaseId: number;
  name: string;
  ruby: string;
}

export interface MstSkillGroup {
  id: number;
  skillId: number;
  lv: number;
}

export interface MstSkillGroupOverwrite {
  funcId: number[];
  svals: string[];
  skillGroupId: number;
  startedAt: number;
  endedAt: number;
  iconId: number;
  vals: string;
  skillDetailId: number;
  expandedFuncId?: FunctionEntityNoReverse[];
}

export interface SkillEntityNoReverse {
  mstSkill: MstSkill;
  mstSkillDetail: MstSkillDetail[];
  mstSvtSkill: MstSvtSkill[];
  mstSkillAdd: MstSkillAdd[];
  mstSvtSkillRelease: MstSvtSkillRelease[];
  mstCommonRelease: MstCommonRelease[];
  mstSkillLv: MstSkillLv[];
  mstSkillGroup: MstSkillGroup[];
  mstSkillGroupOverwrite: MstSkillGroupOverwrite[];
  aiIds?: Record<string, number[]>;
}

export interface MstSvt {
  relateQuestIds: number[];
  individuality: number[];
  classPassive: number[];
  expandedClassPassive: SkillEntityNoReverse[];
  cardIds: number[];
  script: Record<string, any>;
  id: number;
  baseSvtId: number;
  name: string;
  ruby: string;
  battleName: string;
  classId: number;
  type: number;
  limitMax: number;
  rewardLv: number;
  friendshipId: number;
  maxFriendshipRank: number;
  genderType: number;
  attri: number;
  combineSkillId: number;
  combineLimitId: number;
  sellQp: number;
  sellMana: number;
  sellRarePri: number;
  expType: number;
  combineMaterialId: number;
  cost: number;
  battleSize: number;
  hpGaugeY: number;
  starRate: number;
  deathRate: number;
  attackAttri: number;
  illustratorId: number;
  cvId: number;
  collectionNo: number;
  materialStoryPriority: number;
  flag: number;
}

export interface MstSvtIndividuality {
  individuality: number[];
  svtId: number;
  idx: number;
  limitCount: number;
  condType?: number | null;
  condId?: number | null;
  condNum?: number | null;
  startedAt?: number | null;
  eventId?: number | null;
  endedAt?: number | null;
}

export interface MstSvtLimitAdd {
  individuality: number[];
  script: Record<string, any>;
  svtId: number;
  limitCount: number;
  battleCharaId: number;
  fileConvertLimitCount: number;
  battleCharaLimitCount: number;
  battleCharaOffsetX: number;
  battleCharaOffsetY: number;
  battleCharaOffsetZ: number;
  svtVoiceId: number;
  voicePrefix: number;
  attri?: number | null;
}

export interface MstSvtLimit {
  weaponColor: number;
  svtId: number;
  limitCount: number;
  rarity: number;
  lvMax: number;
  weaponGroup: number;
  weaponScale: number;
  effectFolder: number;
  hpBase: number;
  hpMax: number;
  atkBase: number;
  atkMax: number;
  criticalWeight: number;
  power: number;
  defense: number;
  agility: number;
  magic: number;
  luck: number;
  treasureDevice: number;
  policy: number;
  personality: number;
  deity: number;
  stepProbability: number;
  strParam: string;
}

export interface MstSvtExtra {
  svtId: number;
  mstSvt: MstSvt;
  zeroLimitOverwriteName?: string | null;
  bondEquip: number;
  bondEquipOwner?: number | null;
  valentineEquip: number[];
  valentineScript: any[];
  valentineEquipOwner?: number | null;
  costumeLimitSvtIdMap: Record<number, any>;
  limitAdds: MstSvtLimitAdd[];
  limits: MstSvtLimit[];
}

export interface MstSvtCard {
  normalDamage: number[];
  singleDamage: number[];
  trinityDamage: number[];
  unisonDamage: number[];
  grandDamage: number[];
  attackIndividuality: number[];
  svtId: number;
  cardId: number;
  motion: number;
  attackType: number;
}

export interface MstSvtCardAdd {
  svtId: number;
  cardId: number;
  script: string;
}

export interface BasicMstSvtLimit {
  rarity: number;
  hpMax: number;
  atkMax: number;
}

export interface MstSvtComment {
  condValues?: number[] | null;
  script?: Record<string, any> | null;
  svtId: number;
  id: number;
  priority: number;
  condMessage: string;
  comment: string;
  condType: number;
  condValue2: number;
}

export interface ServantDetailResponse {
  mstSvt: MstSvt;
  mstSkill: MstSkill[];
  mstSvtLimit?: MstSvtLimit[];
  mstSvtExtra?: MstSvtExtra;
  mstSvtCard?: MstSvtCard[];
  mstSvtComment?: MstSvtComment[];
  mstSvtSkill?: MstSvtSkill[];
  mstSvtSkillRelease?: MstSvtSkillRelease[];
  mstSvtSkillAdd?: MstSvtSkillAdd[];
  mstSvtPassiveSkill?: MstSvtPassiveSkill[];
  mstSkillLv?: MstSkillLv[];
  mstSkillAdd?: MstSkillAdd[];
  mstSkillGroup?: MstSkillGroup[];
  mstSkillGroupOverwrite?: MstSkillGroupOverwrite[];
  // ...他にもAPIレスポンスに合わせて追加
}

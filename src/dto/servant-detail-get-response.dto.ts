// サーヴァント詳細取得レスポンス用のDTO

import { ServantDetailNiceResponse } from './servant-detail-nice.dto';

export class NoblePhantasm {
  id: number;
  num: number;
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
  id: number;
  num: number;
  name: string;
  originalName: string;
  ruby: string;
  detail: string;
  unmodifiedDetail: string;
  type: string;
  priority: number;
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

export class ServantDetailGetResponseDto {
  id: number;
  collectionNo: number;
  name: string;
  originalName: string;
  ruby: string;
  classId: number;
  rarity: number;
  noblePhantasms: NoblePhantasm[];
  skills: Skill[];

  constructor(data: ServantDetailNiceResponse) {
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
  }
}

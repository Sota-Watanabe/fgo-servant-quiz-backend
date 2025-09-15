export class ServantDto {
  id: number;
  collectionNo: number;
  name: string;
  originalName: string;
  type: string; // "normal" | "heroine" | ...
  flag: string; // "normal" など
  flags: string[];
  classId: number;
  className: string; // "saber" | "shielder" | ...
  attribute: string; // "earth" | "human" | ...
  traits: {
    id: number;
    name: string;
  }[];
  rarity: number;
  atkMax: number;
  hpMax: number;
  face: string; // 画像URL
  costume: {
    [battleCharaId: string]: {
      id: number;
      costumeCollectionNo: number;
      battleCharaId: number;
      shortName: string;
    };
  };
}

export type ServantSearchResultDto = ServantDto[];

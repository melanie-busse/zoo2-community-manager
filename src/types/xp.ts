export interface Xp {
  id: number;
  xptype: XpType;
  xpValue?: number;
  xpDuration?: number;
}

export interface XpType {
  id: number;
  name: string;
  xpTypeText: XpTypeText[];
}

export type XpTypeText = {
  id: number;
  xpTypeName: string;
  xpTypeText: string;
};

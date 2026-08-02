export interface User {
  id: number;
  name: string | null;
  upjersname?: string | null;
  email?: string;
  image?: string;
  role?: Role;
  last_login?: Date;
}

export interface Role {
  id: number;
  name: string;
  roletext: string;
}

export interface RankedUser {
  name: string;
  rawSum: number;
  multiplier: number;
  weighted: number;
}

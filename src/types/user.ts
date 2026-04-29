export interface User {
  id: number;
  name: string;
  email?: string;
  image?: string;
  role?: Role;
  last_login?:Date;
}

export interface Role {
  id: number;
  name: string;
  roletext: string;
}
import { Animal } from "@/types/animal";
import { User } from "@/types/user";
import { SpecialCoat } from "@/types/specialCoat";

export interface Contest {
  id: number;
  startDate: Date | string;
  endDate: Date | string;
  active: boolean;

  contestdonation?: ContestDonation[];
  conteststatue?: ContestStatue[];
  contestspecialcoat?: ContestSpecialCoat[];
}

export interface ContestDonation {
  id: number;
  contest?: Contest;
  animal: Animal;
  level?: number;
  count?: number;
  timestamp?: Date | string | null;
  user?: User;
}

export interface ContestStatue {
  id: number;
  contest: Contest;
  animal: Animal;
}

export interface ContestSpecialCoat {
  id: number;
  contestId: number;
  specialCoatId: number;
  specialcoat?: SpecialCoat;
}

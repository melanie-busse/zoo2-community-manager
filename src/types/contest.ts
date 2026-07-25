import { Animal } from "@/types/animal";
import { User } from "@/types/user";
import { Statue } from "@/types/statue";
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
  contest: Contest;
  animal: Animal;
  statue: Statue;
  puzzlePiece?: number | null;
  user?: User;
}

export interface ContestStatue {
  id: number;
  contest: Contest;
  statue: Statue;
}

export interface ContestSpecialCoat {
  id: number;
  contestId: number;
  specialCoatId: number;
  specialcoat?: SpecialCoat;
}

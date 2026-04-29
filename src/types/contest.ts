import { Animal } from "@/types/animal";
import { User } from "@/types/user";

export interface Contest {
  id: number;
  // Date | string, da JSON.stringify Daten in Strings umwandelt
  startDate: Date | string;
  endDate: Date | string;
  active: boolean;

  contestdonation?: ContestDonation[];
  conteststatue?: ContestStatue[];
}

export interface ContestDonation {
  id: number;
  puzzlePiece?: number | null;
  user?: User;
  animals?: Animal[];
}

export interface ContestStatue {
  id: number;
  statue: {
    id: number;
    name: string;
    animal?: Animal;
  };
}

import { PriceType } from "@/types/PriceType";
import { Image } from "@/types/image";
import { Animal } from "@/types/animal";

export interface Statue {
  id: number;
  statuetext: StatueText[];
  price?: number | null;
  priceType?: PriceType | null;
  popularity?: number | null;
  sellingPrice?: number | null;
  image?: Image | null;
  animal: Animal;
}

export interface StatueText {
  id: number;
  statueName: string;
}
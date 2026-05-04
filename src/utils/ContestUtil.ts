import { Statue } from "@/types/statue";

export function getStatueName(statue: Statue, fallback: string) {
  return statue.animal.animaltext[0]?.animalName || fallback;
}

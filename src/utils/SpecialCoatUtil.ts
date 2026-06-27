import { Image } from "@/types/image";
import { SpecialCoat } from "@/types/specialCoat";

export function getSpecialCoatImage(specialCoat: SpecialCoat): Image {
  return {
    name: specialCoat.image || "placeholder.png",

    path: `/images/specialCoat/${specialCoat.image}`,

    alt: specialCoat.specialcoatstext?.[0]?.name || "Tierbild",
  };
}

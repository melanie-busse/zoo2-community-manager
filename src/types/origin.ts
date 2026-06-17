export interface Origin {
  id: number;
  name: string;
  image: string | null;
  origintext?: Array<{ originName: string; languageCode: string }>;
}

// Das ist das Objekt, das aktuell in deinem animalorigins-Array steckt!
export interface AnimalOrigin {
  id: number;
  animalId: number;
  originId: number | null;
  origin: Origin | null;
}

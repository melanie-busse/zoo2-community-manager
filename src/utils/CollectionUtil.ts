import { Collection, CollectionRequirement } from "@/types/collection";

export function getRequirementImageSrc(req: CollectionRequirement): string | null {
  if (
    req.specialCoat?.identifier &&
    req.specialCoat.animal?.identifier &&
    req.specialCoat.animal.biome?.identifier
  ) {
    const animalId = req.specialCoat.animal.identifier;
    const coatFolder = req.specialCoat.identifier!.slice(animalId.length + 1);
    return `/images/animals/${req.specialCoat.animal.biome.identifier}/${animalId}/specialcoats/${coatFolder}/image.jpg`;
  }
  if (req.decoration?.identifier && req.decoration.category?.identifier) {
    return `/images/decorations/${req.decoration.category.identifier}/${req.decoration.identifier}/image.jpg`;
  }
  if (req.animal?.identifier && req.animal.biome?.identifier) {
    if (req.type === "DECORATION") {
      return `/images/animals/${req.animal.biome.identifier}/${req.animal.identifier}/statue/image.webp`;
    }
    return `/images/animals/${req.animal.biome.identifier}/${req.animal.identifier}/image.jpg`;
  }
  return null;
}

export function getRequirementLabel(req: CollectionRequirement): { name: string; color?: string } {
  if (req.specialCoat) {
    const text = req.specialCoat.specialcoatstext?.[0];
    return { name: text?.name ?? req.itemName, color: text?.color };
  }
  if (req.decoration) {
    return { name: req.decoration.name };
  }
  if (req.animal) {
    return { name: req.animal.name ?? req.itemName };
  }
  return { name: req.itemName };
}

export function getRewardLabel(collection: Collection): { name: string; color?: string } {
  const coat = collection.rewardSpecialCoat;
  if (coat?.identifier && coat.animal?.identifier && coat.animal.biome?.identifier) {
    const text = coat.specialcoatstext?.[0];
    return { name: text?.name ?? coat.identifier ?? collection.name, color: text?.color };
  }
  if (collection.rewardAnimal?.identifier) {
    return {
      name: collection.rewardAnimal.name ?? collection.rewardAnimal.identifier ?? collection.name,
    };
  }
  return { name: collection.name };
}

export function getAnimalImageSrc(collection: Collection): string {
  const coat = collection.rewardSpecialCoat;
  if (coat?.identifier && coat.animal?.identifier && coat.animal.biome?.identifier) {
    const animalId = coat.animal.identifier;
    const coatFolder = coat.identifier!.slice(animalId.length + 1);
    return `/images/animals/${coat.animal.biome.identifier}/${animalId}/specialcoats/${coatFolder}/image.jpg`;
  }
  if (collection.rewardAnimal?.identifier && collection.rewardAnimal.biome?.identifier) {
    return `/images/animals/${collection.rewardAnimal.biome.identifier}/${collection.rewardAnimal.identifier}/image.jpg`;
  }
  const firstReq = collection.requirements[0];
  return (firstReq ? getRequirementImageSrc(firstReq) : null) ?? "/placeholder.png";
}
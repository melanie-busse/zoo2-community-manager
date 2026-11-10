export type RawAnimal = { name: string; isNpc: boolean };

export type RawEntry = {
  type: "PREMIUM" | "VIP";
  year: number;
  dateLabel: string;
  startDate: string | null;
  endDate: string | null;
  animals: RawAnimal[];
};

export const rawEntries: RawEntry[] = [
  // ============================================================
  // PREMIUM 2026
  // ============================================================
  { type: "PREMIUM", year: 2026, dateLabel: "November 3rd – November 17th", startDate: "2026-11-03", endDate: "2026-11-17", animals: [{ name: "Cotton-Top Tamarin", isNpc: false }, { name: "Fossa", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "October 20th – November 3rd", startDate: "2026-10-20", endDate: "2026-11-03", animals: [{ name: "Cotton-Top Tamarin", isNpc: false }, { name: "European Mouflon", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "October 6th – October 20th", startDate: "2026-10-06", endDate: "2026-10-20", animals: [{ name: "Philippine Eagle Owl", isNpc: false }, { name: "European Mouflon", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "September 22nd – October 6th", startDate: "2026-09-22", endDate: "2026-10-06", animals: [{ name: "Philippine Eagle Owl", isNpc: false }, { name: "Sun Bear", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "September 8th – September 22nd", startDate: "2026-09-08", endDate: "2026-09-22", animals: [{ name: "European Bison", isNpc: false }, { name: "Sun Bear", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "August 25th – September 8th", startDate: "2026-08-25", endDate: "2026-09-08", animals: [{ name: "European Bison", isNpc: false }, { name: "Bengal Slow Loris", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "August 11th – August 25th", startDate: "2026-08-11", endDate: "2026-08-25", animals: [{ name: "Andean Mountain Cat", isNpc: false }, { name: "Bengal Slow Loris", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "July 28th – August 11th", startDate: "2026-07-28", endDate: "2026-08-11", animals: [{ name: "Andean Mountain Cat", isNpc: false }, { name: "Stanley Bustard", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "July 14th – July 28th", startDate: "2026-07-14", endDate: "2026-07-28", animals: [{ name: "Bengal Fox", isNpc: false }, { name: "Stanley Bustard", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "June 30th – July 14th", startDate: "2026-06-30", endDate: "2026-07-14", animals: [{ name: "Bengal Fox", isNpc: false }, { name: "Gila Monster", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "June 16th – June 30th", startDate: "2026-06-16", endDate: "2026-06-30", animals: [{ name: "Ferruginous Hawk", isNpc: false }, { name: "Gila Monster", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "June 2nd – June 16th", startDate: "2026-06-02", endDate: "2026-06-16", animals: [{ name: "Ferruginous Hawk", isNpc: false }, { name: "Coral Catshark", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "May 19th – June 2nd", startDate: "2026-05-19", endDate: "2026-06-02", animals: [{ name: "Water Deer", isNpc: false }, { name: "Coral Catshark", isNpc: false }, { name: "Amethyst Starling", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "May 5th – May 19th", startDate: "2026-05-05", endDate: "2026-05-19", animals: [{ name: "Water Deer", isNpc: false }, { name: "Iberian Lynx", isNpc: false }, { name: "Amethyst Starling", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "April 7th – May 5th", startDate: "2026-04-07", endDate: "2026-05-05", animals: [{ name: "Iberian Lynx", isNpc: false }, { name: "Spix's Macaw", isNpc: false }, { name: "Amethyst Starling", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "April 7th – April 21st", startDate: "2026-04-07", endDate: "2026-04-21", animals: [{ name: "Iberian Lynx", isNpc: false }, { name: "Californian Rabbit", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "March 24th – April 7th", startDate: "2026-03-24", endDate: "2026-04-07", animals: [{ name: "Loggerhead Sea Turtle", isNpc: false }, { name: "Californian Rabbit", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "March 10th – March 24th", startDate: "2026-03-10", endDate: "2026-03-24", animals: [{ name: "Loggerhead Sea Turtle", isNpc: false }, { name: "Guanaco", isNpc: false }, { name: "Indo-Pacific Sailfish", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "February 24th – March 10th", startDate: "2026-02-24", endDate: "2026-03-10", animals: [{ name: "Guanaco", isNpc: false }, { name: "Fea's Muntjac", isNpc: false }, { name: "Indo-Pacific Sailfish", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "February 10th – February 24th", startDate: "2026-02-10", endDate: "2026-02-24", animals: [{ name: "Guanaco", isNpc: false }, { name: "Fea's Muntjac", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "January 27th – February 10th", startDate: "2026-01-27", endDate: "2026-02-10", animals: [{ name: "Black-Browed Albatross", isNpc: false }, { name: "Fea's Muntjac", isNpc: false }] },
  { type: "PREMIUM", year: 2026, dateLabel: "January 13th – January 27th", startDate: "2026-01-13", endDate: "2026-01-27", animals: [{ name: "Black-Browed Albatross", isNpc: false }, { name: "Asian Golden Cat", isNpc: false }] },

  // ============================================================
  // PREMIUM 2025
  // ============================================================
  { type: "PREMIUM", year: 2025, dateLabel: "December 30th – January 13th", startDate: "2025-12-30", endDate: "2026-01-13", animals: [{ name: "Asian Golden Cat", isNpc: false }, { name: "Red Swamp Crayfish", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "December 16th – December 30th", startDate: "2025-12-16", endDate: "2025-12-30", animals: [{ name: "Fossa", isNpc: false }, { name: "Boa Constrictor", isNpc: false }, { name: "Red Swamp Crayfish", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "December 2nd – December 16th", startDate: "2025-12-02", endDate: "2025-12-16", animals: [{ name: "Fossa", isNpc: false }, { name: "Boa Constrictor", isNpc: false }, { name: "Red Deer", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "November 25th – December 2nd", startDate: "2025-11-25", endDate: "2025-12-02", animals: [{ name: "Fossa", isNpc: false }, { name: "Boa Constrictor", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "November 18th – November 25th", startDate: "2025-11-18", endDate: "2025-11-25", animals: [{ name: "Fossa", isNpc: false }, { name: "Grizzly Bear", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "November 4th – November 18th", startDate: "2025-11-04", endDate: "2025-11-18", animals: [{ name: "European Mouflon", isNpc: false }, { name: "Grizzly Bear", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "October 21st – November 4th", startDate: "2025-10-21", endDate: "2025-11-04", animals: [{ name: "European Mouflon", isNpc: false }, { name: "Galápagos Land Iguana", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "October 7th – October 21st", startDate: "2025-10-07", endDate: "2025-10-21", animals: [{ name: "Sun Bear", isNpc: false }, { name: "Galápagos Land Iguana", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "September 23rd – October 7th", startDate: "2025-09-23", endDate: "2025-10-07", animals: [{ name: "Sun Bear", isNpc: false }, { name: "Black Stork", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "September 9th – September 23rd", startDate: "2025-09-09", endDate: "2025-09-23", animals: [{ name: "Bengal Slow Loris", isNpc: false }, { name: "Black Stork", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "August 26th – September 9th", startDate: "2025-08-26", endDate: "2025-09-09", animals: [{ name: "Bengal Slow Loris", isNpc: false }, { name: "Stanley Bustard", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "August 12th – August 26th", startDate: "2025-08-12", endDate: "2025-08-26", animals: [{ name: "Stanley Bustard", isNpc: false }, { name: "Onager", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "July 29th – August 12th", startDate: "2025-07-29", endDate: "2025-08-12", animals: [{ name: "Stanley Bustard", isNpc: false }, { name: "Gila Monster", isNpc: false }, { name: "Tokay Gecko", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "July 15th – July 29th", startDate: "2025-07-15", endDate: "2025-07-29", animals: [{ name: "Gila Monster", isNpc: false }, { name: "Royal Sable Antelope", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "July 1st – July 15th", startDate: "2025-07-01", endDate: "2025-07-15", animals: [{ name: "Gila Monster", isNpc: false }, { name: "Coral Catshark", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "June 17th – July 1st", startDate: "2025-06-17", endDate: "2025-07-01", animals: [{ name: "Coral Catshark", isNpc: false }, { name: "Highland Cattle", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "June 3rd – June 17th", startDate: "2025-06-03", endDate: "2025-06-17", animals: [{ name: "Coral Catshark", isNpc: false }, { name: "Spix's Macaw", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "May 20th – June 3rd", startDate: "2025-05-20", endDate: "2025-06-03", animals: [{ name: "Spix's Macaw", isNpc: false }, { name: "Red-Footed Tortoise", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "May 6th – May 20th", startDate: "2025-05-06", endDate: "2025-05-20", animals: [{ name: "Spix's Macaw", isNpc: false }, { name: "Californian Rabbit", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "April 22nd – May 6th", startDate: "2025-04-22", endDate: "2025-05-06", animals: [{ name: "Californian Rabbit", isNpc: false }, { name: "Giant Golden-Crowned Flying Fox", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "April 8th – April 22nd", startDate: "2025-04-08", endDate: "2025-04-22", animals: [{ name: "Californian Rabbit", isNpc: false }, { name: "Indo-Pacific Sailfish", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "March 25th – April 8th", startDate: "2025-03-25", endDate: "2025-04-08", animals: [{ name: "Indo-Pacific Sailfish", isNpc: false }, { name: "Wattled Crane", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "March 11th – March 25th", startDate: "2025-03-11", endDate: "2025-03-25", animals: [{ name: "Indo-Pacific Sailfish", isNpc: false }, { name: "Fea's Muntjac", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "February 25th – March 11th", startDate: "2025-02-25", endDate: "2025-03-11", animals: [{ name: "Fea's Muntjac", isNpc: false }, { name: "Asian Golden Cat", isNpc: false }, { name: "Saimaa Ringed Seal", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "February 11th – February 25th", startDate: "2025-02-11", endDate: "2025-02-25", animals: [{ name: "Fea's Muntjac", isNpc: false }, { name: "Asian Golden Cat", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "January 28th – February 11th", startDate: "2025-01-28", endDate: "2025-02-11", animals: [{ name: "Asian Golden Cat", isNpc: false }, { name: "Red Deer", isNpc: false }, { name: "Variegated Squirrel", isNpc: false }, { name: "Vaquita", isNpc: false }] },
  { type: "PREMIUM", year: 2025, dateLabel: "January 14th – January 28th", startDate: "2025-01-14", endDate: "2025-01-28", animals: [{ name: "Asian Golden Cat", isNpc: false }, { name: "Red Deer", isNpc: false }, { name: "Variegated Squirrel", isNpc: false }] },

  // ============================================================
  // PREMIUM 2024
  // ============================================================
  { type: "PREMIUM", year: 2024, dateLabel: "December 31st – January 14th", startDate: "2024-12-31", endDate: "2025-01-14", animals: [{ name: "Red Deer", isNpc: false }, { name: "Long-Legged Buzzard", isNpc: false }, { name: "Variegated Squirrel", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "December 17th – December 31st", startDate: "2024-12-17", endDate: "2024-12-31", animals: [{ name: "Red Deer", isNpc: false }, { name: "Harp Seal", isNpc: false }, { name: "Variegated Squirrel", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "December 3rd – December 17th", startDate: "2024-12-03", endDate: "2024-12-17", animals: [{ name: "Grizzly Bear", isNpc: false }, { name: "Harp Seal", isNpc: false }, { name: "Jentink's Duiker", isNpc: false }, { name: "Gharial", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "November 26th – December 3rd", startDate: "2024-11-26", endDate: "2024-12-03", animals: [{ name: "Grizzly Bear", isNpc: false }, { name: "Harp Seal", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "November 19th – November 26th", startDate: "2024-11-19", endDate: "2024-11-26", animals: [{ name: "Grizzly Bear", isNpc: false }, { name: "Somali Ostrich", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "November 5th – November 19th", startDate: "2024-11-05", endDate: "2024-11-19", animals: [{ name: "Galápagos Land Iguana", isNpc: false }, { name: "Aye-Aye", isNpc: false }, { name: "Somali Ostrich", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "October 22nd – November 5th", startDate: "2024-10-22", endDate: "2024-11-05", animals: [{ name: "Galápagos Land Iguana", isNpc: false }, { name: "Aye-Aye", isNpc: false }, { name: "Gharial", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "October 8th – October 22nd", startDate: "2024-10-08", endDate: "2024-10-22", animals: [{ name: "Black Stork", isNpc: false }, { name: "Gharial", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "September 24th – October 8th", startDate: "2024-09-24", endDate: "2024-10-08", animals: [{ name: "Black Stork", isNpc: false }, { name: "Red-Necked Pademelon", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "September 10th – September 24th", startDate: "2024-09-10", endDate: "2024-09-24", animals: [{ name: "Onager", isNpc: false }, { name: "Occellate River Stingray", isNpc: false }, { name: "Red-Necked Pademelon", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "August 27th – September 10th", startDate: "2024-08-27", endDate: "2024-09-10", animals: [{ name: "Onager", isNpc: false }, { name: "Occellate River Stingray", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "August 13th – August 27th", startDate: "2024-08-13", endDate: "2024-08-27", animals: [{ name: "Royal Sable Antelope", isNpc: false }, { name: "European Wildcat", isNpc: false }, { name: "Galápagos Pink Land Iguana", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "July 30th – August 13th", startDate: "2024-07-30", endDate: "2024-08-13", animals: [{ name: "Royal Sable Antelope", isNpc: false }, { name: "European Wildcat", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "July 16th – July 30th", startDate: "2024-07-16", endDate: "2024-07-30", animals: [{ name: "Highland Cattle", isNpc: false }, { name: "Yellow-Throated Marten", isNpc: false }, { name: "European Wildcat", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "July 2nd – July 16th", startDate: "2024-07-02", endDate: "2024-07-16", animals: [{ name: "Highland Cattle", isNpc: false }, { name: "Yellow-Throated Marten", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "June 18th – July 2nd", startDate: "2024-06-18", endDate: "2024-07-02", animals: [{ name: "Red-Footed Tortoise", isNpc: false }, { name: "Tokay Gecko", isNpc: false }, { name: "Black Rhinoceros", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "June 4th – June 18th", startDate: "2024-06-04", endDate: "2024-06-18", animals: [{ name: "Red-Footed Tortoise", isNpc: false }, { name: "Tokay Gecko", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "May 21st – June 4th", startDate: "2024-05-21", endDate: "2024-06-04", animals: [{ name: "Giant Golden-Crowned Flying Fox", isNpc: false }, { name: "Tokay Gecko", isNpc: false }, { name: "Black-Footed Cat", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "May 7th – May 21st", startDate: "2024-05-07", endDate: "2024-05-21", animals: [{ name: "Giant Golden-Crowned Flying Fox", isNpc: false }, { name: "Tokay Gecko", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "April 23rd – May 7th", startDate: "2024-04-23", endDate: "2024-05-07", animals: [{ name: "Wattled Crane", isNpc: false }, { name: "Blue Iguana", isNpc: false }, { name: "Short-Eared Zorro", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "April 9th – April 23rd", startDate: "2024-04-09", endDate: "2024-04-23", animals: [{ name: "Wattled Crane", isNpc: false }, { name: "Blue Iguana", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "March 26th – April 9th", startDate: "2024-03-26", endDate: "2024-04-09", animals: [{ name: "Saimaa Ringed Seal", isNpc: false }, { name: "Ghost Bat", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "March 12th – March 26th", startDate: "2024-03-12", endDate: "2024-03-26", animals: [{ name: "Saimaa Ringed Seal", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "February 27th – March 12th", startDate: "2024-02-27", endDate: "2024-03-12", animals: [{ name: "Vaquita", isNpc: false }, { name: "Ethiopian Wolf", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "February 13th – February 27th", startDate: "2024-02-13", endDate: "2024-02-27", animals: [{ name: "Vaquita", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "January 30th – February 13th", startDate: "2024-01-30", endDate: "2024-02-13", animals: [{ name: "Long-Legged Buzzard", isNpc: false }, { name: "Ram Cichlid", isNpc: false }, { name: "Common Genet", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "January 16th – January 30th", startDate: "2024-01-16", endDate: "2024-01-30", animals: [{ name: "Long-Legged Buzzard", isNpc: false }, { name: "Ram Cichlid", isNpc: false }] },
  { type: "PREMIUM", year: 2024, dateLabel: "January 2nd – January 16th", startDate: "2024-01-02", endDate: "2024-01-16", animals: [{ name: "Jentink's Duiker", isNpc: false }, { name: "Scarlet Kingsnake", isNpc: false }, { name: "Indian Star Tortoise", isNpc: false }] },

  // ============================================================
  // PREMIUM 2023
  // ============================================================
  { type: "PREMIUM", year: 2023, dateLabel: "December 19th – January 2nd", startDate: "2023-12-19", endDate: "2024-01-02", animals: [{ name: "Jentink's Duiker", isNpc: false }, { name: "Scarlet Kingsnake", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "December 5th – December 19th", startDate: "2023-12-05", endDate: "2023-12-19", animals: [{ name: "Somali Ostrich", isNpc: false }, { name: "Great White Shark", isNpc: false }, { name: "Peacock Eel", isNpc: false }, { name: "Siberian Tiger", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "November 21st – December 5th", startDate: "2023-11-21", endDate: "2023-12-05", animals: [{ name: "Somali Ostrich", isNpc: false }, { name: "Great White Shark", isNpc: false }, { name: "Peacock Eel", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "November 7th – November 21st", startDate: "2023-11-07", endDate: "2023-11-21", animals: [{ name: "Gharial", isNpc: false }, { name: "Giant Eland", isNpc: false }, { name: "Alpine Marmot", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "October 24th – November 7th", startDate: "2023-10-24", endDate: "2023-11-07", animals: [{ name: "Gharial", isNpc: false }, { name: "Giant Eland", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "October 10th – October 24th", startDate: "2023-10-10", endDate: "2023-10-24", animals: [{ name: "Gharial", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "September 26th – October 10th", startDate: "2023-09-26", endDate: "2023-10-10", animals: [{ name: "Red-Necked Pademelon", isNpc: false }, { name: "Mimic Octopus", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "September 12th – September 26th", startDate: "2023-09-12", endDate: "2023-09-26", animals: [{ name: "Galápagos Pink Land Iguana", isNpc: false }, { name: "Ground Pangolin", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "August 29th – September 12th", startDate: "2023-08-29", endDate: "2023-09-12", animals: [{ name: "Galápagos Pink Land Iguana", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "August 15th – August 29th", startDate: "2023-08-15", endDate: "2023-08-29", animals: [{ name: "European Wildcat", isNpc: false }, { name: "Indian Rhinoceros", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "August 1st – August 15th", startDate: "2023-08-01", endDate: "2023-08-15", animals: [{ name: "European Wildcat", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "July 18th – August 1st", startDate: "2023-07-18", endDate: "2023-08-01", animals: [{ name: "Black Rhinoceros", isNpc: false }, { name: "Blue-Footed Booby", isNpc: false }, { name: "Black Bearded Saki", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "July 4th – July 18th", startDate: "2023-07-04", endDate: "2023-07-18", animals: [{ name: "Black Rhinoceros", isNpc: false }, { name: "Blue-Footed Booby", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "June 20th – July 4th", startDate: "2023-06-20", endDate: "2023-07-04", animals: [{ name: "Black-Footed Cat", isNpc: false }, { name: "Brown Hyena", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "June 6th – June 20th", startDate: "2023-06-06", endDate: "2023-06-20", animals: [{ name: "Black-Footed Cat", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "May 23rd – June 6th", startDate: "2023-05-23", endDate: "2023-06-06", animals: [{ name: "Short-Eared Zorro", isNpc: false }, { name: "Everglades Crayfish", isNpc: false }, { name: "Bearded Pig", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "May 9th – May 23rd", startDate: "2023-05-09", endDate: "2023-05-23", animals: [{ name: "Short-Eared Zorro", isNpc: false }, { name: "Everglades Crayfish", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "April 25th – May 9th", startDate: "2023-04-25", endDate: "2023-05-09", animals: [{ name: "Ghost Bat", isNpc: false }, { name: "Hawksbill Sea Turtle", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "April 11th – April 25th", startDate: "2023-04-11", endDate: "2023-04-25", animals: [{ name: "Ghost Bat", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "March 28th – April 11th", startDate: "2023-03-28", endDate: "2023-04-11", animals: [{ name: "Ethiopian Wolf", isNpc: false }, { name: "Green-and-Black Poison Dart Frog", isNpc: false }, { name: "Masked Puffer", isNpc: false }, { name: "Canadian Porcupine", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "March 14th – March 28th", startDate: "2023-03-14", endDate: "2023-03-28", animals: [{ name: "Ethiopian Wolf", isNpc: false }, { name: "Green-and-Black Poison Dart Frog", isNpc: false }, { name: "Masked Puffer", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "February 28th – March 14th", startDate: "2023-02-28", endDate: "2023-03-14", animals: [{ name: "Blackbuck", isNpc: false }, { name: "Compass Jellyfish", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "February 14th – February 28th", startDate: "2023-02-14", endDate: "2023-02-28", animals: [{ name: "Common Genet", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "January 17th – February 14th", startDate: "2023-01-17", endDate: "2023-02-14", animals: [{ name: "Indian Star Tortoise", isNpc: false }, { name: "Red-Crowned Crane", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "January 17th – January 31st", startDate: "2023-01-17", endDate: "2023-01-31", animals: [{ name: "Indian Star Tortoise", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "January 3rd – January 17th", startDate: "2023-01-03", endDate: "2023-01-17", animals: [{ name: "Siberian Tiger", isNpc: false }, { name: "Virginia Opossum", isNpc: false }] },
  { type: "PREMIUM", year: 2023, dateLabel: "December 20th – January 3rd", startDate: "2022-12-20", endDate: "2023-01-03", animals: [{ name: "Siberian Tiger", isNpc: false }] },

  // ============================================================
  // PREMIUM 2022
  // ============================================================
  { type: "PREMIUM", year: 2022, dateLabel: "December 20th – January 3rd", startDate: "2022-12-20", endDate: "2023-01-03", animals: [{ name: "Siberian Tiger", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "December 6th – December 20th", startDate: "2022-12-06", endDate: "2022-12-20", animals: [{ name: "Tasmanian Devil", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "November 22nd – December 6th", startDate: "2022-11-22", endDate: "2022-12-06", animals: [{ name: "Alpine Marmot", isNpc: false }, { name: "Himalayan Monal", isNpc: false }, { name: "Numbat", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "November 8th – November 22nd", startDate: "2022-11-08", endDate: "2022-11-22", animals: [{ name: "Giant Eland", isNpc: false }, { name: "Puffin", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "October 25th – November 8th", startDate: "2022-10-25", endDate: "2022-11-08", animals: [{ name: "Giant Eland", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "October 11th – October 25th", startDate: "2022-10-11", endDate: "2022-10-25", animals: [{ name: "American Hog-Nosed Skunk", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "September 27th – October 11th", startDate: "2022-09-27", endDate: "2022-10-11", animals: [{ name: "Ground Pangolin", isNpc: false }, { name: "Asian Garden Dormouse", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "September 13th – September 27th", startDate: "2022-09-13", endDate: "2022-09-27", animals: [{ name: "Golden Snub-Nosed Monkey", isNpc: false }, { name: "Sand Cat", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "August 30th – September 13th", startDate: "2022-08-30", endDate: "2022-09-13", animals: [{ name: "Indian Rhinoceros", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "August 16th – August 30th", startDate: "2022-08-16", endDate: "2022-08-30", animals: [{ name: "Emu", isNpc: false }, { name: "Red-Eyed Tree Frog", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "August 3rd – August 16th", startDate: "2022-08-03", endDate: "2022-08-16", animals: [{ name: "Black Bearded Saki", isNpc: false }, { name: "Red-Eyed Tree Frog", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "August 2nd – August 3rd", startDate: "2022-08-02", endDate: "2022-08-03", animals: [{ name: "Black Bearded Saki", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "July 19th – August 2nd", startDate: "2022-07-19", endDate: "2022-08-02", animals: [{ name: "Whiptail Wallaby", isNpc: false }, { name: "Tamandua", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "July 5th – July 19th", startDate: "2022-07-05", endDate: "2022-07-19", animals: [{ name: "Brown Hyena", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "June 21st – July 5th", startDate: "2022-06-21", endDate: "2022-07-05", animals: [{ name: "Japanese Serow", isNpc: false }, { name: "Lion Tamarin", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "June 7th – June 21st", startDate: "2022-06-07", endDate: "2022-06-21", animals: [{ name: "Bearded Pig", isNpc: false }, { name: "Giant Otter", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "May 24th – June 7th", startDate: "2022-05-24", endDate: "2022-06-07", animals: [{ name: "Sloth Bear", isNpc: false }, { name: "Giant Otter", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "May 10th – May 24th", startDate: "2022-05-10", endDate: "2022-05-24", animals: [{ name: "Hawksbill Sea Turtle", isNpc: false }, { name: "Platypus", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "April 26th – May 10th", startDate: "2022-04-26", endDate: "2022-05-10", animals: [{ name: "Dhole", isNpc: false }, { name: "Platypus", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "April 12th – April 26th", startDate: "2022-04-12", endDate: "2022-04-26", animals: [{ name: "Canadian Porcupine", isNpc: false }, { name: "Mississippi Alligator", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "March 29th – April 12th", startDate: "2022-03-29", endDate: "2022-04-12", animals: [{ name: "Banded Mongoose", isNpc: false }, { name: "Mississippi Alligator", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "March 22nd – March 29th", startDate: "2022-03-22", endDate: "2022-03-29", animals: [{ name: "Blackbuck", isNpc: false }, { name: "Mississippi Alligator", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "March 15th – March 22nd", startDate: "2022-03-15", endDate: "2022-03-22", animals: [{ name: "Blackbuck", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "March 1st – March 15th", startDate: "2022-03-01", endDate: "2022-03-15", animals: [{ name: "De Brazza's Monkey", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "February 15th – March 1st", startDate: "2022-02-15", endDate: "2022-03-01", animals: [{ name: "Red-Crowned Crane", isNpc: false }, { name: "Red Giant Octopus", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "February 1st – February 15th", startDate: "2022-02-01", endDate: "2022-02-15", animals: [{ name: "Tiger Shark", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "January 18th – February 1st", startDate: "2022-01-18", endDate: "2022-02-01", animals: [{ name: "Virginia Opossum", isNpc: false }] },
  { type: "PREMIUM", year: 2022, dateLabel: "January 4th – January 18th", startDate: "2022-01-04", endDate: "2022-01-18", animals: [{ name: "Wapiti", isNpc: false }, { name: "Arctic Ground Squirrel", isNpc: false }, { name: "Ferret Badger", isNpc: false }] },

  // ============================================================
  // PREMIUM 2021
  // ============================================================
  { type: "PREMIUM", year: 2021, dateLabel: "December 21st – January 4th", startDate: "2021-12-21", endDate: "2022-01-04", animals: [{ name: "Tasmanian Devil", isNpc: false }, { name: "Arctic Ground Squirrel", isNpc: false }, { name: "Ferret Badger", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "December 7th – December 21st", startDate: "2021-12-07", endDate: "2021-12-21", animals: [{ name: "Bush Dog", isNpc: false }, { name: "Arctic Ground Squirrel", isNpc: false }, { name: "Ferret Badger", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "November 23rd – December 7th", startDate: "2021-11-23", endDate: "2021-12-07", animals: [{ name: "Puffin", isNpc: false }, { name: "Ferret Badger", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "November 9th – November 23rd", startDate: "2021-11-09", endDate: "2021-11-23", animals: [{ name: "Aardwolf", isNpc: false }, { name: "Numbat", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "October 26th – November 9th", startDate: "2021-10-26", endDate: "2021-11-09", animals: [{ name: "American Hog-Nosed Skunk", isNpc: false }, { name: "Numbat", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "October 12th – October 26th", startDate: "2021-10-12", endDate: "2021-10-26", animals: [{ name: "Musk Deer", isNpc: false }, { name: "Numbat", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "September 28th – October 12th", startDate: "2021-09-28", endDate: "2021-10-12", animals: [{ name: "Golden Snub-Nosed Monkey", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "September 14th – September 28th", startDate: "2021-09-14", endDate: "2021-09-28", animals: [{ name: "Shoebill", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "August 31st – September 14th", startDate: "2021-08-31", endDate: "2021-09-14", animals: [{ name: "Emu", isNpc: false }, { name: "Sand Cat", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "August 17th – August 31st", startDate: "2021-08-17", endDate: "2021-08-31", animals: [{ name: "Bearded Vulture", isNpc: false }, { name: "Sand Cat", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "August 3rd – August 17th", startDate: "2021-08-03", endDate: "2021-08-17", animals: [{ name: "Whiptail Wallaby", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "July 20th – August 3rd", startDate: "2021-07-20", endDate: "2021-08-03", animals: [{ name: "Impala", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "July 6th – July 20th", startDate: "2021-07-06", endDate: "2021-07-20", animals: [{ name: "Japanese Serow", isNpc: false }, { name: "Sloth Bear", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "June 22nd – July 6th", startDate: "2021-06-22", endDate: "2021-07-06", animals: [{ name: "Sloth Bear", isNpc: false }, { name: "Panamanian White-Faced Capuchin", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "June 8th – June 22nd", startDate: "2021-06-08", endDate: "2021-06-22", animals: [{ name: "Sloth Bear", isNpc: false }, { name: "Beluga Whale", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "May 25th – June 8th", startDate: "2021-05-25", endDate: "2021-06-08", animals: [{ name: "Oryx", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "May 11th – May 25th", startDate: "2021-05-11", endDate: "2021-05-25", animals: [{ name: "Dhole", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "April 27th – May 11th", startDate: "2021-04-27", endDate: "2021-05-11", animals: [{ name: "Brushtail Possum", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "April 13th – April 27th", startDate: "2021-04-13", endDate: "2021-04-27", animals: [{ name: "Banded Mongoose", isNpc: false }, { name: "Himalayan Monal", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "March 30th – April 13th", startDate: "2021-03-30", endDate: "2021-04-13", animals: [{ name: "Musk Ox", isNpc: false }, { name: "Himalayan Monal", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "March 23rd – March 30th", startDate: "2021-03-23", endDate: "2021-03-30", animals: [{ name: "De Brazza's Monkey", isNpc: false }, { name: "Himalayan Monal", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "March 16th – March 23rd", startDate: "2021-03-16", endDate: "2021-03-23", animals: [{ name: "De Brazza's Monkey", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "March 2nd – March 16th", startDate: "2021-03-02", endDate: "2021-03-16", animals: [{ name: "Patas Monkey", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "February 16th – March 2nd", startDate: "2021-02-16", endDate: "2021-03-02", animals: [{ name: "Tiger Shark", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "February 2nd – February 16th", startDate: "2021-02-02", endDate: "2021-02-16", animals: [{ name: "Common Wombat", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "January 19th – February 2nd", startDate: "2021-01-19", endDate: "2021-02-02", animals: [{ name: "Wapiti", isNpc: false }] },
  { type: "PREMIUM", year: 2021, dateLabel: "January 5th – January 19th", startDate: "2021-01-05", endDate: "2021-01-19", animals: [{ name: "Bat-eared Fox", isNpc: false }, { name: "Honey Badger", isNpc: false }] },

  // ============================================================
  // PREMIUM 2020
  // ============================================================
  { type: "PREMIUM", year: 2020, dateLabel: "December 22nd – January 5th", startDate: "2020-12-22", endDate: "2021-01-05", animals: [{ name: "Bush Dog", isNpc: false }, { name: "Honey Badger", isNpc: false }, { name: "Manul", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "December 8th – December 22nd", startDate: "2020-12-08", endDate: "2020-12-22", animals: [{ name: "Tamandua", isNpc: false }, { name: "Honey Badger", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "November 23rd – December 8th", startDate: "2020-11-23", endDate: "2020-12-08", animals: [{ name: "Aardwolf", isNpc: false }, { name: "Honey Badger", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "November 10th – November 23rd", startDate: "2020-11-10", endDate: "2020-11-23", animals: [{ name: "Caracal", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "October 27th – November 10th", startDate: "2020-10-27", endDate: "2020-11-10", animals: [{ name: "Musk Deer", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "October 13th – October 27th", startDate: "2020-10-13", endDate: "2020-10-27", animals: [{ name: "Stoat", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "September 29th – October 13th", startDate: "2020-09-29", endDate: "2020-10-13", animals: [{ name: "Shoebill", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "September 15th – September 29th", startDate: "2020-09-15", endDate: "2020-09-29", animals: [{ name: "Wolverine", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "September 1st – September 15th", startDate: "2020-09-01", endDate: "2020-09-15", animals: [{ name: "Bearded Vulture", isNpc: false }, { name: "Giant Otter", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "August 18th – September 1st", startDate: "2020-08-18", endDate: "2020-09-01", animals: [{ name: "Northern Red-Billed Hornbill", isNpc: false }, { name: "Giant Otter", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "August 4th – August 18th", startDate: "2020-08-04", endDate: "2020-08-18", animals: [{ name: "Impala", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "July 21st – August 4th", startDate: "2020-07-21", endDate: "2020-08-04", animals: [{ name: "Goodfellow Tree Kangaroo", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "July 7th – July 21st", startDate: "2020-07-07", endDate: "2020-07-21", animals: [{ name: "Panamanian White-Faced Capuchin", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "June 23rd – July 7th", startDate: "2020-06-23", endDate: "2020-07-07", animals: [{ name: "Spotted Hyena", isNpc: false }, { name: "Red Giant Octopus", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "June 8th – June 23rd", startDate: "2020-06-08", endDate: "2020-06-23", animals: [{ name: "Beluga Whale", isNpc: false }, { name: "Red Giant Octopus", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "May 26th – June 8th", startDate: "2020-05-26", endDate: "2020-06-08", animals: [{ name: "Alligator Snapping Turtle", isNpc: false }, { name: "Platypus", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "May 12th – May 26th", startDate: "2020-05-12", endDate: "2020-05-26", animals: [{ name: "Oryx", isNpc: false }, { name: "Platypus", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "April 28th – May 12th", startDate: "2020-04-28", endDate: "2020-05-12", animals: [{ name: "Orangutan", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "April 14th – April 28th", startDate: "2020-04-14", endDate: "2020-04-28", animals: [{ name: "Brushtail Possum", isNpc: false }, { name: "Lion Tamarin", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "March 31st – April 14th", startDate: "2020-03-31", endDate: "2020-04-14", animals: [{ name: "African Wild Dog", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "March 17th – March 31st", startDate: "2020-03-17", endDate: "2020-03-31", animals: [{ name: "Musk Ox", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "March 3rd – March 17th", startDate: "2020-03-03", endDate: "2020-03-17", animals: [{ name: "Capybara", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "February 18th – March 3rd", startDate: "2020-02-18", endDate: "2020-03-03", animals: [{ name: "Patas Monkey", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "February 4th – February 18th", startDate: "2020-02-04", endDate: "2020-02-18", animals: [{ name: "Golden Takin", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "January 21st – February 4th", startDate: "2020-01-21", endDate: "2020-02-04", animals: [{ name: "Common Wombat", isNpc: false }] },
  { type: "PREMIUM", year: 2020, dateLabel: "January 7th – January 21st", startDate: "2020-01-07", endDate: "2020-01-21", animals: [{ name: "Red Ruffed Lemur", isNpc: false }, { name: "Red Giant Octopus", isNpc: false }] },

  // ============================================================
  // PREMIUM 2019
  // ============================================================
  { type: "PREMIUM", year: 2019, dateLabel: "December 10th – January 7th", startDate: "2019-12-10", endDate: "2020-01-07", animals: [{ name: "Bat-eared Fox", isNpc: false }, { name: "Red Giant Octopus", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "November 25th – December 10th", startDate: "2019-11-25", endDate: "2019-12-10", animals: [{ name: "Meerkat", isNpc: false }, { name: "Red Giant Octopus", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "November 12th – November 25th", startDate: "2019-11-12", endDate: "2019-11-25", animals: [{ name: "Tamandua", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "October 29th – November 12th", startDate: "2019-10-29", endDate: "2019-11-12", animals: [{ name: "White Stork", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "October 15th – October 29th", startDate: "2019-10-15", endDate: "2019-10-29", animals: [{ name: "Caracal", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "October 1st – October 15th", startDate: "2019-10-01", endDate: "2019-10-15", animals: [{ name: "Bactrian Camel", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "September 17th – October 1st", startDate: "2019-09-17", endDate: "2019-10-01", animals: [{ name: "Sloth", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "September 3rd – September 17th", startDate: "2019-09-03", endDate: "2019-09-17", animals: [{ name: "Stoat", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "August 20th – September 3rd", startDate: "2019-08-20", endDate: "2019-09-03", animals: [{ name: "Wolverine", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "August 6th – August 20th", startDate: "2019-08-06", endDate: "2019-08-20", animals: [{ name: "Coati", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "July 23rd – August 6th", startDate: "2019-07-23", endDate: "2019-08-06", animals: [{ name: "Northern Red-Billed Hornbill", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "July 9th – July 23rd", startDate: "2019-07-09", endDate: "2019-07-23", animals: [{ name: "Bongo Antelope", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "June 25th – July 9th", startDate: "2019-06-25", endDate: "2019-07-09", animals: [{ name: "Goodfellow Tree Kangaroo", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "June 11th – June 25th", startDate: "2019-06-11", endDate: "2019-06-25", animals: [{ name: "Alpine Ibex", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "May 28th – June 11th", startDate: "2019-05-28", endDate: "2019-06-11", animals: [{ name: "Spotted Hyena", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "May 14th – May 28th", startDate: "2019-05-14", endDate: "2019-05-28", animals: [{ name: "Sulphur-Crested Cockatoo", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "April 30th – May 14th", startDate: "2019-04-30", endDate: "2019-05-14", animals: [{ name: "Alligator Snapping Turtle", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "April 16th – April 30th", startDate: "2019-04-16", endDate: "2019-04-30", animals: [{ name: "Golden Pheasant", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "April 2nd – April 16th", startDate: "2019-04-02", endDate: "2019-04-16", animals: [{ name: "Orangutan", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "March 20th – April 2nd", startDate: "2019-03-20", endDate: "2019-04-02", animals: [{ name: "Fennec Fox", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "March 5th – March 20th", startDate: "2019-03-05", endDate: "2019-03-20", animals: [{ name: "African Wild Dog", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "February 19th – March 5th", startDate: "2019-02-19", endDate: "2019-03-05", animals: [{ name: "Leopard", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "February 5th – February 19th", startDate: "2019-02-05", endDate: "2019-02-19", animals: [{ name: "Capybara", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "January 22nd – February 5th", startDate: "2019-01-22", endDate: "2019-02-05", animals: [{ name: "Raccoon", isNpc: false }] },
  { type: "PREMIUM", year: 2019, dateLabel: "January 8th – January 22nd", startDate: "2019-01-08", endDate: "2019-01-22", animals: [{ name: "Golden Takin", isNpc: false }] },

  // ============================================================
  // PREMIUM 2018
  // ============================================================
  { type: "PREMIUM", year: 2018, dateLabel: "December 18th – January 8th", startDate: "2018-12-18", endDate: "2019-01-08", animals: [{ name: "Red Ruffed Lemur", isNpc: false }] },
  { type: "PREMIUM", year: 2018, dateLabel: "December 4th – December 18th", startDate: "2018-12-04", endDate: "2018-12-18", animals: [{ name: "Meerkat", isNpc: false }] },
  { type: "PREMIUM", year: 2018, dateLabel: "November 20th – December 4th", startDate: "2018-11-20", endDate: "2018-12-04", animals: [{ name: "White Stork", isNpc: false }] },
  { type: "PREMIUM", year: 2018, dateLabel: "November 5th – November 20th", startDate: "2018-11-05", endDate: "2018-11-20", animals: [{ name: "Sloth", isNpc: false }] },
  { type: "PREMIUM", year: 2018, dateLabel: "October – November 5th", startDate: null, endDate: null, animals: [{ name: "Bongo Antelope", isNpc: false }] },
  { type: "PREMIUM", year: 2018, dateLabel: "October", startDate: null, endDate: null, animals: [{ name: "Alpine Ibex", isNpc: false }] },
  { type: "PREMIUM", year: 2018, dateLabel: "October", startDate: null, endDate: null, animals: [{ name: "Coati", isNpc: false }] },
  { type: "PREMIUM", year: 2018, dateLabel: "September", startDate: null, endDate: null, animals: [{ name: "Sulphur-Crested Cockatoo", isNpc: false }] },
  { type: "PREMIUM", year: 2018, dateLabel: "?", startDate: null, endDate: null, animals: [{ name: "Bactrian Camel", isNpc: false }] },

  // ============================================================
  // VIP 2026
  // ============================================================
  { type: "VIP", year: 2026, dateLabel: "September 22nd – November 17th", startDate: "2026-09-22", endDate: "2026-11-17", animals: [{ name: "Giant Squid", isNpc: false }, { name: "Gilbert Grump NPC", isNpc: true }] },
  { type: "VIP", year: 2026, dateLabel: "July 28th – September 22nd", startDate: "2026-07-28", endDate: "2026-09-22", animals: [{ name: "Golden Eagle", isNpc: false }, { name: "Mr. Mayor NPC", isNpc: true }] },
  { type: "VIP", year: 2026, dateLabel: "June 2nd – July 28th", startDate: "2026-06-02", endDate: "2026-07-28", animals: [{ name: "Leatherback Sea Turtle", isNpc: false }, { name: "Orange Zoo Cat NPC", isNpc: true }] },
  { type: "VIP", year: 2026, dateLabel: "April 21st – June 2nd", startDate: "2026-04-21", endDate: "2026-06-02", animals: [{ name: "Ocean Sunfish", isNpc: false }, { name: "Kingfisher", isNpc: false }, { name: "Administrator Derek NPC", isNpc: true }] },
  { type: "VIP", year: 2026, dateLabel: "April 7th – April 21st", startDate: "2026-04-07", endDate: "2026-04-21", animals: [{ name: "Ocean Sunfish", isNpc: false }, { name: "Administrator Derek NPC", isNpc: true }] },
  { type: "VIP", year: 2026, dateLabel: "February 10th – April 7th", startDate: "2026-02-10", endDate: "2026-04-07", animals: [{ name: "Ethiopian Lion", isNpc: false }, { name: "Zoo Cat NPC", isNpc: true }] },
  { type: "VIP", year: 2026, dateLabel: "January 27th – February 10th", startDate: "2026-01-27", endDate: "2026-02-10", animals: [{ name: "Perentie", isNpc: false }, { name: "Kai Wailani NPC", isNpc: true }] },

  // ============================================================
  // VIP 2025
  // ============================================================
  { type: "VIP", year: 2025, dateLabel: "December 16th – January 27th", startDate: "2025-12-16", endDate: "2026-01-27", animals: [{ name: "Perentie", isNpc: false }, { name: "Common Woolly Monkey", isNpc: false }, { name: "Kai Wailani NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "November 25th – December 16th", startDate: "2025-11-25", endDate: "2025-12-16", animals: [{ name: "Dalmatian Pelican", isNpc: false }, { name: "Common Woolly Monkey", isNpc: false }, { name: "Curt NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "October 21st – November 25th", startDate: "2025-10-21", endDate: "2025-11-25", animals: [{ name: "Dalmatian Pelican", isNpc: false }, { name: "Curt NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "August 26th – October 21st", startDate: "2025-08-26", endDate: "2025-10-21", animals: [{ name: "Przewalski's Horse", isNpc: false }, { name: "Kaitlyn NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "July 15th – August 26th", startDate: "2025-07-15", endDate: "2025-08-26", animals: [{ name: "Rusty-Spotted Cat", isNpc: false }, { name: "Jenkins NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "July 1st – July 15th", startDate: "2025-07-01", endDate: "2025-07-15", animals: [{ name: "Whale Shark", isNpc: false }, { name: "Madame Yu NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "June 3rd – July 1st", startDate: "2025-06-03", endDate: "2025-07-01", animals: [{ name: "Whale Shark", isNpc: false }, { name: "Common Vampire Bat", isNpc: false }, { name: "Madame Yu NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "May 20th – June 3rd", startDate: "2025-05-20", endDate: "2025-06-03", animals: [{ name: "Whale Shark", isNpc: false }, { name: "Madame Yu NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "May 6th – May 20th", startDate: "2025-05-06", endDate: "2025-05-20", animals: [{ name: "Whale Shark", isNpc: false }, { name: "Yuriy Wolkow NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "March 11th – May 6th", startDate: "2025-03-11", endDate: "2025-05-06", animals: [{ name: "Borneo Elephant", isNpc: false }, { name: "Yuriy Wolkow NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "February 25th – March 11th", startDate: "2025-02-25", endDate: "2025-03-11", animals: [{ name: "Yacare Caiman", isNpc: false }, { name: "Florentina May NPC", isNpc: true }] },
  { type: "VIP", year: 2025, dateLabel: "January 14th – February 25th", startDate: "2025-01-14", endDate: "2025-02-25", animals: [{ name: "Yacare Caiman", isNpc: false }, { name: "Leafy Seadragon", isNpc: false }, { name: "Florentina May NPC", isNpc: true }] },

  // ============================================================
  // VIP 2024
  // ============================================================
  { type: "VIP", year: 2024, dateLabel: "November 26th – January 14th", startDate: "2024-11-26", endDate: "2025-01-14", animals: [{ name: "Gaur", isNpc: false }, { name: "Pacific Sea Eagle", isNpc: false }, { name: "Stella NPC", isNpc: true }] },
  { type: "VIP", year: 2024, dateLabel: "November 19th – November 26th", startDate: "2024-11-19", endDate: "2024-11-26", animals: [{ name: "Gaur", isNpc: false }, { name: "Stella NPC", isNpc: true }] },
  { type: "VIP", year: 2024, dateLabel: "September 24th – November 19th", startDate: "2024-09-24", endDate: "2024-11-19", animals: [{ name: "Asian Elephant", isNpc: false }, { name: "Student Erik NPC", isNpc: true }] },
  { type: "VIP", year: 2024, dateLabel: "July 30th – September 24th", startDate: "2024-07-30", endDate: "2024-09-24", animals: [{ name: "Scarlet Ibis", isNpc: false }, { name: "Pygmy Hippopotamus", isNpc: false }, { name: "Ranger Johnny NPC", isNpc: true }] },
  { type: "VIP", year: 2024, dateLabel: "July 2nd – July 30th", startDate: "2024-07-02", endDate: "2024-07-30", animals: [{ name: "Lady Amherst's Pheasant", isNpc: false }, { name: "Pygmy Hippopotamus", isNpc: false }, { name: "Dory NPC", isNpc: true }] },
  { type: "VIP", year: 2024, dateLabel: "June 4th – July 2nd", startDate: "2024-06-04", endDate: "2024-07-02", animals: [{ name: "Lady Amherst's Pheasant", isNpc: false }, { name: "Common Vampire Bat", isNpc: false }, { name: "Dory NPC", isNpc: true }] },
  { type: "VIP", year: 2024, dateLabel: "May 7th – June 4th", startDate: "2024-05-07", endDate: "2024-06-04", animals: [{ name: "Western Lowland Gorilla", isNpc: false }, { name: "Common Vampire Bat", isNpc: false }, { name: "Dr. Byrd NPC", isNpc: true }] },
  { type: "VIP", year: 2024, dateLabel: "February 13th – May 7th", startDate: "2024-02-13", endDate: "2024-05-07", animals: [{ name: "Sumatran Rhinoceros", isNpc: false }, { name: "Baroness Victoria NPC", isNpc: true }] },

  // ============================================================
  // VIP 2023
  // ============================================================
  { type: "VIP", year: 2023, dateLabel: "December 19th – February 13th", startDate: "2023-12-19", endDate: "2024-02-13", animals: [{ name: "Angora Rabbit", isNpc: false }, { name: "Gilbert Grump NPC", isNpc: true }] },
  { type: "VIP", year: 2023, dateLabel: "November 21st – December 19th", startDate: "2023-11-21", endDate: "2023-12-19", animals: [{ name: "Humpback Whale", isNpc: false }, { name: "Leafy Seadragon", isNpc: false }, { name: "Mr. Mayor NPC", isNpc: true }] },
  { type: "VIP", year: 2023, dateLabel: "October 10th – November 21st", startDate: "2023-10-10", endDate: "2023-11-21", animals: [{ name: "Spectacled Bear", isNpc: false }, { name: "Mr. Mayor NPC", isNpc: true }] },
  { type: "VIP", year: 2023, dateLabel: "September 26th – October 11th", startDate: "2023-09-26", endDate: "2023-10-11", animals: [{ name: "Sawfish", isNpc: false }, { name: "Mr. Mayor NPC", isNpc: true }] },
  { type: "VIP", year: 2023, dateLabel: "July 18th – September 26th", startDate: "2023-07-18", endDate: "2023-09-26", animals: [{ name: "Masai Giraffe", isNpc: false }, { name: "Luna Lionfish", isNpc: false }] },
  { type: "VIP", year: 2023, dateLabel: "May 9th – July 18th", startDate: "2023-05-09", endDate: "2023-07-18", animals: [{ name: "Sumatran Tiger", isNpc: false }, { name: "Orange Zoo Cat NPC", isNpc: true }] },
  { type: "VIP", year: 2023, dateLabel: "March 14th – May 9th", startDate: "2023-03-14", endDate: "2023-05-09", animals: [{ name: "Grévy's Zebra", isNpc: false }, { name: "Axolotl", isNpc: false }] },
  { type: "VIP", year: 2023, dateLabel: "February 14th – March 14th", startDate: "2023-02-14", endDate: "2023-03-14", animals: [{ name: "Commerson's Dolphin", isNpc: false }] },
  { type: "VIP", year: 2023, dateLabel: "January 31st – February 14th", startDate: "2023-01-31", endDate: "2023-02-14", animals: [{ name: "Commerson's Dolphin", isNpc: false }, { name: "Andean Condor", isNpc: false }] },
  { type: "VIP", year: 2023, dateLabel: "January 17th – January 31st", startDate: "2023-01-17", endDate: "2023-01-31", animals: [{ name: "Commerson's Dolphin", isNpc: false }] },

  // ============================================================
  // VIP 2022
  // ============================================================
  { type: "VIP", year: 2022, dateLabel: "December 6th – January 17th", startDate: "2022-12-06", endDate: "2023-01-17", animals: [{ name: "Andean Condor", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "November 22nd – December 6th", startDate: "2022-11-22", endDate: "2022-12-06", animals: [{ name: "Andean Condor", isNpc: false }, { name: "Kiwi", isNpc: false }, { name: "Pink Fairy Armadillo", isNpc: false }, { name: "Zoo Cat NPC", isNpc: true }] },
  { type: "VIP", year: 2022, dateLabel: "October 11th – November 22nd", startDate: "2022-10-11", endDate: "2022-11-22", animals: [{ name: "Guereza", isNpc: false }, { name: "Zoo Cat NPC", isNpc: true }] },
  { type: "VIP", year: 2022, dateLabel: "September 27th – October 11th", startDate: "2022-09-27", endDate: "2022-10-11", animals: [{ name: "Guereza", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "August 3rd – September 27th", startDate: "2022-08-03", endDate: "2022-09-27", animals: [{ name: "Gerenuk", isNpc: false }, { name: "Parson's Chameleon", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "August 2nd – August 3rd", startDate: "2022-08-02", endDate: "2022-08-03", animals: [{ name: "Gerenuk", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "July 19th – August 2nd", startDate: "2022-07-19", endDate: "2022-08-02", animals: [{ name: "Hammerhead Shark", isNpc: false }, { name: "Bottle Nosed Dolphin", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "June 21st – July 19th", startDate: "2022-06-21", endDate: "2022-07-19", animals: [{ name: "Hammerhead Shark", isNpc: false }, { name: "Dromedary", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "June 7th – June 21st", startDate: "2022-06-07", endDate: "2022-06-21", animals: [{ name: "Hammerhead Shark", isNpc: false }, { name: "Manatee", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "May 24th – June 7th", startDate: "2022-05-24", endDate: "2022-06-07", animals: [{ name: "Nile Monitor", isNpc: false }, { name: "Manatee", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "April 26th – May 24th", startDate: "2022-04-26", endDate: "2022-05-24", animals: [{ name: "Nile Monitor", isNpc: false }, { name: "Orca", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "April 12th – April 26th", startDate: "2022-04-12", endDate: "2022-04-26", animals: [{ name: "Nile Monitor", isNpc: false }, { name: "Giant Sengi", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "March 22nd – April 12th", startDate: "2022-03-22", endDate: "2022-04-12", animals: [{ name: "Yakutian Horse", isNpc: false }, { name: "Giant Sengi", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "March 1st – March 22nd", startDate: "2022-03-01", endDate: "2022-03-22", animals: [{ name: "Yakutian Horse", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "February 15th – March 1st", startDate: "2022-02-15", endDate: "2022-03-01", animals: [{ name: "Yakutian Horse", isNpc: false }, { name: "Kiwi", isNpc: false }] },
  { type: "VIP", year: 2022, dateLabel: "February 1st – February 15th", startDate: "2022-02-01", endDate: "2022-02-15", animals: [{ name: "Silvery Greater Galago", isNpc: false }] },

  // ============================================================
  // VIP 2021
  // ============================================================
  { type: "VIP", year: 2021, dateLabel: "December 21st – February 1st", startDate: "2021-12-21", endDate: "2022-02-01", animals: [{ name: "Silvery Greater Galago", isNpc: false }, { name: "Pink Fairy Armadillo", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "November 23rd – December 21st", startDate: "2021-11-23", endDate: "2021-12-21", animals: [{ name: "Binturong", isNpc: false }, { name: "Pink Fairy Armadillo", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "October 26th – November 23rd", startDate: "2021-10-26", endDate: "2021-11-23", animals: [{ name: "Binturong", isNpc: false }, { name: "Sugar Glider", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "October 12th – October 26th", startDate: "2021-10-12", endDate: "2021-10-26", animals: [{ name: "African Golden Cat", isNpc: false }, { name: "Sugar Glider", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "September 14th – October 12th", startDate: "2021-09-14", endDate: "2021-10-12", animals: [{ name: "African Golden Cat", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "August 31st – September 14th", startDate: "2021-08-31", endDate: "2021-09-14", animals: [{ name: "African Golden Cat", isNpc: false }, { name: "Dromedary", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "August 17th – August 31st", startDate: "2021-08-17", endDate: "2021-08-31", animals: [{ name: "Mexican Tree Porcupine", isNpc: false }, { name: "Dromedary", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "August 3rd – August 17th", startDate: "2021-08-03", endDate: "2021-08-17", animals: [{ name: "Mexican Tree Porcupine", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "July 6th – August 3rd", startDate: "2021-07-06", endDate: "2021-08-03", animals: [{ name: "Mexican Tree Porcupine", isNpc: false }, { name: "Manatee", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "June 8th – July 6th", startDate: "2021-06-08", endDate: "2021-07-06", animals: [{ name: "Narwhal", isNpc: false }, { name: "Manatee", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "May 11th – June 8th", startDate: "2021-05-11", endDate: "2021-06-08", animals: [{ name: "Narwhal", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "April 27th – May 11th", startDate: "2021-04-27", endDate: "2021-05-11", animals: [{ name: "Cougar", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "March 23rd – April 27th", startDate: "2021-03-23", endDate: "2021-04-27", animals: [{ name: "Cougar", isNpc: false }, { name: "Kiwi", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "March 16th – March 23rd", startDate: "2021-03-16", endDate: "2021-03-23", animals: [{ name: "Cougar", isNpc: false }] },
  { type: "VIP", year: 2021, dateLabel: "January 19th – March 16th", startDate: "2021-01-19", endDate: "2021-03-16", animals: [{ name: "Yak", isNpc: false }] },

  // ============================================================
  // VIP 2020
  // ============================================================
  { type: "VIP", year: 2020, dateLabel: "November 23rd – January 19th", startDate: "2020-11-23", endDate: "2021-01-19", animals: [{ name: "Cheetah", isNpc: false }, { name: "Orca", isNpc: false }] },
  { type: "VIP", year: 2020, dateLabel: "October 27th – November 23rd", startDate: "2020-10-27", endDate: "2020-11-23", animals: [{ name: "Cheetah", isNpc: false }] },
  { type: "VIP", year: 2020, dateLabel: "September 1st – October 27th", startDate: "2020-09-01", endDate: "2020-10-27", animals: [{ name: "Giant Anteater", isNpc: false }] },
  { type: "VIP", year: 2020, dateLabel: "July 7th – September 1st", startDate: "2020-07-07", endDate: "2020-09-01", animals: [{ name: "Clouded Leopard", isNpc: false }] },
  { type: "VIP", year: 2020, dateLabel: "June 8th – July 7th", startDate: "2020-06-08", endDate: "2020-07-07", animals: [{ name: "African Civet", isNpc: false }, { name: "Bottle Nosed Dolphin", isNpc: false }] },
  { type: "VIP", year: 2020, dateLabel: "May 12th – June 8th", startDate: "2020-05-12", endDate: "2020-06-08", animals: [{ name: "African Civet", isNpc: false }] },
  { type: "VIP", year: 2020, dateLabel: "March 17th – May 12th", startDate: "2020-03-17", endDate: "2020-05-12", animals: [{ name: "Crested Porcupine", isNpc: false }, { name: "Lion Tamarin Golden-Headed", isNpc: false }] },
  { type: "VIP", year: 2020, dateLabel: "January 21st – March 17th", startDate: "2020-01-21", endDate: "2020-03-17", animals: [{ name: "Kakapo", isNpc: false }] },

  // ============================================================
  // VIP 2019
  // ============================================================
  { type: "VIP", year: 2019, dateLabel: "November 25th – January 21st", startDate: "2019-11-25", endDate: "2020-01-21", animals: [{ name: "Canadian Lynx", isNpc: false }, { name: "Bottle Nosed Dolphin", isNpc: false }] },
  { type: "VIP", year: 2019, dateLabel: "October 8th – November 25th", startDate: "2019-10-08", endDate: "2019-11-25", animals: [{ name: "Canadian Lynx", isNpc: false }] },
  { type: "VIP", year: 2019, dateLabel: "July 16th – October 8th", startDate: "2019-07-16", endDate: "2019-10-08", animals: [{ name: "Eastern Grass Owl", isNpc: false }] },
  { type: "VIP", year: 2019, dateLabel: "April 22nd – July 16th", startDate: "2019-04-22", endDate: "2019-07-16", animals: [{ name: "Ringtail", isNpc: false }] },
  { type: "VIP", year: 2019, dateLabel: "January 22nd – April 22nd", startDate: "2019-01-22", endDate: "2019-04-22", animals: [{ name: "Kinkajou", isNpc: false }] },
  { type: "VIP", year: 2019, dateLabel: "January 1st – January 22nd", startDate: "2019-01-01", endDate: "2019-01-22", animals: [{ name: "Warthog", isNpc: false }] },

  // ============================================================
  // VIP 2018
  // ============================================================
  { type: "VIP", year: 2018, dateLabel: "November – December", startDate: null, endDate: null, animals: [{ name: "Warthog", isNpc: false }] },
  { type: "VIP", year: 2018, dateLabel: "September – October", startDate: null, endDate: null, animals: [{ name: "Bengal Tiger", isNpc: false }] },
];

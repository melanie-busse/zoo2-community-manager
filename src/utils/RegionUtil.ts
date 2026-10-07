export interface RegionFormData {
  id?: number;
  identifier: string;
  terrainid: string;
  releasedate: string;
  unlocklevel: string;
  price: string;
  priceTypeId: string;
  regionTexts: Array<{ languageCode: string; name: string }>;
  breedingCenter: { price: string; pricetype: string };
  breedingCenterSlots: Array<{ id: number | string; slot: string; price: string; pricetype: string }>;
  admissionsBooths: Array<{ id: number | string; booth_level: string; max_capacity: string; upgrade: string; pricetype: string }>;
  adminBuilding: { price: string; pricetype: string };
  visitorCenter: { price: string; pricetype: string };
  transportStation: { price: string; pricetype: string };
  hasGuestLounge: boolean;
  guestLounge: { price: string; pricetype: string };
}

const DEFAULT_BUILDING = { price: "", pricetype: "1" };

function toStr(v: number | undefined | null): string {
  return v != null ? String(v) : "";
}

function toDateStr(v: Date | string | undefined | null): string {
  if (!v) return "";
  return new Date(v).toISOString().split("T")[0];
}

function mapBuilding(arr: Array<{ price: number; pricetype: number }> | undefined): { price: string; pricetype: string } {
  const item = arr?.[0];
  if (!item) return DEFAULT_BUILDING;
  return { price: toStr(item.price), pricetype: toStr(item.pricetype) };
}

export function mapRegionToForm(
  region: any | null,
  languages: Array<{ code: string; name: string }>
): RegionFormData {
  if (!region) {
    return {
      identifier: "",
      terrainid: "0",
      releasedate: "",
      unlocklevel: "0",
      price: "0",
      priceTypeId: "1",
      regionTexts: languages.map(l => ({ languageCode: l.code, name: "" })),
      breedingCenter: { ...DEFAULT_BUILDING },
      breedingCenterSlots: [],
      admissionsBooths: [],
      adminBuilding: { ...DEFAULT_BUILDING },
      visitorCenter: { ...DEFAULT_BUILDING },
      transportStation: { ...DEFAULT_BUILDING },
      hasGuestLounge: false,
      guestLounge: { ...DEFAULT_BUILDING },
    };
  }

  // Build regionTexts: one entry per language, fill missing with empty
  const textMap = new Map<string, string>();
  for (const t of region.regionTexts ?? []) {
    textMap.set(t.languageCode, t.name);
  }
  const regionTexts = languages.map(l => ({
    languageCode: l.code,
    name: textMap.get(l.code) ?? "",
  }));

  const hasGuestLounge = (region.guestLounges?.length ?? 0) > 0;

  return {
    id: region.id,
    identifier: region.identifier ?? "",
    terrainid: toStr(region.terrainid),
    releasedate: toDateStr(region.releasedate),
    unlocklevel: toStr(region.unlocklevel),
    price: toStr(region.price),
    priceTypeId: toStr(region.priceTypeId ?? 1),
    regionTexts,
    breedingCenter: mapBuilding(region.breedingCenters),
    breedingCenterSlots: (region.breedingCenterSlots ?? []).map((s: any, i: number) => ({
      id: s.id ?? i,
      slot: toStr(s.slot),
      price: toStr(s.price),
      pricetype: toStr(s.pricetype),
    })),
    admissionsBooths: (region.admissionsBooths ?? []).map((b: any, i: number) => ({
      id: b.id ?? i,
      booth_level: toStr(b.booth_level),
      max_capacity: toStr(b.max_capacity),
      upgrade: toStr(b.upgrade),
      pricetype: toStr(b.pricetype),
    })),
    adminBuilding: mapBuilding(region.adminBuildings),
    visitorCenter: mapBuilding(region.visitorCenters),
    transportStation: mapBuilding(region.transportStation),
    hasGuestLounge,
    guestLounge: mapBuilding(region.guestLounges),
  };
}

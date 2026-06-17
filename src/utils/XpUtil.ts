import { Xp } from "@/types/xp";

/**
 * Calculates the total sum of XP values.
 * Safely handles null, undefined, or empty arrays.
 */
export function sumXP(xp: Xp[] | null | undefined): number {
  if (!xp || xp.length === 0) {
    return 0;
  }

  return xp.reduce((sum, item) => sum + (item.xpValue || 0), 0);
}

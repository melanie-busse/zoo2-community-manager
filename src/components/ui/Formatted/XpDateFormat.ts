/**
 * Formats a total number of minutes into a readable "HH h MM min" string.
 * Returns a dash "–" if the input is falsy or zero.
 */
export const formatMinutes = (totalMinutes: number | null | undefined): string => {
  if (!totalMinutes || totalMinutes === 0) return "–";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, "0")} h ${minutes.toString().padStart(2, "0")} min`;
};
